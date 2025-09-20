const User = require("../Model/Auth");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { generateToken } = require("../JWT/jwt");
const Merchant = require("../Model/MerchantModel");

// Signup function to register a new user
exports.signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username exists in the Merchant database
    const existingMerchant = await Merchant.findOne({ username });
    if (!existingMerchant) {
      return res.status(403).json({ error: "You are unauthorized user" });
    }

    // Check if the user already exists in the User database
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create a new user
    const newUser = new User({
      username,
      password,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Generate JWT token
    const token = generateToken({
      id: savedUser.id,
      role: savedUser.role,
      username: savedUser.username,
    });

    console.log("Line No 33 SignUp Successfully:", savedUser.username);
    res.status(201).json({ message: "Signup successful", token });
  } catch (error) {
    console.log(error.message);
    console.log("Signup Error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login function to authenticate a user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Compare the password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      role: user.role,
      username: user.username,
    });
    console.log("Line No 64 Login SuccessFully : ", user.username);
    res.status(200).json({
      message: "Login successful",
      token,
      userInfo: { username: user.username, role: user.role },
    });
  } catch (error) {
    console.log("Login Error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update credentials (password) of the user
exports.updateCredential = async (req, res) => {
  try {
    const { password } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update password if provided
    if (password) {
      // Assigned the new password, the pre-save hook will hash it
      user.password = password;
    }

    const updatedUser = await user.save();
    console.log("Updated Successfully:", user.username);

    res.status(200).json({
      message: "Credentials updated successfully",
      username: updatedUser.username,
    });
  } catch (error) {
    console.log("Update Credential Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Logout function (clear the token on the client-side)
exports.logout = async (req, res) => {
  try {
    // Invalidate token or inform user that token should be discarded
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log("Logout Error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
