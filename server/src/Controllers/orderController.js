const Order = require("../models/Order");
const Cart = require("../models/Cart");

exports.placeOrder = async (req, res) => {
  
  try {
   
    const userId = req.user.id;
    
    const { paymentMethod = "COD", paymentId, shippingAddress } = req.body;

    const cartItems = await Cart.find({ userId }).populate("productId");

    if(!shippingAddress || !shippingAddress.fullName || !shippingAddress.phoneNumber  ){
      return res.status(400).json({ message: "Shipping address is required"})
    }

    if( !cartItems || !cartItems.length) {
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

    const shippingCharge = 50;
    const tax = Math.round(subtotal * 0.03);
    const total = subtotal + shippingCharge + tax;

    const orderId = "ORD-" + Date.now();

    const order = new Order({
      orderId,
      userId,
      items,
      subtotal,
      shipping,
      shippingAddress,
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
      orderId: order.orderId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err });
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
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: "Error updating status", error: err });
  }
};