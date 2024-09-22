const express = require("express");
const router = express.Router();
const {
  addNewMerchant,
  addNewBid,
  removeMerchant,
  removeBidFromDB,
  updateMerchant,
  updateBid,
  getMerchantById,
  getAllBids,
  getBidsById,
  updateBidStatus,
  getMerchantByPage,
} = require("../Controller/adminController");
const { Console } = require("console");

router
  .post("/addMerchant", addNewMerchant)
  .post("/addNewBid", addNewBid)
  .delete("/removeMercant/:id", removeMerchant)
  .delete("/removeBid/:id", removeBidFromDB)
  .patch("/updateMerchant/:id", updateMerchant)
  .patch("/updateBid/:id", updateBid)
  // For the merchant status
  .patch("/updateBidStatus", updateBidStatus)
  .get("/getMerchantById/:id", getMerchantById)
  .get("/getAllMerchant", getMerchantByPage)
  .get("/getAllBids", getAllBids)
  .get("/getBidById/:id", getBidsById);

module.exports = router;
