import axios from "axios";
import { API_END_POINT } from "../../constants/api";

const instances = axios.create({
  baseURL: API_END_POINT,
  timeout: 300000,
  withCredentials: true,
});

instances.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async function (error) {
    return Promise.reject(error);
  }
);

// function setAuthHeader(token) {
//   instances.defaults.headers.common.Authorization = "Bearer " + token;
// }

// export { instances as AxiosInstance, setAuthHeader };
export { instances as AxiosInstance };
