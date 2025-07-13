import { AxiosInstance } from "../configs/axios";

export async function getAllAccounts() {
  try {
    const response = await AxiosInstance.get("/accounts");
    return response;
  } catch (error) {
    console.error("Error fetching Accounts:", error);
    return null;
  }
}

export async function getAccount(id) {
  try {
    const response = await AxiosInstance.get(`/accounts/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching Accounts:", error);
    return null;
  }
}

export async function addAccount(data) {
  try {
    const response = await AxiosInstance.post("/accounts/create", data);
    return response;
  } catch (error) {
    console.error("Error adding Accounts:", error);
    throw new Error(error.response.data.error);
  }
}

export async function deleteAccounts(id) {
  try {
    const response = await AxiosInstance.delete(`/accounts/delete/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting Accounts:", error);
    return null;
  }
}

export async function updateAccount(id, data) {
  try {
    const response = await AxiosInstance.patch(`/accounts/edit/${id}`, data);
    return response;
  } catch (error) {
    console.error("Error editing Accounts:", error);
    throw new Error(error.response.data.error);
  }
}

export async function changeStatusAccount(id, status) {
  try {
    const response = await AxiosInstance.patch(
      `/accounts/change-status/${id}/${status}`
    );
    return response;
  } catch (error) {
    console.error("Error editing Account:", error);
    return null;
  }
}

export async function changeMultiAccount(data) {
  try {
    const response = await AxiosInstance.patch(`/accounts/change-multi`, data);
    return response;
  } catch (error) {
    console.error("Error change status Account:", error);
    return null;
  }
}
