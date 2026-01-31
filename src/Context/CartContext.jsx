// src/Context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  /* ================= CART STATE ================= */
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });



  /* ================= HELPERS ================= */
  const normalizePrice = (price) => {
    if (!price) return 0;
    if (typeof price === "number") return price;
    return Number(String(price).replace(/[^0-9.]/g, "")) || 0;
  };

  /* ================= FETCH CART FROM DB ================= */
  const fetchCart = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        { withCredentials: true }
      );
      setCart(res.data || []);
    } catch (err) {
      console.log("FETCH CART ERROR", err.response?.data || err.message);
      setCart([]);
    }
  };

  /* ================= ADD TO CART ================= */
  const addToCart = async (product) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/add`,
        {
          productId: product._id,
          quantity: 1,
        },
        { withCredentials: true }
      );

      setCart(res.data || []);
    } catch (err) {
      console.error("ADD TO CART ERROR", err.response?.data || err.message);
    }
  };

  /* ================= REMOVE FROM CART ================= */
  const removeFromCart = async (productId) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/cart/${productId}`,
        { withCredentials: true }
      );

      setCart(res.data || []);
    } catch (err) {
      console.error("REMOVE CART ERROR", err.response?.data || err.message);
    }
  };

  /* ================= UPDATE QUANTITY ================= */
  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cart/${productId}`,
        { quantity },
        { withCredentials: true }
      );

      setCart(res.data || []);
    } catch (err) {
      console.error("UPDATE QTY ERROR", err.response?.data || err.message);
    }
  };

  /* ================= CLEAR CART ================= */
  const clearCart = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/cart/clear`,
        {},
        { withCredentials: true }
      );
      setCart([]);
    } catch {}
  };

  /* ================= WISHLIST ================= */
  const addToWishlist = (product) => {
    setWishlist((prev) =>
      prev.some((i) => i._id === product._id) ? prev : [...prev, product]
    );
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((i) => i._id !== id));
  };

  const isWishlisted = (id) =>
    wishlist.some((item) => item._id === id);

  const moveToCart = async (product) => {
    await addToCart(product);
    removeFromWishlist(product._id);
  };

  /* ================= TOTALS ================= */
  const safeCart = Array.isArray(cart) ? cart: [];
  const cartTotal = safeCart.reduce(
    (sum, item) =>
      sum + normalizePrice(item.productId?.price) * (item.quantity || 1),
    0
  );

  const cartCount = safeCart.reduce(
    (sum, item) => sum + (item.quantity || 0 ),
    0
  );

  const wishlistCount = wishlist.length;

  /* ================= INIT ================= */
  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  /* ================= PROVIDER ================= */
  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
        moveToCart,
        cartTotal,
        cartCount,
        wishlistCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
