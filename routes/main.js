const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");
//@desc Login/Landing page
//@route GET /

router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    res.send(recipes);
  } catch (error) {
    console.log(error);
  }
});

//@desc Resipes of single user
//@route GET /myrecipes/:id

router.get("/myrecipes/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const recipes = await Recipe.find({ user: req.params.id }).lean();
    if (!recipes) {
      return res.json({ erros: "NO RECIPES YET" });
    }
    res.json(recipes);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
