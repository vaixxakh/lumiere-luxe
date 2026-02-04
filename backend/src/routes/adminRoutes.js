const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { getAllOrdersForAdmin, updateOrderStatus } = require("../controllers/adminOrderController");


const { getDashboardStats } = require("../controllers/adminDashboardController");

const {
    addProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
} = require("../controllers/adminProductController");

const {
    getAllUsers,
    blockUser,
    unblockUser,
    
} =require("../controllers/adminUserController");

router.use(protect);
router.use(adminOnly);

router.get("/dashboard", getDashboardStats)

router.get("/orders", getAllOrdersForAdmin);
router.patch("/orders/:id/status", updateOrderStatus);

router.get("/users", getAllUsers);
router.get("/users/block/:id", blockUser);
router.get("/users/unblock/:id", unblockUser);





router.post("/product", addProduct);
router.get("/products", getAllProducts);
router.put("/product/:id",  updateProduct);
router.delete("/product/:id", deleteProduct);



module.exports = router;