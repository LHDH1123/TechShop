import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import logo from "../../../assets/logo.png";
import SearchIcon from "@mui/icons-material/Search";
// import StoreIcon from "@mui/icons-material/Storefront";
// import NewspaperIcon from "@mui/icons-material/Newspaper";
// import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import UserIcon from "@mui/icons-material/AccountCircleOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Dialog, Box, DialogActions, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Collection from "../Collection";
import CategoryHeader from "../CategoryHeader";
import { getCategorys } from "../../../services/category.service";
import { AxiosInstance } from "../../../configs/axios";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const cx = classNames.bind(styles);

const Header = () => {
  const scrollableRef = useRef(null);
  // const divRef = useRef(null);
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(true);

  const [isMore, setIsMore] = useState(false);
  const navigate = useNavigate();

  const [alertData, setAlertData] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    // Giả sử searchProduct là API tìm kiếm
    const fetchResults = async () => {
      // try {
      //   const res = await getProductsAIRCMByTitle(searchTerm);
      //   console.log(res);
      //   setSearchResults(res);
      // } catch (err) {
      //   console.error("Search failed", err);
      // }
    };

    fetchResults();
  }, [searchTerm]);
  // Tự động ẩn cảnh báo sau 10 giây

  // const menuHeaders = [
  //   { id: 1, label: "Thương hiệu", title: "collection" },
  //   // { id: 2, label: "Khuyến mãi hot", title: "new" },
  //   // { id: 3, label: "Sản phẩm cao cấp", title: "new" },
  //   { id: 4, label: "Sản phẩm mới", title: "new" },
  //   // { id: 5, label: "Mã giảm", title: "new" },
  // ];
  const [listCategorys, setListCategorys] = useState([]);

  const [isEmailPassword, setIsEmailPassword] = useState("");
  const [isHaveAcc, setIsHaveAcc] = useState(false);
  const [isDataRegister, setIsDataRegister] = useState(false);

  // Tự động ẩn cảnh báo sau 10 giây
  useEffect(() => {
    if (
      isEmailPassword !== null ||
      isHaveAcc ||
      isDataRegister ||
      alertData !== ""
    ) {
      const timer = setTimeout(() => {
        setIsEmailPassword(null);
        setIsHaveAcc(false);
        setIsDataRegister(false);
        setAlertData("");
      }, 2000); // 10s

      return () => clearTimeout(timer);
    }
  }, [isEmailPassword, isHaveAcc, isDataRegister, alertData]);

  useEffect(() => {
    const fetchCategorys = async () => {
      try {
        const response = await getCategorys();

        if (response) {
          setListCategorys(response);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategorys();
  }, []);

  // const handleNavigateStore = () => {
  //   navigate("/stores");
  // };

  // const handleOutsideClick = (event) => {
  //   if (divRef.current && !divRef.current.contains(event.target)) {
  //     setIsMore(false);
  //   }
  // };

  // // Thêm event listener khi component mount và remove khi unmount
  // useEffect(() => {
  //   document.addEventListener("click", handleOutsideClick);
  //   return () => {
  //     document.removeEventListener("click", handleOutsideClick);
  //   };
  // }, []);

  const scrollLeft = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollBy({ left: -1000, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollBy({ left: 1000, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    const container = scrollableRef.current;
    if (container) {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      setIsLeftVisible(container.scrollLeft > 0);
      setIsRightVisible(container.scrollLeft < maxScrollLeft);
    }
  };

  useEffect(() => {
    const container = scrollableRef.current;

    const handleResizeOrScroll = () => {
      handleScroll();
    };

    // Gọi lần đầu sau render để lấy layout chuẩn
    const timeout = setTimeout(() => {
      handleScroll();
    }, 0);

    container?.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResizeOrScroll);

    return () => {
      container?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResizeOrScroll);

      clearTimeout(timeout);
    };
  }, [listCategorys]);

  const handleOpenMore = () => {
    setIsMore((prev) => !prev);
  };

  const handleListProduct = (slug, title) => {
    navigate(`/products/${slug}`, { state: { title } });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsMore(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMore(false);
      }
    };

    // Gọi khi component mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={cx("header")}>
      <div className={cx("header_container")}>
        <div className={cx("menu-content")}>
          {/* <div className={cx("menu-item")}>Freeship 15K mọi đơn hàng</div>
          <div className={cx("separator")}></div>
          <div className={cx("menu-item")}>Quà tặng cho đơn từ 299K</div>
          <div className={cx("separator")}></div>
          <div className={cx("menu-item")}>
            Mua online nhận tại cửa hàng gần nhất
          </div> */}
        </div>
      </div>

      {isMore && (
        <div className={cx("sidebar", { open: isMore })}>
          <div className={cx("sidebar-header")}>
            <div>
              <a href="/">
                <img className={cx("logo-img")} alt="logo" src={logo} />
              </a>
            </div>
            <CloseIcon onClick={handleOpenMore} />
          </div>
          {/* <div className={cx("sidebar-content")}>
            <ul className={cx("sidebar-menu")}>
              {menuHeaders.map((menu, index) => (
                <li
                  key={index}
                  onClick={() => handleToggle(index)}
                  className={cx("menu-item")}
                >
                  {menu.label}
                  {index === 0 && (
                    <KeyboardArrowDownIcon
                      fontSize="small"
                      className={cx("arrow-icon", {
                        active: activeIndex === index,
                      })}
                    />
                  )}
                  {activeIndex === index && (
                    <ul className={cx("sidebar-menu")}>
                      {brands.slice(0, 5).map((brand) => (
                        <li
                          key={brand._id}
                          onClick={() => {
                            handleListProductBrand(brand.name);
                          }}
                        >
                          {brand.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              {listCategorys.map((menu, index) => (
                <li
                  key={`category-${index}`}
                  onClick={() => {
                    handleShowCategory(menu._id, index);
                  }}
                >
                  {menu.title}

                  <KeyboardArrowDownIcon
                    fontSize="small"
                    className={cx("arrow-icon1", {
                      active: activeIndexCategory === index,
                    })}
                  />

                  {activeIndexCategory === index &&
                    listChildCategorys.map((categoryGroup) => (
                      <div
                        key={categoryGroup.parent_id}
                        className={cx("list-category")}
                      >
                        <div
                          className={cx("title-category")}
                          onClick={() =>
                            handleListProduct(
                              categoryGroup.slug,
                              categoryGroup.title
                            )
                          }
                        >
                          {categoryGroup.title}
                        </div>
                        <ul className={cx("category-chil")}>
                          {categoryGroup.children.map((child) => (
                            <li
                              key={child._id}
                              onClick={() =>
                                handleListProduct(child.slug, child.title)
                              }
                            >
                              {child.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </li>
              ))}
            </ul>
        
          </div> */}
        </div>
      )}
      <div className={cx("header_content")}>
        <div className={cx("logo")}>
          <div>
            <a href="/">
              <img className={cx("logo-img")} alt="logo" src={logo} />
            </a>
          </div>
        </div>

        {/* <div className={cx("search-bar")}>
          <div className={cx("search-icon")}>
            <SearchIcon />
          </div>
          <input
            type="text"
            className={cx("search-input")}
            placeholder="Son chính hãng chỉ 189K"
          />
          <button className={cx("scan-search")} onClick={handleOpenModal}>
            <img src={ScanIcon} alt="" />
          </button>
        </div> */}
        <div className={cx("search-bar-wrapper")}>
          <div className={cx("search-bar")}>
            <div className={cx("search-icon")}>
              <SearchIcon />
            </div>
            <input
              type="text"
              className={cx("search-input")}
              placeholder="Search product"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 150)} // delay để user kịp click vào kết quả
            />

            {isFocused && searchResults.length > 0 && (
              <div className={cx("search-results")}>
                {searchResults && searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <div
                      key={product.product_id}
                      className={cx("search-result-item")}
                      onClick={() => navigate(`/detailProduct/${product.slug}`)}
                    >
                      <img
                        src={product.thumbnail[0]}
                        alt={product.title}
                        className={cx("thumbnail")}
                      />
                      <div className={cx("info")}>
                        <p className={cx("name")}>{product.title}</p>
                        <p className={cx("sku")}>
                          Giá:{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(
                            product.price -
                              (product.price * product.discountPercentage) / 100
                          )}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={cx("no-results")}>Không tìm thấy kết quả</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={cx("scroll-container")}>
        {isLeftVisible && (
          <button className={cx("scroll-button", "left")} onClick={scrollLeft}>
            <ArrowLeftIcon />
          </button>
        )}
        <div className={cx("main_header", "scrollable")} ref={scrollableRef}>
          {listCategorys.map((menu) => (
            <div
              key={menu._id}
              className={cx("menu-header")}
              onClick={() => handleListProduct(menu.slug, menu.title)}
            >
              {menu.title}
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
};

export default Header;
