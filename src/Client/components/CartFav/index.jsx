import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./CartFav.module.scss";
import { getDetailProduct } from "../../../services/product.service";
import { removeFromLike } from "../../../services/like.service";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

function CartFav({ like, setLike }) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (
        !like ||
        !Array.isArray(like.products) ||
        like.products.length === 0
      ) {
        console.log("Chưa thích sản phẩm nào");
        setProducts([]); // Xóa danh sách sản phẩm nếu không có sản phẩm nào
        return;
      }

      try {
        const productDetails = await Promise.all(
          like.products
            .filter((item) => item && item._id) // Lọc bỏ phần tử null hoặc không hợp lệ
            .map(async (item) => {
              try {
                const product = await getDetailProduct(item._id);

                if (!product || product.length === 0) {
                  console.warn(
                    `⚠️ Không tìm thấy sản phẩm với _id: ${item._id}`
                  );
                  return null;
                }

                return {
                  id: product[0]._id,
                  thumbnail: Array.isArray(product[0].thumbnail)
                    ? product[0].thumbnail[0]
                    : product[0].thumbnail,
                  title: product[0].title,
                  price: product[0].price,
                  slug: product[0].slug,
                  discountPercentage: product[0].discountPercentage,
                };
              } catch (error) {
                console.error(
                  `❌ Lỗi khi lấy sản phẩm _id: ${item._id}`,
                  error
                );
                return null;
              }
            })
        );

        setProducts(productDetails.filter((item) => item !== null)); // Lọc bỏ sản phẩm null
      } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin sản phẩm:", error);
      }
    };

    fetchProductDetails();
  }, [like]);

  const handleRemoveLike = async (id) => {
    const response = await removeFromLike(like.user_id, id);
    if (response) {
      console.log("Xóa sản phẩm thành công", response);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
      setLike(response.like);
    }
  };

  const handleNavigate = (slug) => {
    navigate(`/detailProduct/${slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={cx("div-cart")}>
      {products.map((product) => (
        <div className={cx("product")} key={product.id}>
          <div className={cx("img-product")}>
            <img src={product.thumbnail} alt="" />
          </div>
          <div className={cx("info-product")}>
            <div className={cx("title-product")}>
              {/* <div className={cx("description-product")}>Sản phẩm 1</div> */}
              <div
                style={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={() => handleNavigate(product.slug)}
              >
                {product.title}
              </div>
            </div>

            <div className={cx("number-product")}>
              <div className={cx("price-product")}>
                <div className={cx("price")}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(
                    product.price -
                      (product.price * product.discountPercentage) / 100
                  )}
                </div>
              </div>
              <div
                className={cx("btn-remove")}
                onClick={() => handleRemoveLike(product.id)}
              >
                <button>Xóa</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CartFav;
