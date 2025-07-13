import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./Permissions.module.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { getRole, updateRole } from "../../../../services/role.service";
import { useAuth } from "../../../Context/Auth.context";

const cx = classNames.bind(styles);

const modules = [
  "Sản phẩm",
  "Danh mục",
  "Thương hiệu",
  "Tài khoản",
  "Vai trò",
  "Voucher",
  "Đánh giá",
  "Đơn hàng",
];
const permissionsMenu = ["Tất cả", "Xem", "Cập nhật", "Thêm mới", "Xóa"];

const Permissions = () => {
  const { id } = useParams();
  const [checked, setChecked] = useState({});
  const [role, setRole] = useState({});
  const navigate = useNavigate();
  const [initialPermissions, setInitialPermissions] = useState([]); // Lưu trạng thái ban đầu
  const { permissions } = useAuth();

  const moduleMapping = {
    "Sản phẩm": "products",
    "Danh mục": "products-category",
    "Thương hiệu": "brands",
    "Tài khoản": "accounts",
    "Vai trò": "roles",
    Voucher: "vouchers",
    "Đánh giá": "reviews",
    "Đơn hàng": "orders",
  };

  const permissionMapping = {
    Xem: "view",
    "Cập nhật": "edit",
    "Thêm mới": "create",
    Xóa: "delete",
  };

  const handleCheck = (module, permission) => {
    setChecked((prev) => {
      const isSelectAll = permission === "Tất cả";

      if (isSelectAll) {
        // Chọn tất cả hoặc bỏ chọn tất cả quyền trong cùng một module
        const newPermissions = permissionsMenu.reduce((acc, perm) => {
          acc[perm] = !prev[module]?.[permission] || false;
          return acc;
        }, {});

        return {
          ...prev,
          [module]: newPermissions,
        };
      } else {
        // Cập nhật quyền được chọn
        const updatedModulePermissions = {
          ...prev[module],
          [permission]: !prev[module]?.[permission],
        };

        // Kiểm tra xem có phải tất cả quyền (trừ "Tất cả") đều đã được chọn không
        const allChecked = permissionsMenu
          .slice(1)
          .every((perm) => updatedModulePermissions[perm]);

        updatedModulePermissions["Tất cả"] = allChecked; // Cập nhật trạng thái của "Tất cả"

        return {
          ...prev,
          [module]: updatedModulePermissions,
        };
      }
    });
  };
  const fetchRole = async () => {
    const response = await getRole(id);
    if (response) {
      setRole(response);
      setInitialPermissions(response.permissions); // Lưu trạng thái ban đầu

      const newChecked = {};
      modules.forEach((module) => {
        const moduleKey = moduleMapping[module];
        if (!moduleKey) return;

        newChecked[module] = {};
        permissionsMenu.forEach((perm) => {
          if (perm === "Tất cả") return;

          const permissionKey = permissionMapping[perm];
          if (!permissionKey) return;

          const hasPermission = response.permissions.includes(
            `${moduleKey}_${permissionKey}`
          );
          newChecked[module][perm] = hasPermission;
        });

        newChecked[module]["Tất cả"] = Object.values(newChecked[module]).every(
          (v) => v
        );
      });

      setChecked(newChecked);
    }
  };

  // Hàm kiểm tra sự thay đổi quyền
  const hasPermissionsChanged = (updatedPermissions) => {
    return (
      updatedPermissions.length !== initialPermissions.length ||
      updatedPermissions.some((perm) => !initialPermissions.includes(perm))
    );
  };

  // Hàm cập nhật quyền lên API
  const handleSavePermissions = async () => {
    if (!permissions?.includes("roles_edit")) {
      handleRole();
      return;
    }
    const updatedPermissions = [];

    Object.keys(checked).forEach((module) => {
      Object.keys(checked[module]).forEach((perm) => {
        if (perm !== "Tất cả" && checked[module][perm]) {
          const moduleKey = moduleMapping[module];
          const permissionKey = permissionMapping[perm];

          if (moduleKey && permissionKey) {
            updatedPermissions.push(`${moduleKey}_${permissionKey}`);
          }
        }
      });
    });

    if (!hasPermissionsChanged(updatedPermissions)) {
      handleRole();
      return;
    }

    const response = await updateRole(id, { permissions: updatedPermissions });

    if (response) {
      setInitialPermissions(updatedPermissions); // Cập nhật trạng thái mới
      fetchRole();
      handleRole();
    } else {
      alert("Cập nhật quyền thất bại!");
    }
  };

  useEffect(() => {
    fetchRole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRole = () => {
    navigate("/adminbb/role");
  };

  return (
    <div className={cx("container")}>
      <div className={cx("header")}>
        <div className={cx("title-header")}>
          <div className={cx("title")}>
            <div className={cx("title-page")}>Quyền hạn</div>
            <div className={cx("title-desc")}>Quản lí quyền của bạn</div>
          </div>
        </div>
        <div className={cx("btn-add")} onClick={handleSavePermissions}>
          <ArrowBackIcon fontSize="inherit" />
          <button>Quay lại</button>
        </div>
      </div>

      <div className={cx("table-container")}>
        <div className={cx("search-role-container")}>
          <span className={cx("role-text")}>
            Vai trò: <span className={cx("role")}>{role.title}</span>
          </span>
        </div>
        <table className={cx("table")}>
          <thead>
            <tr>
              <th
                className={cx("module-header")}
                style={{
                  width: "0px",
                  border: "1px solid #e0e0e0",
                  padding: "12px",
                  textAlign: "center",
                }}
              >
                Trang
              </th>
              {permissionsMenu.map((perm) => (
                <th
                  style={{
                    border: "1px solid #e0e0e0",
                    padding: "12px",
                    textAlign: "center",
                  }}
                  key={perm}
                  className={cx("permission-header")}
                >
                  {perm}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {modules.map((module) => (
              <tr key={module}>
                <td
                  className={cx("module-name")}
                  style={{
                    width: "0px",
                    border: "1px solid #e0e0e0",
                    padding: "12px",
                    textAlign: "center",
                  }}
                >
                  {module}
                </td>
                {permissionsMenu.map((perm) => (
                  <td
                    key={perm}
                    className={cx("checkbox-cell")}
                    style={{
                      width: "0px",
                      border: "1px solid #e0e0e0",
                      padding: "12px",
                      textAlign: "center",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked[module]?.[perm] || false}
                      onChange={() => handleCheck(module, perm)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Permissions;
