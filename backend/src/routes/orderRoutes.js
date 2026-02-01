const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
    placeOrder,
    getMyOrders,
    getSingleOrder
} = require("../controllers/orderController");



router.get("/my-orders",authMiddleware, getMyOrders);
router.post("/", authMiddleware, placeOrder);

router.get("/:orderId", authMiddleware, getSingleOrder);

module.exports = router;
