const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");


const {
    placeOrder,
    getMyOrders,
    getSingleOrder
} = require("../controllers/orderController");



router.get("/my-orders",protect, getMyOrders);
router.post("/", protect, placeOrder);

router.get("/:orderId", protect, getSingleOrder);

module.exports = router;
