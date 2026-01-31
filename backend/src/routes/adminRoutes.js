const express = require("express");
const router = express.Router();
const adminAuth = require("../middlewares/adminMiddleware");

const {
    addProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
} = require("../controllers/adminProductController");

router.post("/product", adminAuth, addProduct);
router.get("/products", adminAuth, getAllProducts);
router.put("/product/:id", adminAuth, updateProduct);
router.delete("/product/:id", adminAuth, deleteProduct);

module.exports = router;