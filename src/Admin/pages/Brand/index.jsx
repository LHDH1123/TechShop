import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Brand.module.scss";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Header from "../../components/Header";
import TableHeader from "../../components/TableHeader";
import {
  changeStatus,
  deletebrand,
  getBrands,
  getDetail,
  updateBrand,
} from "../../../services/brand.service";
import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  Pagination,
  Snackbar,
  Switch,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../Context/Auth.context";

const cx = classNames.bind(styles);

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [isModalEditBrand, setIsModalEditBrand] = useState(false);
  const [getBrand, setGetBrand] = useState([]);
  const [getImage, setGetImage] = useState([]);

  const [editBrand, setEditBrand] = useState({
    name: "",
    status: false,
    thumbnail: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isAccess, setIsAccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  //pagnigation
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPage = Math.ceil(brands.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBrands = brands.slice(indexOfFirstItem, indexOfLastItem);
  const { permissions } = useAuth();

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleCloseModalEdit = () => {
    setIsModalEditBrand(false);
  };

  const handleOpenModal = async (id) => {
    setIsModalEditBrand(true);
    const getBrand = await getDetail(id);
    setGetBrand(getBrand);
  };

  const fetchBrands = async () => {
    const response = await getBrands();
    if (response) {
      setBrands(response);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = (id) => {
    setSelectedId(id); // Lưu id của vai trò cần xóa
    setOpen(true); // Mở hộp thoại xác nhận
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;

    try {
      await deletebrand(selectedId);
      const updatedBrands = brands.filter((brand) => brand._id !== selectedId);
      setBrands(updatedBrands);

      // Tính lại totalPage sau khi xóa
      const newTotalPage = Math.ceil(updatedBrands.length / itemsPerPage);

      // Nếu trang hiện tại không còn dữ liệu và không phải trang đầu tiên, quay về trang 1
      if (currentPage > newTotalPage) {
        setCurrentPage(1);
      }
      setErrorMessage("Xóa thương hiệu thành công");
      setOpenSnackbar(true);
      setIsAccess(true);
    } catch (error) {
      console.error("Lỗi khi xóa thương hiệu:", error);
    } finally {
      setOpen(false); // Đóng hộp thoại sau khi xử lý xong
      setSelectedId(null); // Xóa id đã lưu
    }
  };

  const handleChangeStatus = async (id, currentStatus) => {
    if (!permissions?.includes("brands_edit")) {
      setErrorMessage("Bạn không có quyền truy cập");
      setOpenSnackbar(true);
      setIsAccess(false);
      return;
    }
    try {
      const newStatus = !currentStatus;
      setBrands((prevBrands) =>
        prevBrands.map((brand) =>
          brand._id === id ? { ...brand, status: newStatus } : brand
        )
      );
      await changeStatus(id, newStatus);
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái:", error);
    }
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    if (newSelectAll) {
      setSelectedBrands([
        ...new Set([
          ...selectedBrands,
          ...currentBrands.map((brand) => brand._id),
        ]),
      ]);
    } else {
      setSelectedBrands(
        selectedBrands.filter(
          (id) => !currentBrands.some((brand) => brand._id === id)
        )
      );
    }
  };

  const handleSelectOne = (id) => {
    setSelectedBrands((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((brandId) => brandId !== id)
        : [...prevSelected, id]
    );
  };

  useEffect(() => {
    setSelectAll(
      currentBrands.length > 0 &&
        currentBrands.every((brand) => selectedBrands.includes(brand._id))
    );
  }, [selectedBrands, currentBrands]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGetBrand({ ...getBrand, thumbnail: reader.result }); // Lưu URL của ảnh vào state
      };
      reader.readAsDataURL(file);
      setGetImage(file);
    }
  };

  const handleClickChangeImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setEditBrand((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    if (getBrand) {
      setEditBrand({
        name: getBrand.name || "",
        status: getBrand.status || false,
        thumbnail: getBrand.thumbnail || "",
      });
    }
  }, [getBrand]);

  const handleUpdate = async () => {
    if (!editBrand.name) {
      setErrorMessage("Vui lòng nhập tên thương hiệu");
      setOpenSnackbar(true);
      setIsAccess(false);
      return;
    }

    const formData = new FormData();

    // Thêm các dữ liệu khác của thương hiệu vào formData
    formData.append("name", editBrand.name);
    formData.append("description", editBrand.description);

    // Nếu có hình ảnh, thêm nó vào FormData
    if (getImage) {
      formData.append("thumbnail", getImage);
    }

    try {
      const response = await updateBrand(getBrand._id, formData);
      if (response) {
        console.log(response);
        fetchBrands();
        setIsModalEditBrand(false);
        setErrorMessage("Cập nhật thương hiệu thành công");
        setOpenSnackbar(true);
        setIsAccess(true);
      }
    } catch (error) {
      if (error.message) {
        // Hiển thị thông báo lỗi từ backend
        setErrorMessage(error.message); // Lấy lỗi từ backend và hiển thị
        setOpenSnackbar(true);
        setIsAccess(false);
      }
      console.error("Error updating brand:", error);
    }
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedBrands = searchQuery ? filteredBrands : currentBrands;

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className={cx("table")}>
      <Header title="Thương Hiệu" fetchBrands={fetchBrands} />
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
          selectedBrands={selectedBrands}
          fetchBrands={fetchBrands}
          handleSearchChange={handleSearchChange}
        />
        <div className={cx("brand-list")}>
          <div className="table-wrapper">
            <table className={cx("table", "datanew")}>
              <thead>
                <tr>
                  <th className={cx("cb-all")}>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Thương hiệu</th>
                  <th>Logo</th>
                  <th>Ngày tạo</th>
                  <th>Trạng thái</th>
                  <th className={cx("no-sort")}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {displayedBrands.map((brand) => (
                  <tr key={brand._id}>
                    <td>
                      <label className={cx("checkboxs")}>
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand._id)}
                          onChange={() => handleSelectOne(brand._id)}
                        />
                        <span className={cx("checkmarks")}></span>
                      </label>
                    </td>
                    <td style={{ fontWeight: "600", color: "#333" }}>
                      {brand.name}
                    </td>
                    <td>
                      <span className={cx("d-flex")}>
                        <img src={brand.thumbnail} alt={brand.name} />
                      </span>
                    </td>
                    <td>
                      {new Date(brand.createdBy.createAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </td>
                    <td>
                      <span
                        className={cx(
                          "badge",
                          brand.status ? "badge-linesuccess" : "badge-linered"
                        )}
                        onClick={() =>
                          handleChangeStatus(brand._id, brand.status)
                        }
                      >
                        {brand.status ? "Hoạt động" : "Không hoạt động"}
                      </span>
                    </td>
                    <td className={cx("action-table-data")}>
                      <div className={cx("edit-delete-action")}>
                        {permissions?.includes("brands_edit") && (
                          <div
                            className={cx("icon")}
                            onClick={() => handleOpenModal(brand._id)}
                          >
                            <ModeEditOutlineOutlinedIcon
                              style={{ color: "#3577f1" }}
                            />
                          </div>
                        )}
                        {permissions?.includes("brands_edit") && (
                          <div
                            className={cx("icon")}
                            onClick={() => handleDelete(brand._id)}
                          >
                            <DeleteOutlineOutlinedIcon
                              style={{ color: "red" }}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {!searchQuery && (
          <Pagination
            className={cx("pagnigation")}
            count={totalPage}
            page={currentPage}
            onChange={handlePageChange}
            color="secondary"
          />
        )}
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

      <Dialog
        open={isModalEditBrand}
        onClose={handleCloseModalEdit}
        PaperProps={{
          style: {
            marginTop: "-30px",
            borderRadius: "16px",
            height: "460px",
            width: "500px",
          },
        }}
      >
        <Box>
          <DialogActions>
            <div
              className={cx("btn_exit")}
              onClick={() => handleCloseModalEdit()}
            >
              <button>
                <CloseIcon fontSize="small" style={{ color: "red" }} />
              </button>
            </div>
          </DialogActions>

          <div className={cx("modalContent")}>
            <div className={cx("title")}>Chỉnh sửa thương hiệu</div>

            <div className={cx("formGroup")}>
              <div className={cx("label")}>
                Thương hiệu <span style={{ color: "red" }}>*</span>
              </div>
              <input
                type="text"
                name="name"
                className={cx("input")}
                value={editBrand.name}
                onChange={handleInputChange}
              />
            </div>

            <div
              className={cx("formGroup")}
              style={{ display: "flex", alignItems: "center" }}
            >
              <div>
                <div className={cx("label")}>
                  Logo <span style={{ color: "red" }}>*</span>
                </div>
                <label className={cx("input-blocks")}>
                  <input
                    type="file"
                    name="thumbnail"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                  {getBrand.thumbnail ? (
                    <img
                      src={getBrand.thumbnail}
                      alt="Logo"
                      className={cx("preview-img")}
                    />
                  ) : (
                    <>
                      <AddCircleOutlineIcon
                        fontSize="inherit"
                        style={{ color: "#ff9f43" }}
                      />
                      <div className={cx("title-img")}>Thêm hình ảnh</div>
                    </>
                  )}
                </label>
              </div>
              <button
                type="button"
                className={cx("btn-change")}
                onClick={handleClickChangeImage}
              >
                Thay đổi ảnh
              </button>
            </div>

            <div className={cx("status")}>
              <div className={cx("label")}>Trạng thái</div>
              <div className={cx("switch")}>
                <Switch
                  name="status"
                  checked={editBrand.status}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className={cx("buttons")}>
              <button
                type="button"
                className={cx("btn-cancel")}
                onClick={() => handleCloseModalEdit()}
              >
                Hủy
              </button>
              <button
                type="submit"
                className={cx("btn-submit")}
                onClick={() => handleUpdate()}
              >
                Cập nhật
              </button>
            </div>
          </div>
        </Box>
      </Dialog>
    </div>
  );
};

export default Brand;
