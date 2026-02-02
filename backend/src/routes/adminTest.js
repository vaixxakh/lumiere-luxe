const express = require("express");
const router = express.Router();
const { adminOnly } = require("../middlewares/authMiddleware");


router.get("/dashboard", adminOnly, (req, res) => {
    res.json({ message: "Welcome admin"});
});
module.exports = router;