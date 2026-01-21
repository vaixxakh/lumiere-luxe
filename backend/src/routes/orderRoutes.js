const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");


const {
    placeOrder,
    getMyOrders,
} = require("../Controllers/orderController");


router.post("/place", authMiddleware, placeOrder);

router.get("/my-orders",authMiddleware, getMyOrders);

module.exports = router;
