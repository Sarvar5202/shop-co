import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://e-commerce-api-v2.nt.azimumarov.uz/api/v1",
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
