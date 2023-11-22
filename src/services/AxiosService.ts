import axios from "axios";
import { BACKEND_URL } from "../config";

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

const setAccessToken = (token: string) => {
  axiosInstance.defaults.headers.common["x-access-token"] = token;
};

export { axiosInstance, setAccessToken };
