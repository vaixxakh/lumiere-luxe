import  axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if(token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject( error )
)

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = 
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";
      console.log("API Error", message)
      return Promise.reject(error)

  }
);

export const getProducts = () => API.get("/products");
export const getProductById = (id) => API.get(`/products/${id}`);
export const createProduct = (payload) => API.post("/products", payload);
export const updateProduct = (id, payload) =>
  API.put(`/products/${id}`, payload);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const archiveProduct = (id) =>
  API.patch(`/products/${id}/archive`);

export const getOrders = () => API.get("/orders");
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) =>
  API.patch(`/orders/${id}/status`, { status });
export const deleteOrder = (id) => API.delete(`/orders/${id}`);

export const getUsers = () => API.get("/users");
export const blockUser = (id) => API.patch(`/users/${id}/block`);
export const unblockUser = (id) => API.patch(`/users/${id}/unblock`);
export const deleteUser = (id) => API.delete(`/users/${id}`);

export const loginUser = (payload) =>
  API.post("/auth/login", payload);
export const registerUser = (payload) =>
  API.post("/auth/register", payload);
export const logoutUser = () => API.post("/auth/logout");
export const getProfile = () => API.get("/auth/me");

export const getDashboardStats = () =>
  API.get("/admin/dashboard-stats");

export default API;