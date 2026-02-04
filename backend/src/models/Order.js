const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  customerName: String,
  email: String,
  phone: String,
  items: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      productName: String,
      price: Number,
      quantity: Number,
    }
  ],
  shippingAddress: String,
  paymentMethod: String,
  paymentId: String, 
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered"],
    default: "Pending",
  },
  subtotal: Number,
  tax: Number,
  shipping: Number,
  total: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
