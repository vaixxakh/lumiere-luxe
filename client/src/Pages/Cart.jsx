import React, { useState, useEffect } from "react";
import { useCart } from "../Context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import "./Cart.css";

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const [subtotal, setSubtotal] = useState(0);
  const shipping = 100;

  const safePrice = (price) => Number(price) || 0;

 
  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity ,
    0
  );

  useEffect(() => {
    const sum = cart.reduce(
      (total, item) =>
        total + safePrice(item.productId.price) * item.quantity,
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
    <div className="min-h-screen bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-semibold mb-4 transition text-sm sm:text-base"
          >
            <ArrowLeft size={18} />
            Back to Home
          </button>

          <p className="text-gray-600 text-sm sm:text-base">
            {totalItems} {totalItems === 1 ? "item" : "items"} in cart
          </p>
        </div>

       
        {cart.length === 0 ? (
          <div className="bg-white  shadow-lg p-10 text-center border">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 mb-6">Your cart is empty</p>
            <Link
              to="/products"
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item._id || item.id}
                  className="bg-white shadow-md p-6 flex gap-6 border"
                >
                  <img
                    src={item.productId.image}
                    alt={item.productId.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.productId.name}</h3>
                    <p className="text-yellow-600 font-bold text-xl mt-1">
                      ₹{(safePrice(item.productId.price) * item.quantity).toLocaleString()}
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center gap-2 mt-4">
                      <button
                        onClick={() =>
                          item.quantity > 1 &&
                          updateQuantity(item.productId._id, item.quantity -1 )
                        }
                        className="bg-gray-200 p-2 rounded-lg"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="px-4 py-1 bg-gray-100 rounded-lg font-bold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(item.productId._id , item.quantity + 1)
                        }
                        className="bg-gray-200 p-2 rounded-lg"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between text-right">
                    <div>
                      <p className="text-sm text-gray-600">Subtotal</p>
                      <p className="font-bold text-lg">
                        
                       ₹{(safePrice(item.productId.price) * item.quantity).toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        removeFromCart(item.productId._id )
                      }
                      className="text-red-500 hover:bg-red-100 p-2 r"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white  shadow-lg p-6 border h-fit sticky top-6">
              <h3 className="text-2xl font-bold mb-6">Order Summary</h3>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{shipping}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18%)</span>
                  <span>₹{tax}</span>
                </div>
              </div>

              <div className="border-t mt-4 pt-4 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-yellow-600">
                  ₹{total.toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500 py-3 rounded-lg font-bold"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block text-center mt-4 text-yellow-600 font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
