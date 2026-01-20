const mongoose = require("mongoose");

const productSchema =  new mongoose.Schema({
   name: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  image: {
    type: String,
  },

  description: {
    type: String,
  },

  category: {
    type: String,
    required: true,
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
