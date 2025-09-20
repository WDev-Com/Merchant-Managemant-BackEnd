const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();
const db = require("./DataBase/db");
const cors = require("cors");
const env = require("dotenv");
// importing all routes
const Auth = require("./Router/authRouter");
const Merchant = require("./Router/merchantRouter");
const Admin = require("./Router/adminRouter");
const { jwtAuthMiddleware, checkUserRole } = require("./JWT/jwt");
app.use(
  cors({
    origin: "*",
    exposedHeaders: ["X-Total-Merchant-Count", "X-Total-Bids-Count"],
  })
);
app.use(bodyParser.json());
/* Problem in Role Authentication 20-09-2025 */
app.use("/auth", Auth);
app.use("/merchant", jwtAuthMiddleware, Merchant);
app.use("/admin", jwtAuthMiddleware, Admin);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is listening on port no ${port}`);
});
