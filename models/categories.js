const mongoose = require("mongoose");

const Categories = new mongoose.Schema({
  type: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("Categories", Categories);
