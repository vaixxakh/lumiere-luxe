import { useState } from "react";
import { useCart } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock, Loader, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

function Payment() {
  const navigate = useNavigate();
  const { cart, removeFromCart, createOrder, singleBuy, setSingleBuy } = useCart();

  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    addressLine: "",
    city: "",
    zipCode: "",
    paymentMethod: "cod",
  });

  const itemsToOrder = singleBuy
    ? [{ ...singleBuy, quantity: singleBuy.quantity || 1 }]
    : cart;

  const subtotal = itemsToOrder.reduce(
    (sum, i) => sum + Number(i.price) * i.quantity,
    0
  );
  const shipping = 100;
  const tax = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + shipping + tax;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    if (!formData.fullName || !formData.phoneNumber || !formData.addressLine)
      return toast.error("Please fill all address fields"), false;
    return true;
  };

  /* ================= COD ================= */
  const handleCOD = () => {
    const orderId = createOrder({
      items: itemsToOrder,
      paymentMethod: "COD",
      totals: { subtotal, shipping, tax, grandTotal },
      shipping: formData,
    });

    itemsToOrder.forEach((i) => removeFromCart(i.id));
    setSingleBuy(null);

    toast.success("Order placed successfully!");
    navigate(`/track/${orderId}`);
  };

  /* ================= RAZORPAY ================= */
  const handleRazorpay = async () => {
    try {
      setProcessing(true);

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
        { amount: grandTotal }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Lumiere Luxury Lighting",
        description: "Order Payment",
        order_id: data.id,

        handler: async function (response) {
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/payment/verify`,
            response
          );

          const orderId = createOrder({
            items: itemsToOrder,
            paymentMethod: "RAZORPAY",
            paymentId: response.razorpay_payment_id,
            totals: { subtotal, shipping, tax, grandTotal },
            shipping: formData,
          });

          itemsToOrder.forEach((i) => removeFromCart(i.id));
          setSingleBuy(null);

          toast.success("Payment successful!");
          navigate(`/track/${orderId}`);
        },

        prefill: {
          name: formData.fullName,
          contact: formData.phoneNumber,
        },

        theme: { color: "#e8c22b" },
      };

      new window.Razorpay(options).open();
      setProcessing(false);
    } catch (err) {
      setProcessing(false);
      toast.error("Payment failed!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (formData.paymentMethod === "cod") handleCOD();
    else handleRazorpay();
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-yellow-600 mb-6"
        >
          <ArrowLeft size={18} /> Back to Cart
        </button>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* LEFT */}
          <div className="lg:col-span-2 bg-white p-6 shadow rounded">
            <h2 className="text-2xl font-bold mb-4">Shipping Address</h2>

            {["fullName", "phoneNumber", "addressLine", "city", "zipCode"].map(
              (f) => (
                <input
                  key={f}
                  name={f}
                  placeholder={f}
                  onChange={handleChange}
                  className="w-full border p-3 rounded mb-3"
                />
              )
            )}

            <h2 className="text-xl font-bold mt-6 mb-3">Payment Method</h2>

            <label className="flex gap-2 mb-2">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === "cod"}
                onChange={handleChange}
              />
              Cash on Delivery
            </label>

            <label className="flex gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={formData.paymentMethod === "online"}
                onChange={handleChange}
              />
              Online Payment (UPI / Card / Netbanking)
            </label>

            <button
              disabled={processing}
              className="w-full mt-6 bg-yellow-400 py-3 font-bold rounded"
            >
              {processing ? (
                <span className="flex justify-center gap-2">
                  <Loader className="animate-spin" /> Processing
                </span>
              ) : (
                <>
                  <Lock size={18} /> Place Order
                </>
              )}
            </button>
          </div>

          {/* RIGHT */}
          <div className="bg-white p-6 shadow rounded h-fit">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <p>Subtotal: ₹{subtotal}</p>
            <p>Shipping: ₹{shipping}</p>
            <p>Tax: ₹{tax}</p>
            <hr className="my-3" />
            <p className="text-2xl font-bold text-yellow-600">
              ₹{grandTotal}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Payment;
