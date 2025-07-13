import { AxiosInstance } from "../configs/axios";

export async function getCategorys() {
  try {
    const response = await AxiosInstance.get("/client/categorys");
    return response;
  } catch (error) {
    console.error("Error fetching categorys:", error);
    return null;
  }
}

export async function getDetail(id) {
  try {
    const response = await AxiosInstance.get(`/client/categorys/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching categorys:", error);
    return null;
  }
}

export async function getDetailSlug(slug) {
  try {
    const response = await AxiosInstance.get(`/client/categorys/slug/${slug}`);
    return response;
  } catch (error) {
    console.error("Error fetching categorys:", error);
    return null;
  }
}

export async function addCategory(data) {
  try {
    const response = await AxiosInstance.post("/admin/categorys/create", data);
    return response;
  } catch (error) {
    console.error("Error adding category:", error);
    throw new Error(error.response.data.error);
  }
}

export async function deleteCategory(id) {
  try {
    const response = await AxiosInstance.delete(
      `/admin/categorys/delete/${id}`
    );
    return response;
  } catch (error) {
    console.error("Error deleting category:", error);
    return null;
  }
}

export async function updateCategory(id, data) {
  try {
    const response = await AxiosInstance.patch(
      `/admin/categorys/edit/${id}`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error editing category:", error);
    throw new Error(error.response.data.error);
  }
}

export async function changeStatus(id, status) {
  try {
    const response = await AxiosInstance.patch(
      `/admin/categorys/change-status/${id}/${status}`
    );
    return response;
  } catch (error) {
    console.error("Error editing category:", error);
    return null;
  }
}

export async function changeMultiCategory(data) {
  try {
    const response = await AxiosInstance.patch(
      `/admin/categorys/change-multi`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error editing category:", error);
    return null;
  }
}

export async function getNameCategory(id) {
  try {
    const response = await AxiosInstance.get(`/client/categorys/${id}`);
    return response.title;
  } catch (error) {
    console.error("Error fetching categorys:", error);
    return null;
  }
}
