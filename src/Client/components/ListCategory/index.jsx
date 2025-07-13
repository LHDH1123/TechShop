import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ListCategory.module.scss";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  getAllProductName,
  // getAllProducts,
  getAllProductSlug,
} from "../../../services/product.service";
import { Skeleton, Pagination } from "@mui/material";

const cx = classNames.bind(styles);

function ListCategory({
  slug,
  onTotalChange,
  selectedPriceRanges,
  selectedBrands,
  selectedCategories,
  filteredProducts,
  setFilteredProducts,
  setAllProducts,
}) {
  const linkHref = "https://www.amazon.com";

  const scrollableRef = useRef(null);
  const [listProduct, setListProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const fetchData = async () => {
    setLoading(true);
    try {
      let products = [];
      if (slug) {
        products = await getAllProductSlug(1, 1000, slug);
      } else {
        products = await getAllProductName(1, 1000, slug);
      }
      console.log(products);

      if (products) {
        setListProduct(products);
        setAllProducts(products);
        onTotalChange(products.length);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  useEffect(() => {
    const filtered = listProduct.filter((product) => {
      const price = product.price;
      const matchesPrice =
        selectedPriceRanges.length === 0 ||
        selectedPriceRanges.some((range) => {
          switch (range) {
            case "Under $25":
              return price < 25;
            case "$25 to $50":
              return price >= 25 && price <= 50;
            case "$50 to $100":
              return price > 50 && price <= 100;
            case "$100 to $200":
              return price > 100 && price <= 200;
            case "$200 & Above":
              return price > 200;
            default:
              return true;
          }
        });

      const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrands.includes(product.nameBrand);

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.nameCategory);

      return matchesPrice && matchesBrand && matchesCategory;
    });

    setFilteredProducts(filtered);
    onTotalChange(filtered.length);
  }, [listProduct, selectedPriceRanges, selectedCategories]);

  // Reset trang khi lọc hoặc slug thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [slug, selectedPriceRanges, selectedCategories]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    scrollableRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPage = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className={cx("list")}>
      <div className={cx("scroll-list")}>
        <div className={cx("list_product")} ref={scrollableRef}>
          {loading
            ? [...Array(8)].map((_, index) => (
                <div key={index} className={cx("product")}>
                  <div className={cx("productList-img")}>
                    <Skeleton variant="rectangular" width="100%" height={200} />
                  </div>
                  <div className={cx("product_info")}>
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="40%" height={20} />
                    <Skeleton variant="text" width="80%" height={20} />
                    <Skeleton variant="text" width="30%" height={20} />
                  </div>
                </div>
              ))
            : currentItems.map((product) => (
                <div key={product._id} className={cx("product")}>
                  <div className={cx("productList-img")}>
                    <img
                      src={
                        Array.isArray(product.thumbnail) &&
                        product.thumbnail.length > 0
                          ? product.thumbnail[0]
                          : product.thumbnail
                      }
                      alt="Product"
                      onClick={() => window.open(`${linkHref}`, "_blank")}
                    />
                  </div>
                  <div
                    className={cx("product_info")}
                    onClick={() => window.open(`${linkHref}`, "_blank")}
                  >
                    <a href={linkHref} onClick={(e) => e.stopPropagation()}>
                      {product.nameCategory}
                    </a>
                    <div className={cx("description")}>{product.title}</div>
                    <div className={cx("price_product")}>
                      <div className={cx("new_price")}>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(product.price)}
                      </div>

                      {/* {product.discountPercentage !== 0 && (
                        <div className={cx("discount")}>
                          <div className={cx("price")}>
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(product.price)}
                          </div>
                          <span className={cx("discount-tag")}>
                            <div className={cx("tag")}>
                              -{product.discountPercentage}%
                            </div>
                          </span>
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {!loading && totalPage > 1 && (
          <Pagination
            className={cx("pagnigation")}
            count={totalPage}
            page={currentPage}
            onChange={handlePageChange}
            color="secondary"
          />
        )}
      </div>
    </div>
  );
}

export default ListCategory;
