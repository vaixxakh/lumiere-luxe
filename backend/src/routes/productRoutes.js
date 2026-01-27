const router = require("express").Router();
const { getProducts, getProductById } = require("../controllers/productController");
const auth = require("../middlewares/authMiddleware");


router.get("/",getProducts);
router.get("/:id",getProductById);

router.post("/add",auth, (req, res ) => {
    res.json({
        message: "This route is protected",
        user: req.user
    });
});

module.exports = router;




