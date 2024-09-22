const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const myBidSchema = new mongoose.Schema({
  merchantId: {
    required: true,
    type: String,
  },
  bidId: {
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
  bid: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "None",
  },
});
// Create a compound unique index for bidId and merchantId
myBidSchema.index({ bidId: 1, merchantId: 1 }, { unique: true });
let MyBid = mongoose.model("MyBid", myBidSchema);

module.exports = MyBid;
