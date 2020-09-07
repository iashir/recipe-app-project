const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "public",
    enum: ["public", "private"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  recipeImageName: { type: String, required: false },
  recipeImageLocation: { type: String, required: false },
});

module.exports = mongoose.model("Recipe", RecipeSchema);
