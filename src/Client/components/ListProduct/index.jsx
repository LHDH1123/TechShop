import React, { useEffect, useRef, useState, useCallback } from "react";
import classNames from "classnames/bind";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Rating } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

import styles from "./ListProduct.module.scss";
import { getAllProductSlug } from "../../../services/product.service";
import { debounce } from "lodash";

const cx = classNames.bind(styles);

function ListProduct({ title }) {
  const scrollableRef = useRef(null);
  const navigate = useNavigate();
  const linkHref = "https://www.amazon.com";

  const [listProducts, setListProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(false);

  const titleSlugMap = {
    Razer: () => getAllProductSlug(1, 20, "razer"),
    "Logitech G": () => getAllProductSlug(1, 20, "logitech-g"),
    // Corsair: () => getAllProductSlug(1, 20, "corsair"),
    SteelSeries: () => getAllProductSlug(1, 20, "steelseries"),
    // thêm các tiêu đề khác ở đây nếu cần
  };

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const normalizedTitle = title.trim(); // remove whitespace
      const fetchFunction = titleSlugMap[normalizedTitle];
      console.log("title:", `"${normalizedTitle}"`);
      console.log("fetchFunction:", fetchFunction);

      if (fetchFunction) {
        const products = await fetchFunction();
        setListProducts(products);
      } else {
        setListProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [title]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleScroll = debounce(() => {
    const container = scrollableRef.current;
    if (container) {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      setIsLeftVisible(container.scrollLeft > 0);
      setIsRightVisible(container.scrollLeft < maxScrollLeft);
    }
  }, 100);

  useEffect(() => {
    const container = scrollableRef.current;
    if (container) {
      handleScroll();
      container.addEventListener("scroll", handleScroll);
    }
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [listProducts]);

  const scrollLeft = () => {
    scrollableRef.current?.scrollBy({
      left: -scrollableRef.current.offsetWidth,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollableRef.current?.scrollBy({
      left: scrollableRef.current.offsetWidth,
      behavior: "smooth",
    });
  };

  const handleDetail = (slug) => {
    navigate(`/detailProduct/${slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderSkeletons = () =>
    Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className={cx("product")}>
        <div className={cx("productList-img")}>
          <div className={cx("skeleton-img")} />
        </div>
        <div className={cx("product_info")}>
          <div className={cx("skeleton-text", "brand")} />
          <div className={cx("skeleton-text", "title")} />
          <div className={cx("skeleton-text", "price")} />
          <div className={cx("skeleton-text", "rating")} />
        </div>
      </div>
    ));

  return (
    <div className={cx("list")}>
      <h2>{title}</h2>
      <div className={cx("scroll-list")}>
        {isLeftVisible && (
          <button className={cx("scroll-button", "left")} onClick={scrollLeft}>
            <ArrowLeftIcon />
          </button>
        )}

        <div className={cx("list_product")} ref={scrollableRef}>
          {isLoading
            ? renderSkeletons()
            : listProducts.map((product) => (
                <div key={product._id} className={cx("product")}>
                  <div
                    className={cx("productList-img")}
                    onClick={() => window.open(`${linkHref}`, "_blank")}
                  >
                    <img src={product.thumbnail[0]} alt="Product" />
                  </div>

                  <div
                    className={cx("product_info")}
                    onClick={() => handleDetail(product.slug)}
                  >
                    <a href={`/products/${product.nameCategory}`}>
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
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {isRightVisible && (
          <button
            className={cx("scroll-button", "right")}
            onClick={scrollRight}
          >
            <ArrowRightIcon />
          </button>
        )}
      </div>
    </div>
  );
}

ListProduct.propTypes = {
  title: PropTypes.string,
};

ListProduct.defaultProps = {
  title: "",
};

export default ListProduct;
