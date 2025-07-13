import { AxiosInstance } from "../configs/axios";

export async function loginPost(data) {
  try {
    const response = await AxiosInstance.post("/auth/loginPost", data, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error("❌ Lỗi khi đăng nhập:", error);
    return {
      error: error || "Lỗi không xác định",
    };
  }
}

export async function checkLogin() {
  try {
    const response = await AxiosInstance.get("/auth/login", {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    return { loggedIn: false, message: error };
  }
}

export async function logout() {
  try {
    await AxiosInstance.get("/auth/logout", { withCredentials: true });
    return true;
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
    return false;
  }
}
