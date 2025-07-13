import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  Snackbar,
  Switch,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { addBrand } from "../../../services/brand.service";
import { addCategory, getCategorys } from "../../../services/category.service";
import { createCategorySelect } from "../../../helper/select-tree";
import { addRole, getAllRoles } from "../../../services/role.service";
import { addAccount } from "../../../services/account.service";
import { useAuth } from "../../Context/Auth.context";

const cx = classNames.bind(styles);

const Header = ({
  title,
  fetchCategorys,
  fetchBrands,
  fetchRoles,
  fetchAccount,
}) => {
  const [isModalAdd, setIsModalAdd] = useState(false);
  const [isModalSale, setIsModalSale] = useState(false);
  const [isModalAddBrand, setIsModalAddBrand] = useState(false);
  const [isModalAddRole, setIsModalAddRole] = useState(false);
  const [isModalAddUser, setIsModalAddUser] = useState(false);
  const [brand, setBrand] = useState({
    name: "",
    thumbnail: null,
    status: true,
  });
  const [category, setCategory] = useState({
    title: "",
    parent_id: "",
    status: true,
  });
  const [voucher, setVoucher] = useState({
    title: "",
    discount: "",
    min_order_total: "",
    status: true,
  });
  const [role, setRole] = useState({
    title: "",
    status: true,
  });
  const [account, setAccount] = useState({
    thumbnail: "",
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role_id: "",
    confirmPassword: "",
    status: true,
  });
  const [getAllCategory, setGetAllCategory] = useState([]);
  const [getAllRole, setGetAllRole] = useState([]);
  const fileInputRef = useRef(null);
  const fileInputRefAccount = useRef(null);
  const [getBrand, setGetBrand] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const label = { inputProps: { "aria-label": "Switch demo" } };
  const createPermissionMap = {
    "Sản Phẩm": "products_create",
    "Danh Mục": "products-category_create",
    "Thương Hiệu": "brands_create",
    "Người Dùng": "accounts_create",
    "Vai Trò & Quyền": "roles_create",
    "Giảm Giá": "vouchers_create",
    "Đánh giá": "reviews_create",
  };

  const { permissions } = useAuth();
  const canCreate = permissions?.includes(createPermissionMap[title]);

  const fetchAllCategorys = async () => {
    const response = await getCategorys();
    if (response) {
      setGetAllCategory(response);
    }
  };

  const fetchAllRoles = async () => {
    const response = await getAllRoles();
    if (response) {
      setGetAllRole(response);
    }
  };

  useEffect(() => {
    fetchAllCategorys();
    fetchAllRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (files && files.length > 0) {
      setBrand((prev) => ({
        ...prev,
        [name]: files[0], // Đảm bảo lấy file đầu tiên trong danh sách
      }));
    } else {
      setBrand((prev) => {
        const newState = {
          ...prev,
          [name]: type === "checkbox" ? checked : value,
        };
        return newState;
      });
    }
  };

  const handleChangeCategory = (e) => {
    const { name, value, type, checked } = e.target;

    setCategory((prev) => {
      const newState = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      return newState;
    });
  };

  const handleChangeVoucher = (e) => {
    const { name, value, type, checked } = e.target;

    setVoucher((prev) => {
      const newState = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      return newState;
    });
  };

  const handleChangeRole = (e) => {
    const { name, value, type, checked } = e.target;
    setRole((prev) => {
      const newState = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      return newState;
    });
  };

  const handleChangeAccount = (e) => {
    const { name, value, type, checked } = e.target;

    setAccount((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCloseModalAdd = () => {
    if (title === "Danh Mục") {
      setIsModalAdd(!isModalAdd);
    }
    if (title === "Thương Hiệu") {
      setIsModalAddBrand(!isModalAddBrand);
    }
    if (title === "Sản Phẩm") {
      navigate("/adminbb/create-product");
    }
    if (title === "Vai Trò & Quyền") {
      setIsModalAddRole(!isModalAddRole);
    }
    if (title === "Giảm Giá") {
      setIsModalSale(!isModalSale);
    }
    if (title === "Người Dùng") {
      setIsModalAddUser(!isModalAddUser);
    }
  };

  const handleAddBrand = async () => {
    if (!brand.name) {
      setErrorMessage("Vui lòng nhập tên thương hiệu");
      setOpenSnackbar(true);
      return;
    }
    if (!brand.thumbnail) {
      setErrorMessage("Vui lòng chọn ảnh thương hiệu");
      setOpenSnackbar(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", brand.name);
      formData.append("status", brand.status ?? true);
      formData.append("thumbnail", brand.thumbnail);

      const response = await addBrand(formData);
      if (response) {
        console.log("Thêm thương hiệu thành công:", response);

        await fetchBrands();
        setIsModalAddBrand(false);
        setBrand({
          name: "",
          thumbnail: null,
          status: true,
        });
        setGetBrand([]);
      } else {
        alert("Không có phản hồi từ server.");
      }
    } catch (error) {
      if (error.message) {
        // Hiển thị thông báo lỗi từ backend
        setErrorMessage(error.message); // Lấy lỗi từ backend và hiển thị
        setOpenSnackbar(true);
      }
      console.error("Lỗi khi thêm thương hiệu:", error);
    }
  };

  const handleAddCateogy = async () => {
    if (!category.title) {
      setErrorMessage("Vui lòng nhập tên danh mục");
      setOpenSnackbar(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", category.title);
      formData.append("parent_id", category.parent_id);
      formData.append("status", category.status); // Đảm bảo chỉ gửi file hợp lệ

      const response = await addCategory(formData);
      fetchCategorys();
      fetchAllCategorys();
      if (response) {
        console.log("Thêm danh mục thành công:", response);
        setIsModalAdd(false);
      }
      setGetAllCategory(false);
      setCategory({
        title: "",
        parent_id: "",
        status: true,
      });
    } catch (error) {
      if (error.message) {
        // Hiển thị thông báo lỗi từ backend
        setErrorMessage(error.message); // Lấy lỗi từ backend và hiển thị
        setOpenSnackbar(true);
      }
      console.error("Lỗi khi thêm thương hiệu:", error);
    }
  };

  const handleAddRole = async () => {
    if (!role.title) {
      setErrorMessage("Vui lòng nhập tên vai trò");
      setOpenSnackbar(true);
      return;
    }
    try {
      const response = await addRole(role);
      if (response) {
        console.log("Thêm vai trò thành công:", response);
        fetchRoles();
        setIsModalAddRole(false);
        setRole({ title: "", status: true });
      }
    } catch (error) {
      if (error.message) {
        // Hiển thị thông báo lỗi từ backend
        setErrorMessage(error.message); // Lấy lỗi từ backend và hiển thị
        setOpenSnackbar(true);
      }
      console.error("Lỗi khi thêm vai trò:", error);
    }
  };

  const handleAddVoucher = async () => {
    if (!voucher.title) {
      setErrorMessage("Vui lòng nhập tên voucher");
      setOpenSnackbar(true);
      return;
    }
    if (!voucher.discount) {
      setErrorMessage("Vui lòng nhập % giảm giá");
      setOpenSnackbar(true);
      return;
    }
    if (!voucher.min_order_total) {
      setErrorMessage("Vui lòng nhập đơn hàng hàng tối thiểu");
      setOpenSnackbar(true);
      return;
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGetBrand({ ...getBrand, thumbnail: reader.result }); // Lưu URL của ảnh vào state
      };
      reader.readAsDataURL(file);
      setBrand((prev) => ({ ...prev, thumbnail: file })); // Lưu file thật vào state để gửi lên server
      setAccount((prev) => ({ ...prev, thumbnail: file }));
    }
  };

  const handleClickChangeImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Open file picker for image
    }
    if (fileInputRefAccount.current) {
      fileInputRefAccount.current.click(); // Open file picker for image
    }
  };

  const handleAddAccount = async () => {
    if (!account.thumbnail) {
      setErrorMessage("Vui lòng chọn ảnh đại diện");
      setOpenSnackbar(true);
      return;
    }
    if (!account.fullName) {
      setErrorMessage("Vui lòng nhập tên");
      setOpenSnackbar(true);
      return;
    }
    if (!account.phone) {
      setErrorMessage("Vui lòng nhập Email");
      setOpenSnackbar(true);
      return;
    }
    if (!account.email) {
      setErrorMessage("Vui lòng nhập Email");
      setOpenSnackbar(true);
      return;
    }
    if (!account.role_id) {
      setErrorMessage("Vui lòng chọn vai trò");
      setOpenSnackbar(true);
      return;
    }
    if (!account.password) {
      setErrorMessage("Vui lòng nhập mật khẩu");
      setOpenSnackbar(true);
      return;
    }

    if (account.password !== account.confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp");
      setOpenSnackbar(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fullName", account.fullName);
      formData.append("phone", account.phone);
      formData.append("email", account.email);
      formData.append("role_id", account.role_id);
      formData.append("password", account.password);
      formData.append("confirmPassword", account.confirmPassword);
      formData.append("status", account.status);

      if (account.thumbnail) {
        formData.append("thumnail", account.thumbnail);
      }

      const response = await addAccount(formData);

      if (response) {
        console.log(response);
        setIsModalAddUser(false);
        fetchAccount();
        setAccount({
          fullName: "",
          phone: "",
          email: "",
          role_id: "",
          password: "",
          confirmPassword: "",
          status: true,
          avatar: "",
        });
      } else {
        alert("Lỗi khi thêm tài khoản!");
      }
    } catch (error) {
      if (error.message) {
        // Hiển thị thông báo lỗi từ backend
        setErrorMessage(error.message); // Lấy lỗi từ backend và hiển thị
        setOpenSnackbar(true);
      }
      console.error("Lỗi khi thêm tài khoản:", error);
    }
  };

  return (
    <div className={cx("header")}>
      <div className={cx("title-header")}>
        <div className={cx("title")}>
          <div className={cx("title-page")}>{title}</div>
          {title === "Chi tiết sản phẩm" ? (
            <div className={cx("title-desc")}>
              Chi tiết đầy đủ của một sản phẩm
            </div>
          ) : (
            <div className={cx("title-desc")}>Quản Lý {title} Của Bạn</div>
          )}
        </div>
      </div>
      {errorMessage && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000} // Ẩn sau 3 giây
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }} // Hiển thị trên cùng
        >
          <Alert severity="warning" onClose={() => setOpenSnackbar(false)}>
            {errorMessage}
          </Alert>
        </Snackbar>
      )}

      {title !== "Chi tiết sản phẩm" && title !== "Quyền hạn" && canCreate && (
        <div className={cx("btn-add")} onClick={handleCloseModalAdd}>
          <AddCircleOutlineIcon />
          <button>
            {title === "Vai Trò & Quyền" ? "Thêm Vai Trò" : `Thêm ${title}`}
          </button>
        </div>
      )}

      {/* Add Category Modal */}
      <Dialog
        open={isModalAdd}
        onClose={handleCloseModalAdd}
        PaperProps={{
          style: {
            marginTop: "-30px",
            borderRadius: "16px",
            height: "400px",
            width: "500px",
          },
        }}
      >
        <Box>
          <DialogActions>
            <div className={cx("btn_exit")}>
              <button onClick={handleCloseModalAdd}>
                <CloseIcon fontSize="small" style={{ color: "red" }} />
              </button>
            </div>
          </DialogActions>
          <div className={cx("modalContent")}>
            <div className={cx("title")}>Tạo danh mục</div>
            <div className={cx("formGroup")}>
              <div className={cx("label")}>
                Tên danh mục <span style={{ color: "red" }}>*</span>
              </div>
              <input
                type="text"
                name="title"
                className={cx("input")}
                value={category.title || ""}
                onChange={handleChangeCategory}
              />
            </div>
            <div className={cx("formGroup")}>
              <div className={cx("label")}>Danh mục cha</div>
              <select
                id="parent_id"
                name="parent_id"
                className={cx("input")}
                value={category.parent_id || ""}
                onChange={handleChangeCategory}
              >
                <option value="">Chọn danh mục cha</option>
                {createCategorySelect(getAllCategory)}
              </select>
            </div>
            <div className={cx("status")}>
              <div className={cx("label")}>Trạng thái</div>
              <div className={cx("switch")}>
                <Switch
                  {...label}
                  name="status"
                  color="warning"
                  checked={category?.status ?? false} // Tránh undefined
                  onChange={(e) =>
                    setCategory((prev) => ({
                      ...prev,
                      status: e.target.checked, // Switch gửi giá trị boolean chính xác
                    }))
                  }
                />
              </div>
            </div>
            <div className={cx("buttons")}>
              <button
                type="button"
                className={cx("btn-cancel")}
                onClick={handleCloseModalAdd}
              >
                Hủy
              </button>
              <button
                type="submit"
                className={cx("btn-submit")}
                onClick={handleAddCateogy}
              >
                Tạo mới
              </button>
            </div>
          </div>
        </Box>
      </Dialog>

      {/* Add Brand Modal */}
      <Dialog
        open={isModalAddBrand}
        onClose={handleCloseModalAdd}
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
            <div className={cx("btn_exit")}>
              <button onClick={handleCloseModalAdd}>
                <CloseIcon fontSize="small" style={{ color: "red" }} />
              </button>
            </div>
          </DialogActions>
          <div className={cx("modalContent")}>
            <div className={cx("title")}>Tạo thương hiệu</div>
            <div className={cx("formGroup")}>
              <div className={cx("label")}>
                Thương hiệu <span style={{ color: "red" }}>*</span>
              </div>
              <input
                type="text"
                name="name"
                className={cx("input")}
                value={brand.name}
                onChange={handleChange}
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
                <div className={cx("input-blocks")}>
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
                </div>
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
                  color="warning"
                  checked={brand.status}
                  onClick={handleChange}
                />
              </div>
            </div>
            <div className={cx("buttons")}>
              <button
                type="button"
                className={cx("btn-cancel")}
                onClick={handleCloseModalAdd}
              >
                Hủy
              </button>
              <button
                type="submit"
                className={cx("btn-submit")}
                onClick={handleAddBrand}
              >
                Tạo mới
              </button>
            </div>
          </div>
        </Box>
      </Dialog>

      {/* Add Role Modal */}
      <Dialog
        open={isModalAddRole}
        onClose={handleCloseModalAdd}
        PaperProps={{
          style: {
            marginTop: "-30px",
            borderRadius: "16px",
            height: "300px",
            width: "500px",
          },
        }}
      >
        <Box>
          <DialogActions>
            <div className={cx("btn_exit")}>
              <button onClick={handleCloseModalAdd}>
                <CloseIcon fontSize="small" style={{ color: "red" }} />
              </button>
            </div>
          </DialogActions>
          <div className={cx("modalContent")}>
            <div className={cx("title")}>Tạo vai trò</div>
            <div className={cx("formGroup")}>
              <div className={cx("label")}>
                Tên vai trò <span style={{ color: "red" }}>*</span>
              </div>
              <input
                type="text"
                name="title"
                className={cx("input")}
                value={role.title}
                onChange={handleChangeRole}
              />
              <div className={cx("status")}>
                <div className={cx("label")}>Trạng thái</div>
                <div className={cx("switch")}>
                  <Switch
                    {...label}
                    name="status"
                    color="warning"
                    checked={role.status}
                    onClick={handleChangeRole}
                  />
                </div>
              </div>
            </div>
            <div className={cx("buttons")}>
              <button
                type="button"
                className={cx("btn-cancel")}
                onClick={handleCloseModalAdd}
              >
                Hủy
              </button>
              <button
                type="submit"
                className={cx("btn-submit")}
                onClick={handleAddRole}
              >
                Tạo mới
              </button>
            </div>
          </div>
        </Box>
      </Dialog>

      {/* Add Sale Modal */}
      <Dialog
        open={isModalSale}
        onClose={handleCloseModalAdd}
        PaperProps={{
          style: {
            marginTop: "-30px",
            borderRadius: "16px",
            height: "470px",
            width: "500px",
          },
        }}
      >
        <Box>
          <DialogActions>
            <div className={cx("btn_exit")}>
              <button onClick={handleCloseModalAdd}>
                <CloseIcon fontSize="small" style={{ color: "red" }} />
              </button>
            </div>
          </DialogActions>
          <div className={cx("modalContent")}>
            <div className={cx("title")}>Tạo voucher</div>
            <div className={cx("formGroup")}>
              <div className={cx("label")}>
                Tên voucher <span style={{ color: "red" }}>*</span>
              </div>
              <input
                type="text"
                name="title"
                className={cx("input")}
                value={voucher.title || ""}
                onChange={handleChangeVoucher}
              />
            </div>
            <div className={cx("formGroup")}>
              <div className={cx("label")}>
                Giảm giá <span style={{ color: "red" }}>*</span>
              </div>
              <input
                type="text"
                name="discount"
                className={cx("input")}
                value={voucher.discount || ""}
                onChange={handleChangeVoucher}
              />
            </div>
            <div className={cx("formGroup")}>
              <div className={cx("label")}>
                Đơn hàng tối thiểu <span style={{ color: "red" }}>*</span>
              </div>
              <input
                type="text"
                name="min_order_total"
                className={cx("input")}
                value={voucher.min_order_total || ""}
                onChange={handleChangeVoucher}
              />
            </div>
            <div className={cx("status")}>
              <div className={cx("label")}>Trạng thái</div>
              <div className={cx("switch")}>
                <Switch
                  {...label}
                  name="status"
                  color="warning"
                  checked={voucher.status}
                  onChange={(e) =>
                    setVoucher((prev) => ({
                      ...prev,
                      status: e.target.checked,
                    }))
                  }
                />
              </div>
            </div>
            <div className={cx("buttons")}>
              <button
                type="button"
                className={cx("btn-cancel")}
                onClick={handleCloseModalAdd}
              >
                Hủy
              </button>
              <button
                type="submit"
                className={cx("btn-submit")}
                onClick={handleAddVoucher}
              >
                Tạo mới
              </button>
            </div>
          </div>
        </Box>
      </Dialog>

      {/* Add Account Modal */}
      <Dialog
        open={isModalAddUser}
        onClose={handleCloseModalAdd}
        PaperProps={{
          style: { marginTop: "-30px", borderRadius: "16px", width: "500px" },
        }}
      >
        <Box>
          <DialogActions>
            <div className={cx("btn_exit")}>
              <button onClick={handleCloseModalAdd}>
                <CloseIcon fontSize="small" style={{ color: "red" }} />
              </button>
            </div>
          </DialogActions>
          <div className={cx("modalContent")} style={{ marginLeft: "20px" }}>
            <div className={cx("title")}>Tạo người dùng</div>
            <div
              className={cx("formGroup")}
              style={{ display: "flex", alignItems: "center" }}
            >
              <div>
                <div className={cx("label")}>
                  Ảnh đại diện <span style={{ color: "red" }}>*</span>
                </div>
                <div
                  className={cx("input-blocks")}
                  onClick={handleClickChangeImage}
                >
                  <input
                    type="file"
                    name="thumbnail"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={fileInputRefAccount}
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
                </div>
              </div>
              <button
                type="submit"
                className={cx("btn-change")}
                onClick={handleClickChangeImage}
              >
                Thay đổi ảnh
              </button>
            </div>
            <div className={cx("info")}>
              <div className={cx("formGroup")}>
                <div className={cx("label")}>
                  Tên <span style={{ color: "red" }}>*</span>
                </div>
                <input
                  type="text"
                  name="fullName"
                  className={cx("input")}
                  onChange={handleChangeAccount}
                />
              </div>
              <div className={cx("formGroup")}>
                <div className={cx("label")}>
                  SĐT <span style={{ color: "red" }}>*</span>
                </div>
                <input
                  type="text"
                  name="phone"
                  className={cx("input")}
                  onChange={handleChangeAccount}
                />
              </div>
            </div>
            <div className={cx("info")}>
              <div className={cx("formGroup")}>
                <div className={cx("label")}>
                  Email <span style={{ color: "red" }}>*</span>
                </div>
                <input
                  type="text"
                  name="email"
                  className={cx("input")}
                  onChange={handleChangeAccount}
                />
              </div>
              <div className={cx("formGroup")}>
                <div className={cx("label")}>
                  Vai trò <span style={{ color: "red" }}>*</span>
                </div>
                <select
                  name="role_id"
                  className={cx("select-role")}
                  onChange={handleChangeAccount}
                >
                  <option value="">Chọn vai trò</option>
                  {getAllRole.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={cx("info")}>
              <div className={cx("formGroup")}>
                <div className={cx("label")}>
                  Mật khẩu <span style={{ color: "red" }}>*</span>
                </div>
                <input
                  type="password"
                  name="password"
                  className={cx("input")}
                  onChange={handleChangeAccount}
                />
              </div>
              <div className={cx("formGroup")}>
                <div className={cx("label")}>
                  Xác nhận lại mật khẩu <span style={{ color: "red" }}>*</span>
                </div>
                <input
                  name="confirmPassword"
                  type="password"
                  className={cx("input")}
                  onChange={handleChangeAccount}
                />
              </div>
            </div>
            <div className={cx("info")} style={{ marginBottom: "10px" }}>
              <div className={cx("label")}>Trạng thái</div>
              <div className={cx("switch")}>
                <Switch
                  name="status"
                  color="warning"
                  checked={account.status ?? false} // Đảm bảo giá trị không bị undefined
                  onClick={(event, checked) => {
                    setAccount((prev) => ({ ...prev, status: checked }));
                  }}
                />
              </div>
            </div>

            <div className={cx("buttons")} style={{ marginRight: "20px" }}>
              <button
                type="button"
                className={cx("btn-cancel")}
                onClick={handleCloseModalAdd}
              >
                Hủy
              </button>
              <button
                type="submit"
                className={cx("btn-submit")}
                onClick={handleAddAccount}
              >
                Tạo mới
              </button>
            </div>
          </div>
        </Box>
      </Dialog>
    </div>
  );
};

export default Header;
