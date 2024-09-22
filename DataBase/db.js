const mongoose = require("mongoose");

const mongoURL = process.env.MONGO_URL;

mongoose.connect(mongoURL); // No need for useNewUrlParser and useUnifiedTopology

const db = mongoose.connection;

// Event Listeners
db.on("connected", () => {
  console.log("Connected to MongoDB server");
});

db.on("error", (err) => {
  console.error("MongoDB Connection Error: ", err);
});

db.on("disconnected", () => {
  console.log("MongoDB Disconnected");
});

// Export the database connection
module.exports = db;
