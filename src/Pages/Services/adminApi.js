import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const authData = JSON.parse(localStorage.getItem("userInfo") || "{}");

    if (authData?.token) {
      config.headers.Authorization = `Bearer ${authData.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response, 
  (error) => {
    console.log(
      "API Error:",
      error?.response?.data?.message || error.message
    );
    return Promise.reject(error);
  }
);

/* =================== ADMIN PRODUCTS =================== */
export const getProducts = () => API.get("/admin/products");
export const getProductById = (id) => API.get(`/admin/products/${id}`);
export const createProduct = (payload) =>
  API.post("/admin/products", payload);
export const updateProduct = (id, payload) =>
  API.put(`/admin/products/${id}`, payload);
export const deleteProduct = (id) =>
  API.delete(`/admin/products/${id}`);
export const archiveProduct = (id) =>
  API.patch(`/admin/products/${id}/archive`);

/* =================== ADMIN ORDERS =================== */
export const getOrders = () => API.get("/admin/orders");
export const getOrderById = (id) => API.get(`/admin/orders/${id}`);
export const updateOrderStatus = (id, status) =>
  API.patch(`/admin/orders/${id}/status`, { status });
export const deleteOrder = (id) =>
  API.delete(`/admin/orders/${id}`);

/* =================== ADMIN USERS =================== */
export const getUsers = () => API.get("/admin/users");
export const blockUser = (id) =>
  API.patch(`/admin/users/${id}/block`);
export const unblockUser = (id) =>
  API.patch(`/admin/users/${id}/unblock`);
export const deleteUser = (id) =>
  API.delete(`/admin/users/${id}`);

/* =================== AUTH =================== */
export const loginUser = (payload) =>
  API.post("/auth/login", payload);
export const registerUser = (payload) =>
  API.post("/auth/register", payload);
export const logoutUser = () => API.post("/auth/logout");
export const getProfile = () => API.get("/auth/me");

/* =================== DASHBOARD =================== */
export const getDashboardStats = () =>
  API.get("/admin/dashboard");

export default API;
