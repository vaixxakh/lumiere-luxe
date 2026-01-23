    const express = require("express");
    const cors = require("cors");
    const orderRoutes = require("./routes/orderRoutes")
    
    const app = express();
    
    const cookieParser = require("cookie-parser");
    app.use(cookieParser());


    app.use(cors({
        origin:"http://localhost:5173",
        credentials:true
    }));
    
    app.use(express.json());

    app.use("/api/payment", require("./routes/paymentRoutes"));
    app.use("/api/products", require("./routes/productRoutes"));
    app.use("/api/auth", require("./routes/authRoutes"));
    app.use("/api/orders", orderRoutes)


    module.exports = app;   

