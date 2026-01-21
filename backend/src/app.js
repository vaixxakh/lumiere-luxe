    const express = require("express");
    const cors = require("cors");
    const orderRoutes = require("./routes/orderRoutes")

    const app = express();

    app.use(cors());
    app.use(express.json());


    app.use("/api/payment", require("./routes/paymentRoutes"));

    app.use("/api/products", require("./routes/productRoutes"));
    app.use("/api/auth", require("./routes/authRoutes"));
    app.use("/api/orders", orderRoutes)




    module.exports = app;   

