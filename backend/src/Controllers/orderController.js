const Order = require("../models/Order");
const Cart = require("../models/Cart");

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const { paymentMethod = "COD", paymentId } = req.body;

    const cartItems = await Cart.find({ userId }).populate("productId");

    if (!cartItems.length) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const items = cartItems.map(item => ({
      productId: item.productId._id,
      productName: item.productId.name,
      price: item.productId.price, 
      quantity: item.quantity,
    }));

    const subtotal = items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    const shipping = 100;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;

    const order = new Order({
      userId,
      items,
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod,
      paymentId: paymentId || "COD",
      status: "Processing",
    });

    await order.save();
    await Cart.deleteMany({ userId });

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
