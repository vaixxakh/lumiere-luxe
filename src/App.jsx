import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthModalProvider } from "./Context/AuthModalContext";
import { useAuthModal } from "./Context/AuthModalContext";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import LuxuryProducts from "./components/products/LuxuryProducts";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Wishlist from "./Pages/Wishlist";
import Cart from "./Pages/Cart";
import Payment from "./Pages/Payment";
import OrderTrack from "./Pages/OrderTrack";
import Orders from "./Pages/Orders";
import Account from "./Pages/Account";
import Contact from "./Pages/Contact";
import About from "./Pages/About";
import ProductDetailsPage from "./Pages/ProductDetailsPage";

// Admin Pages
import AdminLayout from "./Pages/admin/AdminLayout";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import AdminProducts from "./Pages/admin/AdminProducts";
import AdminOrders from "./Pages/admin/AdminOrders";
import AdminUsers from "./Pages/admin/AdminUsers";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";

/* =============== LAYOUT =============== */
const Layout = ({ children }) => {
  const location = useLocation();

  const NO_LAYOUT_PAGES = [
    "/login",
    "/signup",
    "/payment",
    "/account",
  ];

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isNoLayoutPage = NO_LAYOUT_PAGES.includes(location.pathname);
  const shouldHideLayout = isAdminRoute || isNoLayoutPage;

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideLayout && <Navbar />}
      <main className="flex-1">{children}</main>
    </div>
  );
};

function AppInner() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    showLogin,
    setShowLogin,
    showSignup,
    setShowSignup,
  } = useAuthModal();

  useEffect(() => {
    document.body.style.overflow =
      showLogin || showSignup ? "hidden" : "auto";
  }, [showLogin, showSignup]);

  return (
    <>
      <ToastContainer position="top-center" autoClose={1500} />

      <Layout>
        <ScrollToTop />
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/collections" element={<LuxuryProducts />} />
          <Route
            path="/products"
            element={<Products searchTerm={searchTerm} />}
          />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/track/:orderId" element={<OrderTrack />} />

          {/* PROTECTED */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />

          {/* ======== ADMIN ROUTES (CORRECTED) ======== */}
          <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-4xl font-bold text-red-500">
                  404 Page Not Found
                </h1>
              </div>
            }
          />
        </Routes>
      </Layout>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowLogin(false)}
          />
          <div className="relative z-10">
            <Login />
          </div>
        </div>
      )}

      {/* SIGNUP MODAL */}
      {showSignup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSignup(false)}
          />
          <div className="relative z-10">
            <SignUp />
          </div>
        </div>
      )}

      {location.pathname === "/" && <Footer />}
    </>
  );
}

/* =============== MAIN APP =============== */
export default function App() {
  return (
    <AuthModalProvider>
      <AppInner />
    </AuthModalProvider>
  );
}
