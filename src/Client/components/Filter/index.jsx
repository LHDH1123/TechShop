import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import styles from "./Filter.module.scss";
import ClearIcon from "@mui/icons-material/Clear";
import { useFilterContext } from "../../Context/FilterContext";

const cx = classNames.bind(styles);

Filter.propTypes = {
  total: PropTypes.number,
};

function Filter({ total }) {
  const {
    selectedPriceRanges = [],
    selectedBrands = [],
    selectedCategorys = [],
    handleClearAll,
    handleClearTag,
  } = useFilterContext() || {};

  const hasAnyFilter =
    selectedPriceRanges.length > 0 ||
    selectedBrands.length > 0 ||
    selectedCategorys.length > 0;

  return (
    <div className={cx("filter")}>
      <div className={cx("filter-header")}>BỘ LỌC</div>
      <div className={cx("filter-tags")}>
        {/* Tag lọc theo giá */}
        {selectedPriceRanges.map((range) => (
          <div key={range} className={cx("tag")}>
            {range}
            <ClearIcon
              fontSize="inherit"
              style={{ marginLeft: "5px", cursor: "pointer" }}
              onClick={() => handleClearTag(range, "price")}
            />
          </div>
        ))}

        {/* Tag lọc theo thương hiệu */}
        {selectedBrands.map((brand) => (
          <div key={brand} className={cx("tag")}>
            {brand}
            <ClearIcon
              fontSize="inherit"
              style={{ marginLeft: "5px", cursor: "pointer" }}
              onClick={() => handleClearTag(brand, "brand")}
            />
          </div>
        ))}

        {/* Tag lọc theo danh mục */}
        {selectedCategorys.map((category) => (
          <div key={category} className={cx("tag")}>
            {category}
            <ClearIcon
              fontSize="inherit"
              style={{ marginLeft: "5px", cursor: "pointer" }}
              onClick={() => handleClearTag(category, "category")}
            />
          </div>
        ))}

        {/* Nút xóa tất cả */}
        {hasAnyFilter && (
          <div className={cx("btn-del")} onClick={handleClearAll}>
            Xóa hết
          </div>
        )}
      </div>

      <div className={cx("filter-results")}>
        <span>{total} Kết quả</span>
      </div>
    </div>
  );
}

export default Filter;
