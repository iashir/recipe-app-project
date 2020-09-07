const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");
const Categories = require("../models/categories");
const { response } = require("express");
//@desc Login/Landing page
//@route GET /api/admin/recipes

router.get("/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    res.send(recipes);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
