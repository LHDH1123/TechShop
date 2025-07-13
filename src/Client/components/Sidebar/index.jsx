import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useFilterContext } from "../../Context/FilterContext";
// import { getAllProducts } from "../../../services/product.service";
// import { getNameBrand } from "../../../services/brand.service";
// import { getNameCategory } from "../../../services/category.service";

const cx = classNames.bind(styles);

function Sidebar({ allProducts }) {
  const {
    selectedPriceRanges,
    setSelectedPriceRanges,
    selectedCategorys,
    setSelectedCategorys,
  } = useFilterContext();

  const [isPriceListVisible, setIsPriceListVisible] = useState(true);
  // const [isBrandListVisible, setIsBrandListVisible] = useState(true);
  const [isCategoryListVisible, setIsCategoryListVisible] = useState(true);
  // const [brandList, setBrandList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  // const [visibleBrandCount, setVisibleBrandCount] = useState(5);
  const [visibleCategoryCount, setVisibleCategoryCount] = useState(5);

  const priceRanges = [
    { label: "Under $25", value: "Under $25" },
    { label: "$25 to $50", value: "$25 to $50" },
    { label: "$50 to $100", value: "$50 to $100" },
    { label: "$100 to $200", value: "$100 to $200" },
    { label: "$200 & Above", value: "$200 & Above" },
  ];

  useEffect(() => {
    if (!allProducts || allProducts.length === 0) return;

    // Lấy brand & category ID duy nhất
    const uniqueCategoryIds = [
      ...new Set(allProducts.map((p) => p.category_id)),
    ];

    const categoryNames = uniqueCategoryIds.map((id) => {
      const product = allProducts.find((p) => p.category_id === id);
      return { id, name: product?.nameCategory };
    });

    // Lọc những item có name hợp lệ (không undefined)
    // setBrandList(brandNames.filter((b) => b.name));
    setCategoryList(categoryNames.filter((c) => c.name));
  }, [allProducts]);

  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setSelectedPriceRanges((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // const handleBrandCheckboxChange = (e) => {
  //   const value = e.target.value;
  //   setSelectedBrands((prev) =>
  //     prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
  //   );
  // };

  const handleCategoryCheckboxChange = (e) => {
    const value = e.target.value;
    setSelectedCategorys((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const togglePriceList = () => setIsPriceListVisible((prev) => !prev);
  // const toggleBrandList = () => setIsBrandListVisible((prev) => !prev);
  const toggleCategoryList = () => setIsCategoryListVisible((prev) => !prev);

  // const toggleShowMoreBrands = () => {
  //   if (visibleBrandCount >= brandList.length) setVisibleBrandCount(5);
  //   else setVisibleBrandCount((prev) => prev + 5);
  // };

  const toggleShowMoreCategories = () => {
    if (visibleCategoryCount >= categoryList.length) setVisibleCategoryCount(5);
    else setVisibleCategoryCount((prev) => prev + 5);
  };

  return (
    <div className={cx("sidebar")}>
      {/* Giá */}
      <div className={cx("section")}>
        <div className={cx("section-header")}>
          <div className={cx("title")}>Price</div>
          <button onClick={togglePriceList} className={cx("toggle-button")}>
            {isPriceListVisible ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </button>
        </div>
        {isPriceListVisible && (
          <ul className={cx("list")}>
            {priceRanges.map((range) => (
              <li key={range.value}>
                <span className={cx("ant-checkbox")}>
                  <input
                    type="checkbox"
                    value={range.value}
                    onChange={handleCheckboxChange}
                    checked={selectedPriceRanges.includes(range.value)}
                  />
                </span>
                <label htmlFor={range.value}>{range.label}</label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Thương hiệu
      <div className={cx("section")}>
        <div className={cx("section-header")}>
          <div className={cx("title")}>Thương hiệu</div>
          <button onClick={toggleBrandList} className={cx("toggle-button")}>
            {isBrandListVisible ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </button>
        </div>
        {isBrandListVisible && (
          <ul className={cx("list")}>
            {brandList.slice(0, visibleBrandCount).map((brand) => (
              <li key={brand.id}>
                <span className={cx("ant-checkbox")}>
                  <input
                    type="checkbox"
                    value={brand.name}
                    onChange={handleBrandCheckboxChange}
                    checked={selectedBrands.includes(brand.name)}
                  />
                </span>
                <label htmlFor={brand.name}>{brand.name}</label>
              </li>
            ))}
            {brandList.length > 5 && (
              <li className={cx("show-more")} onClick={toggleShowMoreBrands}>
                <span className={cx("more-text")}>
                  {visibleBrandCount >= brandList.length
                    ? "Thu gọn"
                    : "Xem thêm"}
                </span>
              </li>
            )}
          </ul>
        )}
      </div> */}

      {/* Danh mục */}
      <div className={cx("section")}>
        <div className={cx("section-header")}>
          <div className={cx("title")}>Brand</div>
          <button onClick={toggleCategoryList} className={cx("toggle-button")}>
            {isCategoryListVisible ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </button>
        </div>
        {isCategoryListVisible && (
          <ul className={cx("list")}>
            {categoryList.slice(0, visibleCategoryCount).map((category) => (
              <li key={category.id}>
                <span className={cx("ant-checkbox")}>
                  <input
                    type="checkbox"
                    value={category.name}
                    onChange={handleCategoryCheckboxChange}
                    checked={selectedCategorys.includes(category.name)}
                  />
                </span>
                <label htmlFor={category.name}>{category.name}</label>
              </li>
            ))}
            {categoryList.length > 5 && (
              <li
                className={cx("show-more")}
                onClick={toggleShowMoreCategories}
              >
                <span className={cx("more-text")}>
                  {visibleCategoryCount >= categoryList.length
                    ? "Thu gọn"
                    : "Xem thêm"}
                </span>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
