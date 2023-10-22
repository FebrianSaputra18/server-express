const mongoose = require("mongoose");
const { dbUser, dbPass } = require("../app/config");
require("dotenv").config();

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: "admin",
  user: dbUser,
  pass: dbPass
});

const db = mongoose.connection;

module.exports = db;
