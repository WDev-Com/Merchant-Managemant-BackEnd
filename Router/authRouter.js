const express = require("express");
const router = express.Router();
const {
  login,
  signup,
  updateCredential,
  logout,
} = require("../Controller/authController");

router
  .post("/login", login)
  .post("/signup", signup)
  .patch("/update/:id", updateCredential)
  .get("/logout", logout);

module.exports = router;
