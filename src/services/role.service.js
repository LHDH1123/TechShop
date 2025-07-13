import { AxiosInstance } from "../configs/axios";

export async function getAllRoles() {
  try {
    const response = await AxiosInstance.get("/role");
    return response;
  } catch (error) {
    console.error("Error fetching roles:", error);
    return null;
  }
}

export async function getRole(id) {
  try {
    const response = await AxiosInstance.get(`/role/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching roles:", error);
    return null;
  }
}

export async function getNameRole(id) {
  try {
    const response = await AxiosInstance.get(`/role/${id}`);
    return response.title;
  } catch (error) {
    console.error("Error fetching roles:", error);
    return null;
  }
}

export async function addRole(data) {
  try {
    const response = await AxiosInstance.post("/role/create", data);
    return response;
  } catch (error) {
    console.error("Error adding roles:", error);
    throw new Error(error.response.data.error);
  }
}

export async function deleteRoles(id) {
  try {
    const response = await AxiosInstance.delete(`/role/delete/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting roles:", error);
    return null;
  }
}

export async function updateRole(id, data) {
  try {
    const response = await AxiosInstance.patch(
      `/role/editPermission/${id}`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error editing roles:", error);
    throw new Error(error.response.data.error);
  }
}

export async function updateDataRole(id, data) {
  try {
    const response = await AxiosInstance.patch(`/role/edit/${id}`, data);
    return response;
  } catch (error) {
    console.error("Error editing roles:", error);
    return null;
  }
}

export async function changeStatusRole(id, status) {
  try {
    const response = await AxiosInstance.patch(
      `/role/change-status/${id}/${status}`
    );
    return response;
  } catch (error) {
    console.error("Error editing role:", error);
    return null;
  }
}
