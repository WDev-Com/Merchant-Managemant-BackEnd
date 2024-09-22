const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { type } = require("os");

const authSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Pre-save hook for hashing the password before saving it
authSchema.pre("save", async function (next) {
  const person = this;
  if (!person.isModified("password")) {
    return next();
  }
  try {
    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    person.password = await bcrypt.hash(person.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

// Method to compare the provided password with the stored hashed password
authSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw err;
  }
};

const User = mongoose.model("User", authSchema);
module.exports = User;
