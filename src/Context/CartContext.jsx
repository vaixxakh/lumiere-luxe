// src/Context/CartContext.jsx
import  { createContext, useContext, useState, useEffect } from "react";


const CartContext = createContext();

export const CartProvider = ({ children }) => {

 /* ================= CART STATE ================= */

  const [cart, setCart] = useState(() => {
    if(typeof window === "undefined") return [];  
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  /* ================= WISHLIST STATE ================= */

  const [wishlist, setWishlist] = useState(() => {
     if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  /* ================= SINGLE BUY ================= */

  const [singleBuy, setSingleBuy] = useState(null);

/* ================= HELPERS ================= */

  const normalizePrice = (price) => {
    if (price == null) return 0;
    if (typeof price === "number") return price;
    const cleaned = String(price).replace(/[^0-9.-]+/g, "");
    const n = parseFloat(cleaned);
    return Number.isNaN(n) ? 0 : n;
  };

 /* ================= CART FUNCTIONS ================= */

  const addToCart = (product) => {
    setCart((prev) => {
      const price = normalizePrice(product.price);
      const existing = prev.find((item) => item._id === product._id);

      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prev, { ...product, price, quantity: 1 }];
    });
  };

  const updateQuantity = (id, newQty) => {
    setCart((prev) =>
      newQty <= 0
        ? prev.filter((item) => item._id !== id)
        : prev.map((item) =>
            item._id === id ? { ...item, quantity: newQty } : item
          )
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

   /* ================= WISHLIST FUNCTIONS ================= */

  const addToWishlist = ( product ) => {
    setWishlist((prev) => {
      const exists = prev.some((i) => i._id === product._id);
      if(exists) return  prev;
      return [ ...prev, product];
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((i) => i._id !== id));
  };

  const isWishlisted = (productId) =>
    wishlist.some((item) => item._id === productId);

  const moveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product._id);
  };

    /* ================= TOTALS ================= */

    const cartTotal = cart.reduce(
      (sum, item) => 
        sum + normalizePrice( item.price ) * ( item.quantity || 1),
      0
    );

    const cartCount = cart.reduce(
      (sum, item) => sum + ( item.quantity || 1),
      0
    );

    const wishlistCount = wishlist.length;

    /* ================= LOCAL STORAGE SYNC ================= */

    useEffect(() => {
      localStorage.setItem("cart", JSON.stringify(cart));
    },[cart]);

    useEffect(() => {
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    },[wishlist]);

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
        wishlistCount,
        singleBuy,
        setSingleBuy,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);