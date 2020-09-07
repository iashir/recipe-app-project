const express = require("express");
const router = express.Router();
const Categories = require("../models/categories");

//@desc categories component
//@route get /api/categories

router.get("/", async (req, res) => {
  try {
    const categories = await Categories.find().lean();
    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
  }
});

//@desc categories component
//@route post /api/categories
router.post("/", async (req, res) => {
  try {
    await Categories.create(req.body);
    res.status(200).send("success");
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
