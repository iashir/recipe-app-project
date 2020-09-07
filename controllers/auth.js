const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/jwtConfig");
const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  "1001864418858-9a5bkmgdeqmee2bk7di7oudhjkq2370s.apps.googleusercontent.com"
);

module.exports = {
  login: function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    // Find user by email
    User.findOne({ username }).then((user) => {
      // Check if user exists
      if (!user) {
        return res
          .status(400)
          .json({ usernotfound: "Invalid username or password" });
      }
      // Check password
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            _id: user.id,
          };
          // Sign token
          jwt.sign(
            payload,
            jwtSecret.secretOrKey,
            {
              expiresIn: "24h", // 1 year in seconds
            },
            (err, token) => {
              if (err) {
                console.log("JWT error: ", err);
              }
              const { _id, username, email, role } = user;
              res.json({
                user: { _id, username, email, role },
                token,
              });
            }
          );
        } else {
          return res
            .status(400)
            .json({ usernotfound: "Invalid username or password" });
        }
      });
    });
  },
  register: function (req, res) {
    User.findOne({ username: req.body.username }).then((user) => {
      if (user) {
        return res.status(400).json({ username: "Username already exists" });
      } else {
        const newUser = new User({
          username: req.body.username,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
        });
        // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) =>
                res.json({
                  successMessage: "Registration success. Please signin",
                })
              )
              .catch((err) => console.log(err));
          });
        });
      }
    });
  },
  loginGoogle: function (req, res) {
    const { tokenId } = req.body;
    console.log("test");
    client
      .verifyIdToken({
        idToken: tokenId,
        audience:
          "1001864418858-9a5bkmgdeqmee2bk7di7oudhjkq2370s.apps.googleusercontent.com",
      })
      .then((data) => {
        const { name, email, given_name, family_name, picture } = data.payload;

        // Find user by email
        User.findOne({ username: name }).then((user) => {
          // Check if user exists
          if (!user) {
            const newUser = new User({
              username: name,
              firstName: given_name,
              lastName: family_name,
              email: email,
              image: picture,
            });
            newUser
              .save()
              .then((user) => {
                const payload = {
                  _id: user.id,
                };
                jwt.sign(
                  payload,
                  jwtSecret.secretOrKey,
                  {
                    expiresIn: "24h", // 1 year in seconds
                  },
                  (err, token) => {
                    if (err) {
                      console.log("JWT error: ", err);
                    }
                    const { _id, username, email, role } = user;
                    res.json({
                      user: { _id, username, email, role },
                      token,
                    });
                  }
                );
              })
              .catch((err) => console.log(err));
          } else {
            const payload = {
              _id: user.id,
            };
            // Sign token
            jwt.sign(
              payload,
              jwtSecret.secretOrKey,
              {
                expiresIn: "24h", // 1 year in seconds
              },
              (err, token) => {
                if (err) {
                  console.log("JWT error: ", err);
                }
                const { _id, username, email, role } = user;
                res.json({
                  user: { _id, username, email, role },
                  token,
                });
              }
            );
          }
        });
      });
  },
};
