const express = require("express");
const router = express.Router();

const {
  getMyAllBids,
  getProfile,
  confirmBid,
  getMerchantByUserName,
  deleteMerchantBid,
} = require("../Controller/merchantController");

router
  .post("/confirmBid", confirmBid)
  //Get Bids By merchant ID
  .get("/getMyBids", getMyAllBids)
  //Get Bids By merchant ID
  .get("/getProfile", getProfile)
  // Delete Bid From My Bids Data Base as per merchant ID
  .delete("/deleteMerchantBid", deleteMerchantBid)
  .get("/getMerchantByUsername", getMerchantByUserName);

module.exports = router;
