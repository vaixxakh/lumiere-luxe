const Cart = require("../models/Cart");
const mongoose = require("mongoose");

const isValidId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

exports.addToCart = async (req, res ) => {
    try {

        const userId = req.user.id;
        const { productId, quantity = 1 } =req.body;

        if (!productId) {
        return res.status(400).json({ message: "productId is required" });
        }
         if (!isValidId(productId)) {
          return res.status(400).json({ message: "Invalid productId" });
         }

        
        const qty = Number(quantity);
        
        if(Number.isNaN(qty) || qty <= 0) {
            return res.status(400).json({ message: "Quantity must be at least 1" });
        }
           await Cart.findOneAndUpdate(
            { userId, productId },
            { $inc: { quantity: qty } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        
        const cart = await Cart.find({ userId })
        .populate("productId")
        .sort({ createdAt: -1 })
        
    res.json({ cart });
    } catch (error) {
        console.error("ADD TO CART ERROR:", error);
        res.status(500).json({ message: "Add to cart failed" })
    }
};

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.find({ userId: req.user.id })
        .populate("productId")
        .sort({ createdAt: -1 });

        res.json({ cart });
    } catch (error) {
        res.status(500).json({ message : "Fetch cart failed"})
    }
};

exports.removeFromCart = async (req, res) => {
    try {
       
        const { productId } = req.params;

        if (!isValidId(productId)) {
          return res.status(400).json({ message: "Invalid productId" });
        }

        const result = await Cart.deleteOne({
        userId: req.user.id,
        productId,
        });

         if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Item not found in cart" });
     }
 
        const cart = await Cart.find({ 
            userId: req.user.id
         })
         .populate("productId")
         .sort({ createdAt: -1 })


        res.json({ cart });

    } catch (error){
        res.status(500).json({ message: "Remove  cart failed "})
    }
};

exports.clearCart = async (req, res) => {
    try {
        await Cart.deleteMany({ userId: req.user.id });
       res.json({ cart: [] });
    } catch (error) {
        res.status(500).json({ message: "Failed clear cart"})
    }
};
exports.updateCartQty = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (!isValidId(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }


    const qty = Number(quantity);

    if (Number.isNaN(qty) ) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    if (qty === 0) {
      await Cart.deleteOne({
        userId: req.user.id,
        productId,
      });
    } else {
      await Cart.findOneAndUpdate(
        { userId: req.user.id, productId },
        { quantity: qty },
        { new: true }
      );
    }

    const cart = await Cart.find({ userId: req.user.id })
      .populate("productId")
      .sort({ createdAt: -1 })


    res.json({ cart });
  } catch (error) {
    console.error("UPDATE QTY ERROR:", error);
    res.status(500).json({ message: "Update quantity failed" });
  }
};


