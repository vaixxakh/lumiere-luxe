const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

      name: {
    type: String,
    trim: true,
  },

  email: {
    type: String,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
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
;

module.exports = mongoose.model("User", userSchema);
