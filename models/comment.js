const mongoose = require("mongoose");

const Comment = new mongoose.Schema(
  {
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    responseTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", Comment);
