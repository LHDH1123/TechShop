import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Account.module.scss";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Header from "../../components/Header";
import TableHeader from "../../components/TableHeader";
import {
  changeStatusAccount,
  deleteAccounts,
  getAllAccounts,
  updateAccount,
} from "../../../services/account.service";
import { getAllRoles, getNameRole } from "../../../services/role.service";
import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  Snackbar,
  Switch,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useAuth } from "../../Context/Auth.context";

const cx = classNames.bind(styles);

const User = () => {
  const [allAccount, setAllAccount] = useState([]);
  const [allRole, setAllRole] = useState([]);
  const { permissions } = useAuth();

  const [editAccount, setEditAccount] = useState({
    avatar: "",
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role_id: "",
    status: false,
  });
  const [isModalAddUser, setIsModalAddUser] = useState(false);
  const fileInputRef = useRef(null);
  const [getAccount, setGetAccount] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isAccess, setIsAccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchAccount = async () => {
    try {
      const response = await getAllAccounts();

      const accountWithRole = await Promise.all(
        response.map(async (account) => {
          const roleName = await getNameRole(account.role_id);
          return { ...account, nameRole: roleName };
        })
      );

      setAllAccount(accountWithRole);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tài khoản:", error);
    }
  };

  const fetchAllRoles = async () => {
    const response = await getAllRoles();
    if (response) {
      setAllRole(response);
    }
  };

  useEffect(() => {
    fetchAccount();
    fetchAllRoles();
  }, []);

  const handleChangeStatus = async (id, currentStatus) => {
    if (!permissions?.includes("accounts_edit")) {
      setErrorMessage("Bạn không có quyền truy cập");
      setOpenSnackbar(true);
      setIsAccess(false);
      return;
    }

    try {
      const newStatus = !currentStatus;
      await changeStatusAccount(id, newStatus);

      setAllAccount((prevProducts) =>
        prevProducts.map((product) =>
          product._id === id ? { ...product, status: newStatus } : product
        )
      );

      // Gọi API để cập nhật trạng thái trên server
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái:", error);
    }
  };

  const handleDelete = (id) => {
    setSelectedId(id); // Lưu id của vai trò cần xóa
    setOpen(true); // Mở hộp thoại xác nhận
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;

    try {
      await deleteAccounts(selectedId);
      const updatedAccounts = allAccount.filter(
        (account) => account._id !== selectedId
      );
      setAllAccount(updatedAccounts);
      setErrorMessage("Xóa người dùng thành công");
      setOpenSnackbar(true);
      setIsAccess(true);
    } catch (error) {
      console.error("Lỗi khi xóa tài khoản:", error);
    } finally {
      setOpen(false); // Đóng hộp thoại sau khi xử lý xong
      setSelectedId(null); // Xóa id đã lưu
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setEditAccount((prev) => {
      const newState = {
        ...prev,
        [name]: value,
      };
      return newState;
    });
  };

  const handleCloseModalAdd = () => {
    setIsModalAddUser(!isModalAddUser);
  };

  const handlEdit = (account) => {
    setEditAccount({
      id: account._id || "",
      thumbnail: account.thumbnail || "",
      fullName: account.fullName || "",
      email: account.email || "",
      phone: account.phone || "",
      role_id: account.role_id || "",
      status: account.status ?? false,
    });
    setGetAccount({ ...getAccount, thumbnail: account.thumbnail });
    setIsModalAddUser(true);
  };

  const handleClickChangeImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Open file picker for image
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGetAccount({ ...getAccount, thumbnail: reader.result }); // Lưu URL của ảnh vào state
      };
      reader.readAsDataURL(file); // Lưu file thật vào state để gửi lên server
      setEditAccount((prev) => ({ ...prev, thumbnail: file }));
    }
  };

  const handleUpdate = async () => {
    if (!editAccount.thumbnail) {
      setErrorMessage("Vui lòng chọn ảnh đại diện");
      setOpenSnackbar(true);
      setIsAccess(false);
      return;
    }
    if (!editAccount.fullName) {
      setErrorMessage("Vui lòng nhập tên");
      setOpenSnackbar(true);
      setIsAccess(false);
      return;
    }
    if (!editAccount.phone) {
      setErrorMessage("Vui lòng nhập Email");
      setOpenSnackbar(true);
      setIsAccess(false);
      return;
    }
    if (!editAccount.email) {
      setErrorMessage("Vui lòng nhập Email");
      setOpenSnackbar(true);
      setIsAccess(false);
      return;
    }
    if (!editAccount.role_id) {
      setErrorMessage("Vui lòng chọn vai trò");
      setOpenSnackbar(true);
      setIsAccess(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("fullName", editAccount.fullName);
      formData.append("phone", editAccount.phone);
      formData.append("email", editAccount.email);
      formData.append("role_id", editAccount.role_id);
      formData.append("status", editAccount.status);

      if (editAccount.thumbnail) {
        formData.append("thumnail", editAccount.thumbnail);
      }

      const response = await updateAccount(editAccount.id, formData);

      if (response) {
        console.log(response);
        setIsModalAddUser(false);
        setOpenSnackbar(true);
        setIsAccess(true);
        setErrorMessage("Cập nhật người dùng thành công");
        fetchAccount();
      } else {
        alert("Lỗi khi sửa tài khoản!");
      }
    } catch (error) {
      if (error.message) {
        // Hiển thị thông báo lỗi từ backend
        setErrorMessage(error.message); // Lấy lỗi từ backend và hiển thị
        setOpenSnackbar(true);
        setIsAccess(false);
      }
      console.error("Lỗi khi sửa tài khoản:", error);
    }
  };

  const handleSelectAll = () => {
    if (selectedAccounts.length === allAccount.length) {
      setSelectedAccounts([]);
      setSelectAll(false);
    } else {
      setSelectedAccounts(allAccount.map((account) => account._id));
      setSelectAll(true);
    }
  };

  const handleSelectAccount = (id) => {
    let updatedSelection;
    if (selectedAccounts.includes(id)) {
      updatedSelection = selectedAccounts.filter(
        (accountId) => accountId !== id
      );
    } else {
      updatedSelection = [...selectedAccounts, id];
    }

    setSelectedAccounts(updatedSelection);
    setSelectAll(updatedSelection.length === allAccount.length);
  };

  useEffect(() => {
    setSelectAll(
      selectedAccounts.length === allAccount.length && allAccount.length > 0
    );
  }, [selectedAccounts, allAccount]);

  const filteredAccounts = allAccount.filter((account) =>
    account.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchAccount = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className={cx("table")}>
      <Header title="Người Dùng" fetchAccount={fetchAccount} />
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
          selectedAccounts={selectedAccounts}
          fetchAccount={fetchAccount}
          handleSearchAccount={handleSearchAccount}
        />

        <div className={cx("brand-list")}>
          <table className={cx("table", "datanew")}>
            <thead>
              <tr>
                <th className={cx("no-sort")}>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th>Người dùng</th>
                <th>SĐT</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th className={cx("no-sort")}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => (
                <tr key={account._id}>
                  <td>
                    <label className={cx("checkboxs")}>
                      <input
                        type="checkbox"
                        checked={selectedAccounts.includes(account._id)}
                        onChange={() => handleSelectAccount(account._id)}
                      />
                      <span className={cx("checkmarks")}></span>
                    </label>
                  </td>
                  <td>{account.fullName}</td>
                  <td>{account.phone}</td>
                  <td>{account.email}</td>
                  <td>{account.nameRole}</td>
                  <td>
                    {new Date(account.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td>
                    <span
                      className={cx(
                        "badge",
                        account.status ? "badge-linesuccess" : "badge-linered"
                      )}
                      onClick={() =>
                        handleChangeStatus(account._id, account.status)
                      }
                    >
                      {account.status ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                  <td className={cx("action-table-data")}>
                    <div className={cx("edit-delete-action")}>
                      {permissions?.includes("accounts_edit") && (
                        <div
                          className={cx("icon")}
                          onClick={() => handlEdit(account)}
                        >
                          <ModeEditOutlineOutlinedIcon
                            style={{ color: "#3577f1" }}
                          />
                        </div>
                      )}
                      {permissions?.includes("accounts_delete") && (
                        <div
                          className={cx("icon")}
                          onClick={() => handleDelete(account._id)}
                        >
                          <DeleteOutlineOutlinedIcon style={{ color: "red" }} />
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

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          style: {
            marginTop: "-100px",
          },
        }}
      >
        <DialogTitle>Bạn có muốn xóa tài khoản này?</DialogTitle>

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
            <div className={cx("title")}>Chỉnh sửa người dùng</div>
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
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                  {getAccount.thumbnail ? (
                    <img
                      src={getAccount.thumbnail}
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
                  value={editAccount.fullName}
                  className={cx("input")}
                  onChange={handleInputChange}
                />
              </div>
              <div className={cx("formGroup")}>
                <div className={cx("label")}>
                  SĐT <span style={{ color: "red" }}>*</span>
                </div>
                <input
                  type="text"
                  name="phone"
                  value={editAccount.phone}
                  className={cx("input")}
                  onChange={handleInputChange}
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
                  value={editAccount.email}
                  className={cx("input")}
                  onChange={handleInputChange}
                />
              </div>
              <div className={cx("formGroup")}>
                <div className={cx("label")}>
                  Vai trò <span style={{ color: "red" }}>*</span>
                </div>
                <select
                  name="role_id"
                  className={cx("select-role")}
                  value={editAccount.role_id}
                  onChange={handleInputChange}
                >
                  <option value="">Chọn vai trò</option>
                  {allRole.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* <div className={cx("info")}>
              <div className={cx("formGroup")}>
                <div className={cx("label")}>Mật khẩu </div>
                <input
                  type="text"
                  name="password"
                  value={editAccount.password}
                  className={cx("input")}
                  onChange={handleInputChange}
                />
              </div>
            </div> */}
            <div className={cx("info")} style={{ marginBottom: "10px" }}>
              <div className={cx("label")}>Trạng thái</div>
              <div className={cx("switch")}>
                <Switch
                  name="status"
                  color="warning"
                  checked={editAccount.status}
                  onClick={() => {
                    setEditAccount((prev) => ({
                      ...prev,
                      status: !prev.status, // Đảo trạng thái
                    }));
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
                onClick={handleUpdate}
              >
                Lưu
              </button>
            </div>
          </div>
        </Box>
      </Dialog>
    </div>
  );
};

export default User;
