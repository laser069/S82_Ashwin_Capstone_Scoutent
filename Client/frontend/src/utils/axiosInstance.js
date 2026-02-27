import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api", // changed to relative path for Vite Proxy
  withCredentials: true, // if you later use cookies
});

export default axiosInstance;
