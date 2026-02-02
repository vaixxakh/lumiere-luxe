const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");

const {
  addToCart,
  getCart,
  updateCartQty,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.put("/:productId", protect, updateCartQty);
router.delete("/:productId", protect, removeFromCart);
router.delete("/", protect, clearCart);



module.exports = router;
