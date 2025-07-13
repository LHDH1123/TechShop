// src/utils/axios/axiosAI.js
import axios from "axios";
import { API_AI } from "../../constants/api";

const aiAxios = axios.create({
  baseURL: API_AI,
  timeout: 300000,
});

aiAxios.interceptors.response.use(
  (response) => response.data,
  async (error) => Promise.reject(error)
);

export { aiAxios };
