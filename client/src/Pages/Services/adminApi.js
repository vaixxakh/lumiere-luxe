import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,   
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===================== JWT INTERCEPTOR ===================== */

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

/* ===================== ERROR INTERCEPTOR ===================== */

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

/* ===================== ADMIN DASHBOARD ===================== */

export const getDashboardStats = () =>
  API.get("/admin/dashboard");

/* ===================== ADMIN PRODUCTS ===================== 
*/

export const getProducts = () =>
  API.get("/admin/products");   

export const createProduct = (payload) =>
  API.post("/admin/product", payload); 

export const updateProduct = (id, payload) =>
  API.put(`/admin/product/${id}`, payload); 

export const deleteProduct = (id) =>
  API.delete(`/admin/product/${id}`); 
export const getProductById = (id) =>
  API.get(`/admin/products/${id}`);

/* ===================== ADMIN ORDERS ===================== */

export const getOrders = () =>
  API.get("/admin/orders"); 

export const updateOrderStatus = (id, status) =>
  API.patch(`/admin/orders/${id}/status`, { status });

// /* ===================== ADMIN USERS  ===================== */

export const getAllUsers = () =>
  API.get("/admin/users"); 

export const blockUser = (id) =>
  API.patch(`/admin/users/block/${id}`);

export const unblockUser = (id) =>
  API.patch(`/admin/users/unblock/${id}`);



/* ===================== AUTH ===================== */

export const loginUser = (payload) =>
  API.post("/auth/login", payload);

export const registerUser = (payload) =>
  API.post("/auth/register", payload);

export const logoutUser = () =>
  API.post("/auth/logout");

export const getProfile = () =>
  API.get("/auth/me");

export default API;
