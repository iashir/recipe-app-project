const mongoose = require("mongoose");

const Subscribe = new mongoose.Schema(
  {
    userTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userFrom: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscribe", Subscribe);
