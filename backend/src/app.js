    const express = require("express");
    const cors = require("cors");
    const cookieParser = require("cookie-parser");
    

    const orderRoutes = require("./routes/orderRoutes");
    const paymentRoutes = require("./routes/paymentRoutes");
    const productRoutes = require("./routes/productRoutes");
    const authRoutes = require("./routes/authRoutes");
    const cartRoutes = require("./routes/cartRoutes");


    const adminRoutes = require("./routes/adminRoutes");


    const app = express();
    
    
    app.use(cors({
        origin:"http://localhost:5173",
        credentials:true
    }));

    app.use(express.json());

    app.use(cookieParser());
    
    app.use("/api/admin", adminRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/admin", require("./routes/adminTest"));


    app.use("/api/cart", cartRoutes);
    app.use("/api/payment", require("./routes/paymentRoutes"));
    app.use("/api/products", require("./routes/productRoutes"));
    app.use("/api/auth", require("./routes/authRoutes"));
    app.use("/api/orders", orderRoutes)


    module.exports = app;   

