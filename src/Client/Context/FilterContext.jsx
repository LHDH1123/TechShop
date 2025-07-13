/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from "react";

// Tạo Context
const FilterContext = createContext();

// Tạo Provider để cung cấp giá trị cho các component
export const FilterProvider = ({ children }) => {
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategorys, setSelectedCategorys] = useState([]);

  // Xóa tất cả các tag
  const handleClearAll = () => {
    setSelectedPriceRanges([]);
    setSelectedBrands([]);
    setSelectedCategorys([]);
  };

  // Xóa tag riêng theo loại
  const handleClearTag = (tag, type) => {
    if (type === "price") {
      setSelectedPriceRanges((prev) => prev.filter((item) => item !== tag));
    } else if (type === "brand") {
      setSelectedBrands((prev) => prev.filter((item) => item !== tag));
    } else if (type === "category") {
      setSelectedCategorys((prev) => prev.filter((item) => item !== tag));
    }
  };

  return (
    <FilterContext.Provider
      value={{
        selectedPriceRanges,
        setSelectedPriceRanges,
        selectedBrands,
        setSelectedBrands,
        selectedCategorys,
        setSelectedCategorys,
        handleClearAll,
        handleClearTag,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

// Hook để sử dụng context dễ dàng
export const useFilterContext = () => useContext(FilterContext);
