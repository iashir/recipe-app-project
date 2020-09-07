const express = require("express");
const router = express.Router();
const { login, register, loginGoogle } = require("../controllers/auth");
const {
  registerValidator,
  loginValidator,
} = require("../middleware/validator");

// Load User model
const User = require("../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", registerValidator, register);

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", loginValidator, login);

// @route POST api/users/google-login
// @desc Login user and return JWT token
// @access Public
router.post("/google-login", loginGoogle);
router.get("/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (err) {
    return res.status("400").send("No such user");
  }
});
module.exports = router;
