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


  /* ================= FETCH CART FROM DB ================= */
  const fetchCart = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/cart`,
        { withCredentials: true }
      );
      setCart(res.data.cart);
    } catch (err) {
      console.log("FETCH CART ERROR", err.response?.data || err.message);
      setCart([]);
    }
  };

  /* ================= ADD TO CART ================= */
  const addToCart = async (productId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/cart/add`,
        { productId, quantity: 1},
        { withCredentials: true }
      );  
      
      setCart(res.data.cart);
    } catch (err) {
      console.error("ADD TO CART ERROR", err.response?.data || err.message);
    }
  };

  /* ================= REMOVE FROM CART ================= */
  const removeFromCart = async (productId) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/cart/${productId}`,
        { withCredentials: true }
      );

      setCart(res.data.cart);
    } catch (err) {
      console.error("REMOVE CART ERROR", err.response?.data || err.message);
    }
  };

  /* ================= UPDATE QUANTITY ================= */
  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/cart/${productId}`,
        { quantity },
        { withCredentials: true }
      );

      setCart(res.data.cart);
    } catch (err) {
      console.error("UPDATE QTY ERROR", err.response?.data || err.message);
    }
  };

  /* ================= CLEAR CART ================= */
  const clearCart = async () => {
    try {
     const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/cart/clear`,
        { withCredentials: true }
      );
      setCart(res.data.cart);
    } catch {}
  };

  /* ================= WISHLIST ================= */
  const addToWishlist = (productId) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev : [...prev, productId]
    );
  };
  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(id => id !== productId));
  };

  const isWishlisted = (productId) =>
    wishlist.includes(productId);

  const moveToCart = async (productId) => {
    try {
      await addToCart(productId);
      removeFromWishlist(productId);
    } catch (error) {
      console.log("Move to cart failed!", error);
    }
  };

  /* ================= TOTALS ================= */
  const safeCart = Array.isArray(cart) ? cart: [];
  
 const cartTotal = safeCart.reduce(
  (sum, item) =>
    sum + (item.productId?.price || 0) * (item.quantity || 1),
  0
);

  const cartCount = safeCart.reduce(
    (sum, item) => sum + Math.max(0, Number(item.quantity )|| 0 ),
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
