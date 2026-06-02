const router = require("express").Router();

const { getProducts, getProductById } = require("../controllers/productController");
const { protect } = require("../middlewares/authMiddleware");



router.get("/",getProducts);
router.get("/:id",getProductById);

router.post("/add",protect, (req, res ) => {
    res.json({
        message: "This route is protected",
        user: req.user
    });
});

module.exports = router;




