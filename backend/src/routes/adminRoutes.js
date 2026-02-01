const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middlewares/adminMiddleware");

const { getDashboardSats } = require("../controller/adminDashboardController");

const {
    addProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
} = require("../controllers/adminProductController");

router.use(protect, adminOnly);

router.get("/dashboard", getDashboardSats)

router.post("/product", addProduct);
router.get("/products", getAllProducts);
router.put("/product/:id",  updateProduct);
router.delete("/product/:id", deleteProduct);


module.exports = router;