import React, { createContext, useContext, useState, useEffect } from "react";
import { checkLogin } from "../../services/auth.service";
import { getRole } from "../../services/role.service";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [permissions, setPermissions] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const res = await checkLogin();

      if (res?.user) {
        const response = await getRole(res.user.role_id);
        if (response) {
          setPermissions(response.permissions);
        }
      }
    } catch (err) {
      console.error(err);
      setPermissions(null);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return React.createElement(
    AuthContext.Provider,
    { value: { permissions, setPermissions } },
    children
  );
};

export const useAuth = () => useContext(AuthContext);
