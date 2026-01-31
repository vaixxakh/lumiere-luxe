const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

      name: {
    type: String,
    trim: true,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    index: true,
  },

  password: {
    type: String,
    required: true,
    select:false,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },

  blocked: {
    type: Boolean,
    default: false,
  },

  profileImg: {
    type: String,
    default: "",
  },

  profileThumbImg: {
    type: String,
    default: "",
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });


module.exports = mongoose.model("User", userSchema);
