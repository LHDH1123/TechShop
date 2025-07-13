import { AxiosInstance } from "../configs/axios";

export async function getAllProducts(page = 1, limit = 10000) {
  try {
    const response = await AxiosInstance.get("/client/products", {
      params: { page, limit },
    });
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
}

export async function getDetailProduct(id) {
  try {
    const response = await AxiosInstance.get(`/client/products/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
}

export async function getDetailProductSlug(slug) {
  try {
    const response = await AxiosInstance.get(`/client/products/slug/${slug}`);
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
}

export async function getAllProductSlug(page = 1, limit = 20, slug) {
  try {
    const response = await AxiosInstance.get(
      `/client/products/getAll/${slug}`,
      {
        params: { page, limit },
      }
    );
    return response; // return the actual data
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
}

export async function getAllProductName(page = 1, limit = 20, name) {
  try {
    const response = await AxiosInstance.get(
      `/client/products/getAllWithName/${name}`,
      {
        params: { page, limit },
      }
    );
    return response; // return the actual data
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
}

export async function addProduct(data) {
  try {
    const response = await AxiosInstance.post("/admin/products/create", data);
    return response;
  } catch (error) {
    console.error("Error adding product:", error.response.data.error);
    throw new Error(error.response.data.error);
  }
}

export async function deleteProduct(id) {
  try {
    const response = await AxiosInstance.delete(`/admin/products/delete/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting product:", error);
    return null;
  }
}

export async function updateProduct(id, data) {
  try {
    const response = await AxiosInstance.patch(
      `/admin/products/edit/${id}`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error editing product:", error);
    throw new Error(error.response.data.error);
  }
}

export async function changeStatusProduct(id, status) {
  try {
    const response = await AxiosInstance.patch(
      `/admin/products/change-status/${id}/${status}`
    );
    return response;
  } catch (error) {
    console.error("Error editing product:", error);
    return null;
  }
}

export async function changeMultiProduct(data) {
  try {
    const response = await AxiosInstance.patch(
      `/admin/products/change-multi`,
      data
    );
    return response;
  } catch (error) {
    console.error("Error editing product:", error);
    return null;
  }
}
