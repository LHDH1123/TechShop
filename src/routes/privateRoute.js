// PrivateRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { checkLogin } from "../services/auth.service"; // Gọi API backend để kiểm tra đăng nhập

const PrivateRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const res = await checkLogin();
        setIsAuthenticated(res?.loggedIn || false);
      } catch (error) {
        console.error("Lỗi kiểm tra đăng nhập:", error);
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, []);

  if (isChecking) return <div>Đang kiểm tra đăng nhập...</div>;

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/adminbb/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
