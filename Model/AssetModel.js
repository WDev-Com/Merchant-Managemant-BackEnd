const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const assetSchema = new mongoose.Schema({
  assetName: {
    required: true,
    type: String,
  },
  assetType: {
    required: true,
    type: String,
    enum: [
      "Raw Materials Stock",
      "Investment Portfolio",
      "Real Estate",
      "Digital Holdings",
      "Supplier Contracts",
    ],
  },
  yearlyReturn: {
    type: Number,
    required: true,
  },
  holdingPeriod: {
    type: Number,
    required: true,
  },
  ask: {
    type: Number,
    required: true,
  },
});

let Asset = mongoose.model("Asset", assetSchema);

module.exports = Asset;
