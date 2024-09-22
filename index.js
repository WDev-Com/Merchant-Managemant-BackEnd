const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();
const db = require("./DataBase/db");

// importing all routes
const Auth = require("./Router/authRouter");
const Merchant = require("./Router/merchantRouter");
const Admin = require("./Router/adminRouter");

app.use(bodyParser.json());

app.use("/auth", Auth);
app.use("/merchant", Merchant);
app.use("/admin", Admin);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is listening on port no ${port}`);
});
