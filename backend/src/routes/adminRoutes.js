const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {adminLogin} = require("../controllers/authController")
const { getAllOrdersForAdmin, updateOrderStatus } = require("../controllers/adminOrderController");


const { getDashboardStats } = require("../controllers/adminDashboardController");

const {
    addProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
} = require("../controllers/adminProductController");

router.use(protect);
router.use(adminOnly);

router.get("/dashboard", getDashboardStats)
router.get("/orders", getAllOrdersForAdmin);
router.patch("/orders/:id/status", updateOrderStatus);
router.post("/login", adminLogin);

router.post("/product", addProduct);
router.get("/products", getAllProducts);
router.put("/product/:id",  updateProduct);
router.delete("/product/:id", deleteProduct);



module.exports = router;