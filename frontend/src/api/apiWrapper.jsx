import axios from "axios";

// const API_BASE_URL = "http://192.168.0.104:5000/api/";
// const API_BASE_URL = "https://localhost:7179/api/";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const setAuthToken = (token) => {
  console.log("Setting auth token:", token);

  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};
// Interceptor: return only the response data
// api.interceptors.response.use(
//   (response) => response.data,
//   (error) => {
//     if (error.response && error.response.data) {
//       return Promise.reject(error.response.data);
//     }
//     return Promise.reject(error);
//   },
// );

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}auth/refresh`,
          {},
          { withCredentials: true },
        );

        const newAccessToken = refreshResponse.data.accessToken.token;

        setAuthToken(newAccessToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // localStorage.removeItem("accessToken");
        console.error("Token refresh failed:", refreshError);
        // window.location.href = "/login";
      }
    }

    return Promise.reject(error.response?.data || error);
  },
);

const apiWrapper = async (url, method = "GET", data = null) => {
  try {
    const config = { method, url, headers: {} };

    if (data instanceof FormData) {
      config.data = data;
    } else if (data) {
      config.headers["Content-Type"] = "application/json";
      config.data = data;
    }
    console.log(config);
    return await api(config);
  } catch (error) {
    console.log(error);
    // console.error("API error:", error);
    throw error;
  }
};

// CRUD
export const create = (url, data) => apiWrapper(url, "POST", data);
export const read = (url) => apiWrapper(url, "GET");
export const update = (url, data) => apiWrapper(url, "PUT", data);
export const patch = (url, data) => apiWrapper(url, "PATCH", data);
export const remove = (url, data) => apiWrapper(url, "DELETE", data);

export default api;
