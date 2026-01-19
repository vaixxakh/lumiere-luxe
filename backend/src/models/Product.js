const mongoose = require("mongoose");

const productSchema =  new mongoose.Schema({
    name:String,
    price:Number,
    image:String,
    description:String,
    category:String,
    reviews: {
        type: Number,
        default: 4.5
  }
},
{timestamps:true}
);

module.exports = mongoose.model("Product", productSchema);
