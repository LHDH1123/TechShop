import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Cart.module.scss";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { getDetailProduct } from "../../../services/product.service";
import {
  removeFromCart,
  updateCartQuantity,
} from "../../../services/cart.service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const cx = classNames.bind(styles);

function Cart({ cart, setCart, setSelectCart }) {
  const [products, setProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Lấy thông tin sản phẩm từ API
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!cart || !cart.products) return;

      try {
        const productDetails = await Promise.all(
          cart.products.map(async (item) => {
            const product = await getDetailProduct(item.product_id);
            return {
              id: product[0]._id,
              thumbnail: Array.isArray(product[0].thumbnail)
                ? product[0].thumbnail[0]
                : product[0].thumbnail,
              SKU: product[0].SKU,
              title: product[0].title,
              price: product[0].price,
              slug: product[0].slug,
              discountPercentage: product[0].discountPercentage,
              quantity: item.quantity, // Lấy số lượng từ cart
            };
          })
        );

        setProducts(productDetails);
      } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin sản phẩm:", error);
      }
    };

    fetchProductDetails();
  }, [cart]);

  useEffect(() => {
    const loadGuestCart = async () => {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];

      // Gọi API lấy chi tiết từng sản phẩm
      const productDetails = await Promise.all(
        guestCart.map(async (item) => {
          const product = await getDetailProduct(item.product_id);
          return {
            id: product[0]._id,
            thumbnail: Array.isArray(product[0].thumbnail)
              ? product[0].thumbnail[0]
              : product[0].thumbnail,
            SKU: product[0].SKU,
            title: product[0].title,
            price: product[0].price,
            slug: product[0].slug,
            discountPercentage: product[0].discountPercentage,
            quantity: item.quantity,
          };
        })
      );

      setProducts(productDetails);

      // ✅ Cập nhật lại cart sau khi lấy đủ chi tiết
      setCart({
        ...cart,
        user_id: null,
        products: productDetails.map((p) => ({
          product_id: p.id,
          quantity: p.quantity,
          price: p.price,
          discountPercentage: p.discountPercentage,
        })),
      });
    };

    if (!user?._id) {
      loadGuestCart();
    }
  }, [user]);

  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, quantity: newQuantity } : product
      )
    );

    if (user?._id) {
      const response = await updateCartQuantity(cart.user_id, id, newQuantity);
      if (!response) {
        console.error("❌ Cập nhật số lượng thất bại");
      } else {
        setCart(response.cart);
      }
    } else {
      // Guest → cập nhật localStorage + setCart giả định
      const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
      const updatedCart = guestCart.map((item) =>
        item.product_id === id ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem("guest_cart", JSON.stringify(updatedCart));

      // Giả lập object `cart` để setCart
      const guestCartData = {
        user_id: null,
        products: updatedCart,
      };
      setCart(guestCartData);
    }
  };

  const handleRemoveCart = async (id) => {
    if (user?._id) {
      const response = await removeFromCart(cart.user_id, id);
      if (response) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== id)
        );
        setCart(response.cart);
      }
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guest_cart")) || [];
      const updatedCart = guestCart.filter((item) => item.product_id !== id);
      localStorage.setItem("guest_cart", JSON.stringify(updatedCart));

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );

      setCart({
        user_id: null,
        products: updatedCart,
      });
    }
  };

  const handleNavigate = (id, slug) => {
    navigate(`/detailProduct/${slug}`, { state: { id } });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedProducts(products.map((product) => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (id) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((pid) => pid !== id)
        : [...prevSelected, id]
    );
  };

  useEffect(() => {
    setSelectAll(
      selectedProducts.length === products.length && products.length > 0
    );
  }, [selectedProducts, products]);

  useEffect(() => {
    if (!cart || !cart.products) return;

    // Lọc sản phẩm trong cart dựa trên selectedProducts
    const filteredCart = {
      ...cart, // Giữ nguyên các thông tin khác trong cart
      products: cart.products.filter((item) =>
        selectedProducts.includes(item.product_id)
      ),
    };

    setSelectCart(filteredCart);
  }, [selectedProducts, cart, setSelectCart]);

  return (
    <div className={cx("div-cart")}>
      <div className={cx("cart")}>
        <input
          type="checkbox"
          className={cx("cb")}
          checked={selectAll}
          onChange={handleSelectAll}
          style={{
            width: "18px",
            height: "18px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            accentColor: "#fe9f43", // accent-color dùng camelCase
          }}
        />

        <div className={cx("title")}>Chọn tất cả</div>
      </div>
      <div className={cx("saperator")}></div>

      <div className={cx("body")}>
        {products.map((product) => (
          <div className={cx("product")} key={product.id}>
            <input
              type="checkbox"
              className={cx("cb")}
              checked={selectedProducts.includes(product.id)}
              onChange={() => handleSelectProduct(product.id)}
            />
            <div className={cx("img-product")}>
              <img src={product.thumbnail} alt={product.title} />
            </div>
            <div className={cx("info-product")}>
              <div className={cx("title-product")}>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => handleNavigate(product.id, product.slug)}
                >
                  {product.title}
                </div>
                <div
                  className={cx("remove-cart")}
                  onClick={() => handleRemoveCart(product.id)}
                >
                  <button>
                    <RemoveIcon fontSize="inherit" />
                  </button>
                </div>
              </div>

              <div className={cx("code-product")}>SKU: {product.SKU}</div>

              <div className={cx("number-product")}>
                <div className={cx("number")}>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(product.id, product.quantity - 1)
                    }
                  >
                    <RemoveIcon
                      fontSize="inherit"
                      style={{
                        fontSize: "12px",
                        stroke: "currentColor",
                        strokeWidth: 1,
                      }}
                    />
                  </button>
                  <div className={cx("quantity")}>{product.quantity}</div>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(product.id, product.quantity + 1)
                    }
                  >
                    <AddIcon
                      fontSize="inherit"
                      style={{
                        fontSize: "12px",
                        stroke: "currentColor",
                        strokeWidth: 1,
                      }}
                    />
                  </button>
                </div>
                {product.discountPercentage === 0 ? (
                  <div className={cx("price-product")}>
                    <div className={cx("new-price")}>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.price)}
                    </div>
                  </div>
                ) : (
                  <div className={cx("price-product")}>
                    <div className={cx("price")}>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(product.price)}
                    </div>
                    <div className={cx("new-price")}>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(
                        product.price -
                          (product.price * product.discountPercentage) / 100
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cart;
