import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Apply.module.scss";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import { changeMulti } from "../../../services/brand.service";
import { changeMultiCategory } from "../../../services/category.service";
import { changeMultiProduct } from "../../../services/product.service";
import { changeMultiAccount } from "../../../services/account.service";
import { useAuth } from "../../Context/Auth.context";

const cx = classNames.bind(styles);

const Apply = ({
  selectedBrands,
  fetchBrands,
  fetchCategorys,
  selectedCategorys,
  selectedProducts,
  fetchProducts,
  selectedAccounts,
  fetchAccount,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState("Tất cả");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const dropdownRef = useRef(null);
  const { permissions } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isAccess, setIsAccess] = useState(false);

  const tags = ["Xóa tất cả", "Hoạt động", "Không hoạt động"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    setIsDropdownOpen(false);
  };

  const handleApply = () => {
    if (!selectedTag.length) {
      alert("Vui lòng chọn ít nhất một thương hiệu hoặc danh mục.");
      return;
    } else {
      if (selectedTag === "Xóa tất cả") {
        setOpenConfirmDialog(true);
        return;
      }

      applyChanges();
    }
  };

  const applyChanges = async () => {
    let data = {};
    let dataCategory = {};
    let dataProduct = {};
    let dataAccount = {};

    switch (selectedTag) {
      case "Xóa tất cả":
        data = { ids: selectedBrands, key: "deleted", value: true };
        dataCategory = { ids: selectedCategorys, key: "delete", value: true };
        dataProduct = { ids: selectedProducts, key: "delete", value: true };
        dataAccount = { ids: selectedAccounts, key: "delete", value: true };
        break;
      case "Hoạt động":
        data = { ids: selectedBrands, key: "status", value: true };
        dataCategory = { ids: selectedCategorys, key: "status", value: true };
        dataProduct = { ids: selectedProducts, key: "status", value: true };
        dataAccount = { ids: selectedAccounts, key: "status", value: true };
        break;
      case "Không hoạt động":
        data = { ids: selectedBrands, key: "status", value: false };
        dataCategory = { ids: selectedCategorys, key: "status", value: false };
        dataProduct = { ids: selectedProducts, key: "status", value: false };
        dataAccount = { ids: selectedAccounts, key: "status", value: false };
        break;
      default:
        return;
    }

    try {
      let hasUpdated = false;

      if (selectedBrands?.length) {
        if (!permissions?.includes("brands_edit")) {
          setErrorMessage("Bạn không có quyền chỉnh sửa thương hiệu.");
          setOpenSnackbar(true);
          setIsAccess(false);
          return;
        }
        await changeMulti(data);
        await fetchBrands();
        hasUpdated = true;
      }

      if (selectedCategorys?.length) {
        if (!permissions?.includes("products-category_edit")) {
          setErrorMessage("Bạn không có quyền chỉnh sửa danh mục.");
          setOpenSnackbar(true);
          setIsAccess(false);
          return;
        }
        await changeMultiCategory(dataCategory);
        await fetchCategorys();
        hasUpdated = true;
      }

      if (selectedProducts?.length) {
        if (!permissions?.includes("products_edit")) {
          setErrorMessage("Bạn không có quyền chỉnh sửa sản phẩm.");
          setOpenSnackbar(true);
          setIsAccess(false);
          return;
        }
        await changeMultiProduct(dataProduct);
        await fetchProducts();
        hasUpdated = true;
      }

      if (selectedAccounts?.length) {
        if (!permissions?.includes("accounts_edit")) {
          setErrorMessage("Bạn không có quyền chỉnh sửa tài khoản.");
          setOpenSnackbar(true);
          setIsAccess(false);
          return;
        }
        await changeMultiAccount(dataAccount);
        await fetchAccount();
        hasUpdated = true;
      }

      if (hasUpdated) {
        setErrorMessage("Cập nhật thành công.");
        setIsAccess(true);
        setOpenSnackbar(true);
      } else {
        setErrorMessage("Vui lòng chọn ít nhất một mục để cập nhật.");
        setIsAccess(false);
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      setErrorMessage(
        "Đã xảy ra lỗi trong quá trình cập nhật. Vui lòng thử lại."
      );
      setIsAccess(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <div className={cx("apply")} ref={dropdownRef}>
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
      <div className={cx("select")}>
        <div
          className={cx("tag-filter")}
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        >
          <div className={cx("title-tag")}>{selectedTag}</div>
          <KeyboardArrowDownIcon />
        </div>

        {isDropdownOpen && (
          <div className={cx("select-tag")}>
            {tags.map((tag, index) => (
              <div
                key={index}
                className={cx("tag")}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={cx("submit")} onClick={handleApply}>
        <button>Áp dụng</button>
      </div>

      {/* Hộp thoại xác nhận */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Bạn có chắc muốn xóa các mục đã chọn không?</DialogTitle>
        <DialogActions>
          <button
            type="button"
            className={cx("btn-cancel")}
            onClick={() => setOpenConfirmDialog(false)}
          >
            Hủy
          </button>
          <button
            type="button"
            className={cx("btn-submit")}
            onClick={() => {
              setOpenConfirmDialog(false);
              applyChanges();
            }}
          >
            Xóa
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Apply;
