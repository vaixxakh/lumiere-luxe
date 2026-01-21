const Order = require("../models/Order");
const Cart = require("../models/Cart");

exports.placeOrder = async (req, res ) => {
    try {
        const userId = req.user.id;

        const cartItems = await Cart.find({ userId }).populate("productId"); 

        if( cartItems.length === 0 ){
            return res.status(400).json({ message: "Your Cart is Empty"})
        } 

        const products = cartItems.map(item => ({
            productId: item.productId._id,
            quantity : item.quantity
        }));
        
        const totalPrice = cartItems.reduce(
            (sum, item ) => sum + item.productId.price * item.quantity,
            0
        );
        const order = new Order({
            userId,
            products,
            totalPrice,
            totalItems: cartItems.length,
            paymentId: req.body.paymentId || "COD"
        });

        await order.save();

        await Cart.deleteMany({ userId});

        res.status(201).json({ message: "Order placed successfully",
            order
        })
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

exports.getMyOrders = async (req, res ) => {
    try {
        const orders = await Order.find({ userId: req.user.id })
        .populate("products.productId")
        .sort({ createdAt: -1 });

        res.json(orders);
    } catch ( error) {
        res.status(500).json({ message: error.message});
    }
};

