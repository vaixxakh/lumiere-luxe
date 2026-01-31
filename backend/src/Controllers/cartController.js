const Cart = require("../models/Cart");


exports.addToCart = async (req, res ) => {
    try {

        const userId = req.user.id;
        const { productId, quantity = 1 } =req.body;
        
        let item = await Cart.findOne({ userId, productId })
        
        if(item){
            item.quantity += Number(quantity);
            await item.save();
        }else {
            await Cart.create({
                 userId, 
                 productId, 
                 quantity:Number(quantity),
             });
        }
    
        const cart = await Cart.find({ userId })
        .populate("productId")
        .sort({ createdAt: -1 })
        
    res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Add to cart failed" })
    }
};

exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.find({ userId: req.user.id })
        .populate("productId")
        .sort({ createedAt: -1 });

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message : "Fetch cart failed"})
    }
};

exports.removeFromCart = async (req, res) => {
    try {
       
        const { productId } = req.params;

        await Cart.deleteOne({ 
            userId: req.user.id, 
            productId
         });
      
        const cart = await Cart.find({ 
            userId: req.user.id
         })
         .populate("productId");

        res.json(cart);

    } catch (error){
        res.status(500).json({ message: "Remove  cart failed "})
    }
};

exports.clearCart = async (req, res) => {
    try {
        await Cart.deleteMany({ userId: req.user.id });
        res.json([]);
    } catch (error) {
        res.status(500).json({ message: "Failed clear cart"})
    }
};
exports.updateCartQty = async (req, res) => {
    try {
        
        const { quantity } = req.body;
        const { productId } = req.params;
      
        await Cart.findOneAndUpdate(
            { userId: req.user.id, productId },
            { quantity: Number(quantity)},
            { new: true }
        );
      
        const cart = await Cart.find({ userId: req.user.id })
        .populate("productId");

        res.json(cart);
    } catch (error ) {
        res.status(500).json({  message: "Update quantity failed" })
    }
};


