const express = require("express");
const router = express.Router();
const adminAuth = require("../middlewares/adminMiddleware");

router.get("/dashboard", adminAuth, (req, res) => {
    res.json({ message: "Welcome admin"});
});
module.exports = router;