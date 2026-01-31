const mongoose = require("mongoose");

const productSchema =  new mongoose.Schema({
   name: {
    type: String,
    required: true,
    trim: true,
  },

  price: {
    type: Number,
    required: true,
  },

  image: {
    type: String,
    default: "", 
  },

  description: {
    type: String,
    trim: true, 
  },

  category: {
    type: String,
    required: true,
    index: true,
  },
  rating: {
    type: Number,
    default:4.5,
  },
  stock: {
    type: Number,
    default:1,

  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default:"active",
  },
  reviews: {
    type: Number,
    default: 4.5,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });


module.exports = mongoose.model("Product", productSchema);
