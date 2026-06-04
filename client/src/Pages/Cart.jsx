import React, { useState, useEffect } from "react";
import { useCart } from "../Context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const [subtotal, setSubtotal] = useState(0);
  const shipping = 100;

  const safePrice = (price) => Number(price) || 0;

  const totalItems = cart.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  useEffect(() => {
    const sum = cart.reduce(
      (total, item) =>
        total + safePrice(item.productId?.price) * (item.quantity || 1),
      0
    );
    setSubtotal(sum);
  }, [cart]);

  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-[10%] left-[-10%] w-[35%] h-[35%] rounded-full bg-yellow-400/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-amber-500/5 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Navigation & Stats Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <button
              onClick={() => navigate("/products")}
              className="flex items-center gap-2 text-slate-500 hover:text-yellow-600 font-bold text-xs uppercase tracking-wider transition-colors duration-200 cursor-pointer mb-3"
            >
              <ArrowLeft size={16} /> Continue Shopping
            </button>
            <h1 className="text-3xl font-luxury font-bold text-slate-900">
              Shopping Cart
            </h1>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100/80 px-4 py-2 rounded-full border border-slate-200/50">
            {totalItems} {totalItems === 1 ? "Item" : "Items"}
          </span>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-slate-100 rounded-3xl shadow-sm p-12 text-center max-w-xl mx-auto flex flex-col items-center justify-center"
          >
            <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={36} className="text-yellow-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-slate-500 text-sm max-w-sm mb-8 leading-relaxed">
              Explore our designer chandeliers and bespoke lighting collections to illuminate your luxury space.
            </p>
            <Link
              to="/products"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold py-3.5 px-8 rounded-xl shadow-md transition-all duration-200 text-sm uppercase tracking-wider"
            >
              Shop Collection
            </Link>
          </motion.div>
        ) : (
          /* Cart List & Summary Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Side: Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => {
                if (!item.productId) return null;
                return (
                  <div
                    key={item._id || item.id}
                    className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center sm:items-stretch gap-4 sm:gap-6 shadow-sm hover:shadow-md transition-shadow duration-300 relative"
                  >
                    {/* Item Image */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.productId.image}
                        alt={item.productId.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex flex-col justify-between flex-grow text-center sm:text-left">
                      <div>
                        <span className="text-[9px] tracking-widest font-extrabold text-yellow-600 uppercase block mb-1">
                          {item.productId.category}
                        </span>
                        <h3 className="font-bold text-slate-800 text-base sm:text-lg leading-snug line-clamp-2">
                          {item.productId.name}
                        </h3>
                        <p className="text-slate-900 font-extrabold text-sm sm:text-base mt-2">
                          ₹{safePrice(item.productId.price).toLocaleString()}
                        </p>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center justify-center sm:justify-start gap-3 mt-4 sm:mt-0">
                        <button
                          onClick={() =>
                            item.quantity > 1 &&
                            updateQuantity(item.productId._id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus size={12} />
                        </button>

                        <span className="text-xs font-bold text-slate-800 w-8 text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item.productId._id, item.quantity + 1)
                          }
                          className="w-8 h-8 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Right Side: Price Total & Delete */}
                    <div className="flex sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0 w-full sm:w-auto mt-4 sm:mt-0">
                      <div className="text-center sm:text-right hidden sm:block">
                        <p className="text-[10px] tracking-wider font-extrabold text-slate-400 uppercase">Subtotal</p>
                        <p className="font-extrabold text-slate-900 text-lg">
                          ₹{(safePrice(item.productId.price) * item.quantity).toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId._id)}
                        className="text-slate-400 hover:text-red-500 hover:bg-red-50/50 p-2 sm:p-2.5 rounded-xl border border-transparent hover:border-red-100 transition-all duration-200 cursor-pointer flex items-center gap-1 text-xs font-bold uppercase tracking-wider"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} /> <span className="sm:hidden">Remove</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Side: Order Summary */}
            <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 pb-4 border-b border-slate-100 mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span className="font-extrabold text-slate-900">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Shipping</span>
                  <span className="text-green-600 font-extrabold">₹{shipping}</span>
                </div>
                <div className="flex justify-between font-medium pb-4 border-b border-slate-100">
                  <span>Tax (GST 18%)</span>
                  <span className="font-extrabold text-slate-900">₹{tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center text-lg font-bold text-slate-900 mb-6">
                <span>Total Amount</span>
                <span className="text-yellow-600 font-extrabold text-xl">
                  ₹{total.toLocaleString()}
                </span>
              </div>

              {/* Checkout Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer text-sm uppercase tracking-wider active:scale-[0.99]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={16} />
                </button>

                <Link
                  to="/products"
                  className="block text-center text-slate-500 hover:text-yellow-600 text-xs font-bold uppercase tracking-wider py-2 transition-colors duration-200"
                >
                  Back to Shop
                </Link>
              </div>

              {/* Security Shield Badge */}
              <div className="mt-6 border-t border-slate-100 pt-6 flex items-start gap-3 text-slate-500 bg-slate-50/50 p-4 rounded-2xl border">
                <ShieldCheck className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-[11px] leading-relaxed font-medium">
                  <strong>Secure Checkout Assured:</strong> 256-bit encryption protects your personal & billing data during transactions.
                </p>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
