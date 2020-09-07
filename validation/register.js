const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.username = !isEmpty(data.username) ? data.username : "";
  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
  const passwordRegEx = new RegExp(
    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$"
  );
  // UserName checks
  if (Validator.isEmpty(data.username)) {
    errors.username = "Username field is required";
  }
  if (!Validator.isLength(data.username, { min: 3, max: 15 })) {
    errors.username =
      "Username must be more than 3 and less than 15 characters";
  }

  // firstName checks
  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = "First Name field is required";
  }
  if (!Validator.isAlpha(Validator.blacklist(data.firstName, " "))) {
    errors.firstName = "First Name must be letters only";
  }
  // lastName checks
  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = "Last Name field is required";
  }
  if (!Validator.isAlpha(Validator.blacklist(data.lastName, " "))) {
    errors.lastName = "First Name must be letters only";
  }
  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  // Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password =
      "Password must be at least 6 and no more than 30 characters";
  } else if (!passwordRegEx.test(data.password)) {
    errors.password =
      "Password must contain at least 1 uppercase, 1 lowercase, 1 numeric and 1 special character";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field is required";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
