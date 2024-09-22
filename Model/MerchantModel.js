const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const merchantSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  username: {
    required: true,
    type: String,
  },
  category: {
    required: true,
    type: String,
    enum: [
      "Inventory Management",
      "Financial Assets",
      "Property",
      "Digital Assets",
      "Vendor and Supplier",
    ],
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },

  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v); // Regex to validate exactly 10 digits
      },
      message: (props) =>
        `${props.value} is not a valid phone number! It must be exactly 10 digits.`,
    },
  },
  address: {
    required: true,
    type: String,
  },

  profileImg: {
    type: String,
    required: true,
  },
});

let Merchant = mongoose.model("Merchant", merchantSchema);

module.exports = Merchant;
