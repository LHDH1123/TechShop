import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Product.module.scss";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Header from "../../../Admin/components/Header";
import TableHeader from "../../components/TableHeader";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CategoryIcon from "@mui/icons-material/Category";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import {
  changeStatusProduct,
  deleteProduct,
  getAllProducts,
} from "../../../services/product.service";
import { getBrands } from "../../../services/brand.service";
import {
  getCategorys,
  // getNameCategory,
} from "../../../services/category.service";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Dialog,
  DialogActions,
  DialogTitle,
  Pagination,
  Snackbar,
} from "@mui/material";
import { useAuth } from "../../Context/Auth.context";

const cx = classNames.bind(styles);

const Product = () => {
  const [isSelectBrand, setIsSelectBrand] = useState(false);
  const [isSelectCategory, setIsSelectCategory] = useState(false);
  const [selectCategory, setSelectCategory] = useState("Danh mục");
  const [selectBrand, setSelectBrand] = useState("Thương hiệu");
  const [listProducts, setListProducts] = useState([]);
  const navigate = useNavigate();
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [listBrands, setListBrands] = useState([]);
  const [listCategorys, setListCategorys] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isAccess, setIsAccess] = useState(false);

  const { permissions } = useAuth();

  const handleSelectAll = () => {
    const newCheckedState = !isAllChecked;
    setIsAllChecked(newCheckedState);

    if (newCheckedState) {
      // Chỉ chọn tất cả các sản phẩm trong trang hiện tại
      setSelectedProducts(currentProducts.map((product) => product._id));
    } else {
      setSelectedProducts([]); // Deselect tất cả các sản phẩm trong trang hiện tại
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((productId) => productId !== id)
        : [...prevSelected, id]
    );
  };

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();

      if (response) {
        setListProducts(response);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await getBrands();
      if (response) {
        const filterListBrand = await Promise.all(
          response.map(async (brand) => ({
            id: brand._id,
            name: brand.name,
          }))
        );
        setListBrands(filterListBrand);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchCategorys = async () => {
    try {
      const response = await getCategorys();
      if (response) {
        const filterListCategory = await Promise.all(
          response.map(async (category) => ({
            id: category._id,
            name: category.title,
          }))
        );
        setListCategorys(filterListCategory);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchBrands();
    fetchCategorys();
  }, []);

  const handleSelectBrand = () => {
    setIsSelectBrand((prev) => !prev);
  };

  const handleSelectCategory = () => {
    if (isSelectCategory) {
      setIsSelectCategory(false);
    } else {
      setIsSelectCategory(true);
    }
  };

  const handleChangeStatus = async (id, currentStatus) => {
    if (!permissions?.includes("products_edit")) {
      setErrorMessage("Bạn không có quyền truy cập");
      setOpenSnackbar(true);
      setIsAccess(false);
      return;
    }
    try {
      const newStatus = !currentStatus;

      // Cập nhật trực tiếp danh sách sản phẩm
      setListProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === id ? { ...product, status: newStatus } : product
        )
      );

      // Gọi API để cập nhật trạng thái trên server
      await changeStatusProduct(id, newStatus);
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái:", error);
    }
  };
  const handleDelete = (id) => {
    setSelectedId(id); // Lưu id của vai trò cần xóa
    setOpen(true); // Mở hộp thoại xác nhận
  };

  // Xóa voucher
  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    try {
      console.log(selectedId);
      const response = await deleteProduct(selectedId);
      if (response) {
        const updatedProducts = listProducts.filter(
          (brand) => brand._id !== selectedId
        );
        setListProducts(updatedProducts);
        setErrorMessage("Xóa sản phẩm thành công");
        setOpenSnackbar(true);
        setIsAccess(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setOpen(false); // Đóng hộp thoại sau khi xử lý xong
      setSelectedId(null); // Xóa id đã lưu
    }
  };

  const handleForwardEdit = (id) => {
    navigate(`/adminbb/edit-product/${id}`);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const searchProducts = listProducts.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectTagBrand = (name) => {
    setSelectBrand(name);
    setIsSelectBrand(false);
  };

  const handleSelectTagCategory = (name) => {
    setSelectCategory(name);
    setIsSelectCategory(false);
  };

  const handleSearchFilter = () => {
    // Nếu chọn tất cả cả hai, lấy lại danh sách sản phẩm gốc
    if (
      (selectBrand === "Tất cả" && selectCategory === "Tất cả") ||
      selectBrand === "Tất cả" ||
      selectCategory === "Tất cả"
    ) {
      fetchProducts();
      return;
    }

    // Dùng danh sách sản phẩm gốc để tránh lỗi khi lọc liên tiếp
    let filteredProducts = [...listProducts];

    // Lọc theo thương hiệu nếu không phải là "Tất cả"
    if (selectBrand !== "Tất cả" && selectBrand !== "Thương hiệu") {
      filteredProducts = filteredProducts.filter((product) =>
        product.nameBrand.toLowerCase().includes(selectBrand.toLowerCase())
      );
    }

    // Lọc theo danh mục nếu không phải là "Tất cả"
    if (selectCategory !== "Tất cả" && selectCategory !== "Danh mục") {
      filteredProducts = filteredProducts.filter((product) =>
        product.nameCategory
          .toLowerCase()
          .includes(selectCategory.toLowerCase())
      );
    }

    // Cập nhật danh sách sản phẩm sau khi lọc
    setListProducts(filteredProducts);
  };

  const handleDetailProduct = (id) => {
    navigate(`/adminbb/detail-product/${id}`);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPage = Math.ceil(searchProducts.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentProducts = searchProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Cập nhật trạng thái của checkbox tổng dựa trên selectedProducts
  useEffect(() => {
    setIsAllChecked(
      selectedProducts.length === currentProducts.length &&
        currentProducts.length > 0
    );
  }, [selectedProducts, currentProducts]);

  return (
    <div className={cx("table")}>
      <Header title="Sản Phẩm" />

      {errorMessage && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000} // Ẩn sau 3 giây
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }} // Hiển thị trên cùng
        >
          {isAccess ? (
            <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
              {errorMessage}
            </Alert>
          ) : (
            <Alert severity="warning" onClose={() => setOpenSnackbar(false)}>
              {errorMessage}
            </Alert>
          )}
        </Snackbar>
      )}

      <div className={cx("table-list")}>
        <TableHeader
          selectedProducts={selectedProducts}
          fetchProducts={fetchProducts}
          handleSearchChangeProduct={handleSearchChange}
        />

        <div className={cx("card")}>
          <div className={cx("tag-filter")} onClick={handleSelectBrand}>
            <LocalOfferIcon fontSize="inherit" />
            <div className={cx("title-tag")}>{selectBrand}</div>
            <KeyboardArrowDownIcon />
          </div>
          {isSelectBrand && (
            <div className={cx("select-tag")}>
              <div
                className={cx("tag")}
                key=""
                onClick={() => {
                  handleSelectTagBrand("Tất cả");
                }}
              >
                Tất cả
              </div>
              {listBrands.map((brand) => (
                <div
                  className={cx("tag")}
                  key={brand.id}
                  onClick={() => {
                    handleSelectTagBrand(brand.name);
                  }}
                >
                  {brand.name}
                </div>
              ))}
            </div>
          )}

          <div
            className={cx("tag-filterCategory")}
            onClick={handleSelectCategory}
          >
            <CategoryIcon fontSize="inherit" />
            <div className={cx("title-tagCategory")}>{selectCategory}</div>
            <KeyboardArrowDownIcon />
          </div>
          {isSelectCategory && (
            <div
              className={cx("select-tagCategory")}
              // style={{ marginLeft: "165px" }}
            >
              <div
                className={cx("tagCategory")}
                key=""
                onClick={() => {
                  handleSelectTagCategory("Tất cả");
                }}
              >
                Tất cả
              </div>
              {listCategorys.map((category) => (
                <div
                  className={cx("tagCategory")}
                  key={category.id}
                  onClick={() => {
                    handleSelectTagCategory(category.name);
                  }}
                >
                  {category.name}
                </div>
              ))}
            </div>
          )}
          <div className={cx("btn-search")} onClick={handleSearchFilter}>
            <SearchIcon fontSize="small" />
            Tìm kiếm
          </div>
        </div>
        <div className={cx("brand-list")}>
          <table className={cx("table", "datanew")}>
            <thead>
              <tr>
                <th className={cx("no-sort")}>
                  <input
                    type="checkbox"
                    className={cx("cb_all")}
                    checked={isAllChecked}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Sản phẩm</th>
                <th>Thương hiệu</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Trạng thái</th>
                <th className={cx("no-sort")}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product.SKU} style={{ marginLeft: "4px" }}>
                  <td>
                    <label className={cx("checkboxs")}>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleCheckboxChange(product._id)}
                      />
                      <span className={cx("checkmarks")}></span>
                    </label>
                  </td>
                  <td>
                    <div className={cx("name-product")}>
                      <span className={cx("d-flex")}>
                        <img src={product.thumbnail[0]} alt={product.name} />
                      </span>
                      <div
                        className={cx("name")}
                        style={{ fontWeight: "600", color: "#495057" }}
                      >
                        {product.title}
                      </div>
                    </div>
                  </td>
                  <td>{product.nameBrand}</td>
                  <td>{product.nameCategory}</td>
                  <td>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price)}
                  </td>
                  <td>{product.stock}</td>
                  <td>
                    <span
                      className={cx(
                        "badge",
                        product.status ? "badge-linesuccess" : "badge-linered"
                      )}
                      onClick={() =>
                        handleChangeStatus(product._id, product.status)
                      }
                    >
                      {product.status ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                  <td className={cx("action-table-data")}>
                    <div className={cx("edit-delete-action")}>
                      <div
                        className={cx("icon")}
                        onClick={() => handleDetailProduct(product._id)}
                      >
                        <RemoveRedEyeOutlinedIcon />
                      </div>
                      {permissions?.includes("products_edit") && (
                        <div
                          className={cx("icon")}
                          onClick={() => handleForwardEdit(product._id)}
                        >
                          <ModeEditOutlineOutlinedIcon
                            style={{ color: "#3577f1" }}
                          />
                        </div>
                      )}
                      {permissions?.includes("products_edit") && (
                        <div className={cx("icon")}>
                          <DeleteOutlineOutlinedIcon
                            style={{ color: "red" }}
                            onClick={() => handleDelete(product._id)}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!searchQuery && (
            <Pagination
              className={cx("pagnigation")}
              count={totalPage}
              page={currentPage}
              onChange={handlePageChange}
              color="secondary"
              siblingCount={1} // số trang hiển thị xung quanh trang hiện tại
              boundaryCount={1} // số trang hiển thị ở đầu và cuối
            />
          )}
        </div>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          style: {
            marginTop: "-100px",
          },
        }}
      >
        <DialogTitle>Bạn có muốn xóa voucher này?</DialogTitle>

        <DialogActions>
          <button
            type="button"
            className={cx("btn-cancel")}
            onClick={() => setOpen(false)}
          >
            Hủy
          </button>
          <button
            type="button"
            className={cx("btn-submit")}
            onClick={handleConfirmDelete}
          >
            Xóa
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Product;
