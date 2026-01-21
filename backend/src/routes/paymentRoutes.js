const express = require("express");
const router = express.Router();
const razorpay = require("../config/razorpay");
const crypto = require("crypto");

router.post("/create-order", async (req, res ) => {
    try{
        const { amount } = req.body;

        const order = await razorpay.orders.create({
            amount: amount * 100 ,
            currency:"INR",
            receipt: "lumiere_order_" + Date.now()
        });
        res.status(200).json(order)
    } catch (err) {
        res.status(500).json({ message: "Order creation failed"});
    }
});

router.post("/verify-payment", (req, res ) => {
    const {
         razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    } = req.body;

    const body = 
    razorpay_order_id + "|" + razorpay_payment_id

     const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
});

module.exports = router;