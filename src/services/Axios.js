import axios from "axios";
import { getAuthUser, removeAuthUser, setAuthUser } from "@/actions/user";
import { API_URL } from "@/config/Consts";

const axiosInstance = axios.create({
  baseURL: API_URL || "http://localhost:9090",
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    if (config.meta?.requiresAdmin) {
      try {
        const authUser = await getAuthUser();

        if (authUser?.token) {
          if (!config.headers["Authorization"]) {
            config.headers["Authorization"] = `Bearer ${authUser.token}`;
          }
        }
      } catch (error) {
        console.error("Auth fetch error:", error);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses globally
axiosInstance.interceptors.response.use(
  async (response) => {
    // Auto-save token if API returns a new one
    if (response?.data?.token) {
      await setAuthUser({ token: response.data.token, ...response.data.data });
    }

    return response.data;
  },
  async (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      await removeAuthUser();
    }

    // Return consistent error object
    return Promise.reject(
      error?.response?.data ?? { message: "Something went wrong" }
    );
  }
);

export default axiosInstance;
