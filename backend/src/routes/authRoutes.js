const router = require("express").Router();
const {
  registerUser,
  loginUser
} = require("../controllers/authController");
const { adminLogin } = require("../controllers/authController")

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin/login", adminLogin);

router.get("/", (req, res) => {
  res.send("Auth route working");
});

module.exports = router;
