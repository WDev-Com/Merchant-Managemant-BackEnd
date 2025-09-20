const { console } = require("inspector");
const Merchant = require("../Model/MerchantModel");
const MyBidModel = require("../Model/MyBidModel");
const mongoose = require("mongoose");

// Fetch all bids for a merchant
exports.getMyAllBids = async (req, res) => {
  try {
    const { merchantId } = req.query;
    if (!mongoose.Types.ObjectId.isValid(merchantId)) {
      return res.status(400).json({ message: "Invalid Merchant ID" });
    }

    const bids = await MyBidModel.find({ merchantId }).lean();
    if (!bids.length) {
      return res.status(404).json({ message: "No bids found" });
    }

    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving bids", error });
  }
};

// Fetch the profile of a merchant
exports.getProfile = async (req, res) => {
  try {
    const { merchantId } = req.query;
    if (!mongoose.Types.ObjectId.isValid(merchantId)) {
      return res.status(400).json({ message: "Invalid Merchant ID" });
    }

    const merchant = await Merchant.findById(merchantId).lean();
    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    res.status(200).json(merchant);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving profile", error });
  }
};

// Confirm a bid by updating its status
exports.confirmBid = async (req, res) => {
  console.log("Entering confirmBid function");

  try {
    // Extracting data from the request body
    const {
      merchantId,
      bidId,
      assetType,
      yearlyReturn,
      holdingPeriod,
      ask,
      bid,
      assetName,
    } = req.body;

    // Log the incoming data for debugging
    console.log("Received data:", req.body);

    // Check for existing bid
    const existingBid = await MyBidModel.findOne({ merchantId, bidId });
    if (existingBid) {
      console.log("Bid with this merchantId and bidId already exists");
      return res
        .status(400)
        .json({ error: "Bid with this merchantId and bidId already exists" });
    }

    // Validate required fields
    if (
      !merchantId ||
      !bidId ||
      !assetType ||
      yearlyReturn == null ||
      holdingPeriod == null ||
      ask == null ||
      !bid ||
      !assetName
    ) {
      console.log("All fields are required");
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new bid entry
    const newBid = new MyBidModel({
      merchantId,
      assetName,
      bidId,
      assetType,
      yearlyReturn,
      holdingPeriod,
      ask,
      bid,
    });

    // Save the new bid document in the database
    await newBid.save();
    console.log("Bid Confirmed and stored successfully");

    // Respond with success message
    return res.status(201).json({
      message: "Bid confirmed and stored successfully",
      newBid,
    });
  } catch (error) {
    console.error("Error occurred while confirming bid:", error);
    return res.status(500).json({ error: "Internal Server Error", error });
  }
};

// Fetch merchant by username
exports.getMerchantByUserName = async (req, res) => {
  try {
    const { username } = req.query;
    const merchant = await Merchant.findOne({ username }).lean();

    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    res.status(200).json(merchant);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving merchant", error });
  }
};

// Delete a merchant's bid
exports.deleteMerchantBid = async (req, res) => {
  try {
    const { merchantId, bidId } = req.query;

    // validate that both IDs are provided
    if (!merchantId || !bidId) {
      return res
        .status(400)
        .json({ message: "Merchant ID and Bid ID are required" });
    }

    // validate that the Bid ID is a valid ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(bidId) &&
      !mongoose.Types.ObjectId.isValid(merchantId)
    ) {
      return res.status(400).json({ message: "Invalid Bid ID Or Merchant ID" });
    }

    // find the bid with the matching merchantId and bidId and delete it
    const bid = await MyBidModel.findOneAndDelete({ merchantId, bidId }).lean();

    // if no bid is found, return an error
    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    // respond with success message if the bid is deleted
    res.status(200).json({ message: "Bid deleted successfully" });
  } catch (error) {
    // handle any server errors
    res.status(500).json({ message: "Error deleting bid", error });
  }
};
