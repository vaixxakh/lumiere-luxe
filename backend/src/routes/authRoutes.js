const router = require("express").Router();
const {
  registerUser,
  loginUser
} = require("../Controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/", (req, res) => {
  res.send("Auth route working");
});

module.exports = router;
