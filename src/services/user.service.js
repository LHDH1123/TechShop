import { AxiosInstance } from "../configs/axios";

export async function getAllUser() {
  try {
    const response = await AxiosInstance.get(`/user`);
    return response;
  } catch (error) {
    console.error("Lỗi lấy tất cả người dùng:", error);
    return null;
  }
}

export async function getUser(id) {
  try {
    const response = await AxiosInstance.get(`/user/${id}`);
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function editUser(id, data) {
  try {
    const response = await AxiosInstance.patch(`/user/edit/${id}`, data);
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function registerPost(data) {
  try {
    const response = await AxiosInstance.post("/user/register", data);
    return response;
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error.response.data);
    throw new Error(error.response.data.message);
  }
}

export async function loginPost(data) {
  try {
    const response = await AxiosInstance.post(
      "/user/login",
      data,
      { withCredentials: true } // Bật gửi cookie
    );
    return response;
  } catch (error) {
    console.error(
      "Lỗi khi đăng nhập:",
      error.response?.data?.error || error.message
    );
    return null;
  }
}

export async function logout() {
  try {
    await AxiosInstance.get("/user/logout", { withCredentials: true });
    return true;
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
    return false;
  }
}

export async function changePassWord(userId, data) {
  try {
    const response = await AxiosInstance.post(
      `/user/change-pass/${userId}`,
      data
    );
    return response;
  } catch (error) {
    console.error("Lỗi khi thay đổi mật khẩu:", error);
    // Ném lỗi để hàm gọi có thể xử lý
    throw error;
  }
}

export async function refreshTokenUser() {
  try {
    const response = await AxiosInstance.post("/user/refresh-token", null, {
      withCredentials: true, // Gửi cookie HTTP-only chứa refreshToken
    });
    const newAccessToken = response.accessToken;
    if (newAccessToken) {
      AxiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${newAccessToken}`;
      return newAccessToken;
    }
  } catch (error) {
    console.error(
      "❌ Lỗi refresh token:",
      error.response?.data?.message || error.message
    );
    return null;
  }
}

export async function forgotPasswordPost(email) {
  try {
    const response = await AxiosInstance.post(`/user/password/forgot`, {
      email,
    }); // ✅ Bọc lại thành object
    return response;
  } catch (error) {
    console.error("Lỗi khi nhập email thay đổi mật khẩu:", error);
    throw error;
  }
}

export async function otpPasswordPost(data) {
  try {
    const response = await AxiosInstance.post(`/user/password/otp`, data);
    return response;
  } catch (error) {
    console.error("Lỗi otp:", error);
    // Ném lỗi để hàm gọi có thể xử lý
    throw error;
  }
}

export async function resetPasswordPost(data) {
  try {
    const response = await AxiosInstance.post(`/user/password/reset`, data);
    return response;
  } catch (error) {
    console.error("Lỗi khi thay đổi mật khẩu:", error);
    // Ném lỗi để hàm gọi có thể xử lý
    throw error;
  }
}
