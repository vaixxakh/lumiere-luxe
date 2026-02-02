import { useState } from "react";
import { useCart } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock, Loader, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import "./Payment.css"

function Payment() {
  const navigate = useNavigate();
  const { cart } = useCart();

  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    addressLine: "",
    city: "",
    zipCode: "",
    paymentMethod: "COD",
  });

   /* ================= CART ITEMS ================= */

  const itemsToOrder = cart;

  const subtotal = itemsToOrder.reduce(
    (sum, i) => 
      sum + Number(i.productId?.price || i.price) * i.quantity,
    0
  );

  const shippingCharge = 50;
  const tax = Math.round(subtotal * 0.03);
  const grandTotal = subtotal + shippingCharge + tax;
  
  /* ================= FORM ================= */

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    if (!formData.fullName || !formData.phoneNumber || !formData.addressLine){
      toast.error("Please fill all address fields");
      return false;
    }
    return true;
  };

  /* ================= COD ================= */
  
  const handleCOD = async () => {

    try {
      setProcessing(true)
    
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders/place`,
      {
        paymentMethod:"COD",
        shippingAddress:formData,
      },
      { withCredentials:true }
    );

    toast.success("Order placed successfully!");
    navigate(`/track/${data.orderId}`);

    } catch (error) {
      toast.error("Failed to place order!")
      console.error("ORDER ERROR ", error.response?.data || error.message);
    } finally {
      setProcessing(false);
    }
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
          try {
            await axios.post(
              `${import.meta.env.VITE_API_URL}/api/payment/verify`,
              response,
               {withCredentials: true },
            );

            const orderRes = await axios.post(
              `${import.meta.env.VITE_API_URL}/orders/place`,
              {
                paymentMethod: "RAZORPAY",
                paymentId: response.razorpay_payment_id,
                shippingAddress: formData,
              },
              { withCredentials: true }     
            );
            
            toast.success("Payment successful!");
            navigate(`/track/${orderRes.data.orderId}`);
          } catch {
            toast.error("Order creation failed!")
          }
        },

        prefill: {
          name: formData.fullName,
          contact: formData.phoneNumber,
        },
        theme: { color: "#e8c22b" },
      };

      new window.Razorpay(options).open();
    
    } catch (err) {

      toast.error("Payment failed!");
    } finally {
      setProcessing(false);
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = (e) => {

    e.preventDefault();
    if (!validateForm()) return;

    if (formData.paymentMethod === "COD") handleCOD();
    else handleRazorpay();
  };

  /* ================= UI ================= */

  return (
  <div className="payment-page">
    <div className="payment-container">
      <form onSubmit={handleSubmit} className="payment-grid">
        <div className="payment-card">
          <h2 className="section-title">Shipping Address</h2>

          {["fullName", "phoneNumber", "addressLine", "city", "zipCode"].map(
            (f) => (
              <input
                key={f}
                name={f}
                placeholder={f.replace(/([A-Z])/g, " $1")}
                onChange={handleChange}
                className="input-field"
              />
            )
          )}

          <h2 className="section-title mt">Payment Method</h2>

          <label className="radio-box">
            <input
              type="radio"
              name="paymentMethod"
              value="COD"
              checked={formData.paymentMethod === "COD"}
              onChange={handleChange}
            />
            Cash on Delivery
          </label>

          <label className="radio-box">
            <input
              type="radio"
              name="paymentMethod"
              value="RAZORPAY"
              checked={formData.paymentMethod === "RAZORPAY"}
              onChange={handleChange}
            />
            Online Payment (UPI / Card / Netbanking)
          </label>

         
        </div>

       
        <div className="summary-card">
          <h3 className="summary-title">Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>₹{shippingCharge}</span>
          </div>

          <div className="summary-row">
            <span>Tax (3%)</span>
            <span>₹{tax}</span>
          </div>

          <hr />

          <div className="summary-total">
            <span>Total</span>
            <span>₹{grandTotal}</span>
          </div>
           <button
            disabled={processing}
            className="place-order-btn"
          >
            {processing ? (
              <span className="processing">
                <Loader className="spin" /> Processing
              </span>
            ) : (
              <span className="place-text">
                <Lock size={18} /> Place Order
              </span>
            )}
          </button>
        </div>

      </form>
    </div>
  </div>
);

}

export default Payment;
