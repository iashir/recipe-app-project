// Load input validation
const validateLoginInput = require("../validation/login");
const validateRegisterInput = require("../validation/register");
const validateRecipe = require("../validation/addRecipe");

module.exports = {
  loginValidator: function (req, res, next) {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    next();
  },
  registerValidator: function (req, res, next) {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    next();
  },

  recipeValidator: function (body) {
    // Form validation
    const { errors, isValid } = validateRecipe(body);
    // Check validation
    if (!isValid) {
      return errors;
    }
  },
};
