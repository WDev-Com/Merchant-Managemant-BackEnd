const Merchant = require("../Model/MerchantModel");
const Bids = require("../Model/AssetModel");
const MyBidModel = require("../Model/MyBidModel");
const mongoose = require("mongoose");
// Add a new merchant to the database ##DONE
exports.addNewMerchant = async (req, res) => {
  try {
    const { username, email } = req.body;

    // Check if a merchant with the same username or email already exists
    const existingMerchant = await Merchant.findOne({
      $or: [{ username }, { email }],
    });

    if (existingMerchant) {
      return res.status(400).json({
        error: "Username or Email already exists",
      });
    }

    const newMerchant = new Merchant(req.body);
    await newMerchant.save();
    console.log("Line No 11 : Merchant Save Successfully : ", newMerchant._id);
    res
      .status(201)
      .json({ message: "Merchant added successfully", newMerchant });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error:
        "Internal Server Error. Please input valid data as per instructions.",
    });
  }
};
// Add a new bid (asset) to the database ##DONE
exports.addNewBid = async (req, res) => {
  try {
    const bidData = req.body;

    const newBid = new Bids(bidData);
    await newBid.save();
    console.log("Line no 28 Bids Save Successfully : ", newBid._id);
    res.status(201).json({ message: "Bid added successfully", newBid });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error adding bid Input as instruction" });
  }
};

// Remove a merchant by ID ##DONE
exports.removeMerchant = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Merchant ID" });
    }

    const deletedMerchant = await Merchant.findByIdAndDelete(id);
    if (!deletedMerchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }
    console.log("Line no 48 Removed Successfully : ", deletedMerchant._id);
    res.status(200).json({ message: "Merchant removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing merchant", error });
  }
};

// Remove a bid from the database by ID ##DONE
exports.removeBidFromDB = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Bid ID" });
    }

    const deletedBid = await Bids.findByIdAndDelete(id);
    if (!deletedBid) {
      return res.status(404).json({ message: "Bid not found" });
    }
    console.log("Line No 68 Bid removed successfully", deletedBid._id);
    res.status(200).json({ message: "Bid removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing bid", error });
  }
};

// Update a merchant by ID ##DONE
exports.updateMerchant = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    console.log(id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Merchant ID" });
    }

    const updatedMerchant = await Merchant.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedMerchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }
    console.log(
      "Line No 91 Merchant Updated Successfully",
      updatedMerchant._id
    );
    res
      .status(200)
      .json({ message: "Merchant updated successfully", updatedMerchant });
  } catch (error) {
    res.status(500).json({ message: "Error updating merchant", error });
  }
};

// Update a bid by ID
exports.updateBid = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Bid ID" });
    }

    const updatedBid = await Bids.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedBid) {
      return res.status(404).json({ message: "Bid not found" });
    }
    console.log("Line No 121 Bid Updated successfully", updatedBid._id);
    res.status(200).json({ message: "Bid updated successfully", updatedBid });
  } catch (error) {
    res.status(500).json({ message: "Error updating bid", error });
  }
};

// Get a paginated list of merchants ##DONE
exports.getMerchantByPage = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    // console.log("Page: ", page, "Limit: ", limit); // Log for debugging
    // Count total number of merchants
    const totalCount = await Merchant.countDocuments();
    const merchants = await Merchant.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    console.log(totalCount);
    res.set("X-Total-Merchant-Count", totalCount);

    res.status(200).json(merchants);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Error retrieving merchants", error });
  }
};

// Get a specific merchant by ID ##DONE
exports.getMerchantById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Merchant ID" });
    }

    const merchant = await Merchant.findById(id);
    if (!merchant) {
      return res.status(404).json({ message: "Merchant not found" });
    }

    res.status(200).json(merchant);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving merchant", error });
  }
};

// Get a specific bid by ID
exports.getBidsById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Bid ID" });
    }

    const bid = await Bids.findById(id);
    if (!bid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    res.status(200).json(bid);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving bid", error });
  }
};

// Get all bids ##DONE
exports.getAllBids = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const totalCount = await Merchant.countDocuments();

    const merchants = await Bids.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.set("X-Total-Bids-Count", totalCount);
    res.status(200).json(merchants);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving bids", error });
  }
};

// Update the status of a bid by ID It is done in
// Merchant Bids DataBase ***********************
exports.updateBidStatus = async (req, res) => {
  try {
    const { merchantId, bidId, status } = req.query;

    // Validate that all required fields are provided
    if (!merchantId || !bidId || !status) {
      return res
        .status(400)
        .json({ message: "Merchant ID, Bid ID, and status are required" });
    }

    // Validate that the Bid ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(bidId)) {
      return res.status(400).json({ message: "Invalid Bid ID" });
    }

    // Find and update the bid by both merchantId and bidId
    const updatedBid = await MyBidModel.findOneAndUpdate(
      { merchantId, bidId }, // Find bid by merchantId and bidId
      { status }, // Update the status
      { new: true } // Return the updated document
    );

    // If no bid is found, return a 404 error
    if (!updatedBid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    // Respond with the updated bid
    res.status(200).json({
      message: "Bid status updated successfully",
      updatedBid,
    });
  } catch (error) {
    // Handle any server-side errors
    res.status(500).json({ error: "Error updating bid status" });
  }
};
