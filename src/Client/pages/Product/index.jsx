import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Product.module.scss";
import ListCategory from "../../components/ListCategory";
import Sidebar from "../../components/Sidebar";
import Filter from "../../components/Filter";
import { FilterProvider, useFilterContext } from "../../Context/FilterContext";
import { useLocation, useParams } from "react-router-dom";

const cx = classNames.bind(styles);

// Tách phần nội dung vào function nhỏ bên trong để dùng được context
const ProductContent = ({
  slug,
  totalProducts,
  setTotalProducts,
  filteredProducts,
  setFilteredProducts,
  allProducts,
  setAllProducts,
}) => {
  const { selectedPriceRanges, selectedBrands, selectedCategorys } =
    useFilterContext(); // An toàn vì trong FilterProvider

  return (
    <div className={cx("product")}>
      {/* {title && <HeaderLink title={title} />} */}
      <Filter total={totalProducts} />
      <div className={cx("container")}>
        <div className={cx("sidebar")}>
          <Sidebar
            filteredProducts={filteredProducts}
            allProducts={allProducts}
          />
        </div>
        <ListCategory
          slug={slug}
          onTotalChange={setTotalProducts}
          selectedPriceRanges={selectedPriceRanges}
          selectedBrands={selectedBrands}
          selectedCategories={selectedCategorys}
          filteredProducts={filteredProducts}
          setFilteredProducts={setFilteredProducts}
          setAllProducts={setAllProducts}
        />
      </div>
    </div>
  );
};

const Product = () => {
  const location = useLocation();
  const { title } = location.state || {};
  const { slug } = useParams();
  const [totalProducts, setTotalProducts] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  return (
    <FilterProvider>
      <ProductContent
        title={title}
        slug={slug}
        totalProducts={totalProducts}
        setTotalProducts={setTotalProducts}
        filteredProducts={filteredProducts}
        setFilteredProducts={setFilteredProducts}
        allProducts={allProducts}
        setAllProducts={setAllProducts}
      />
    </FilterProvider>
  );
};

export default Product;
