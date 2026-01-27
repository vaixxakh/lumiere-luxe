const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const {
  addToCart,
  getCart,
  updateCartQty,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

router.post("/add", auth, addToCart);
router.get("/", auth, getCart);
router.put("/:id", auth, updateCartQty);
router.delete("/:id", auth, removeFromCart);
router.delete("/", auth, clearCart);



module.exports = router;
