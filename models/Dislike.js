const mongoose = require("mongoose");

const Dislike = new mongoose.Schema(
  {
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dislike", Dislike);
