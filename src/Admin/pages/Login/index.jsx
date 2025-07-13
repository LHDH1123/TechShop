import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Login.module.scss";
import { checkLogin, loginPost } from "../../../services/auth.service";

const cx = classNames.bind(styles);

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Reset error on input change
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await loginPost(formData);
      setLoading(false);

      if (response?.loggedIn) {
        console.log("✅ Login thành công");
        navigate("/adminbb");
      } else {
        setError(response?.error || "Đăng nhập thất bại");
      }
    } catch (err) {
      setLoading(false);
      console.error("🔥 Đăng nhập lỗi:", err);
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await checkLogin();
        if (res?.loggedIn) {
          navigate("/adminbb");
        }
      } catch (err) {
        // Không cần xử lý nếu chưa đăng nhập
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className={cx("container")}>
      <div className={cx("left")}>
        <img
          src="https://image.hsv-tech.io/300x0/bbx/common/50a26167-9341-4be8-8aba-9682d3b4a916.webp"
          alt="Logo"
          className={cx("logo")}
        />
        <div className={cx("title")}>We are the Beauty Box</div>

        <div className={cx("form")}>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
          />
          {error && <div className={cx("error")}>{error}</div>}

          <div
            className={cx("btn", { disabled: loading })}
            onClick={!loading ? handleLogin : undefined}
          >
            {loading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
          </div>
        </div>
      </div>

      <div className={cx("right")}>
        <div>
          <h2>We are more than just a company</h2>
          <p>
            We are committed to delivering true value, continuously innovating
            and growing to create better things.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
