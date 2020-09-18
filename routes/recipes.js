const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");
const Subscriber = require("../models/Subscribe");
const multer = require("multer");
const { recipeValidator } = require("../middleware/validator");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const path = require("path");

const s3 = new aws.S3({
  accessKeyId: "AKIAVFAC4BW6UCTKPB4K",
  secretAccessKey: "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",
  Bucket: "ilyasrecipeappbucket",
});

const recipeImageUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "ilyasrecipeappbucket",
    acl: "public-read",
    key: function (req, file, cb) {
      cb(
        null,
        path.basename(file.originalname, path.extname(file.originalname)) +
          "-" +
          Date.now() +
          path.extname(file.originalname)
      );
    },
  }),
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("recipeImage");

function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Images Only!");
  }
}

//@desc Show add page
//@route GET /recipes/add
router.get("/add", (req, res) => {});

//@desc Process add form
//@route POST /recipes/add
router.post("/add", async (req, res) => {
  try {
    await recipeImageUpload(req, res, (error) => {
      if (error) {
        res.status("400").json({ recipeImage: error });
      } else if (error instanceof multer.MulterError) {
        res.status("400").json({ recipeImage: error });
      } else {
        // If File not found
        if (req.file === undefined) {
          res.status("400").json({ recipeImage: "No File Selected" });
        } else {
          const errors = recipeValidator(req.body);
          if (errors) return res.status(400).json(errors);
          // If Success
          const imageName = req.file.key;
          const imageLocation = req.file.location;
          req.body.recipeImageName = imageName;
          req.body.recipeImageLocation = imageLocation; // Save the file name into database into profile model
          Recipe.create(req.body);
          res.status("200").json(req.body.title);
        }
      }
    });
  } catch (error) {
    res.status("400").json({ error });
  }
});

//@desc Show all recipes
//@route GET /recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find({ status: "public" })
      .populate("user")
      .populate("category")
      .sort({ createdAt: "desc" })
      .lean();
    res.send(recipes);
  } catch (error) {
    console.log(error);
  }
});

//@desc Show single recipe
//@route GET /recipes/:id
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("user").lean();
    res.send(recipe);
  } catch (error) {
    return res.status("400").send("No such recipe");
  }
});

//@desc edit recipe
//@route GET /recipes/edit/:id
router.get("/edit/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id }).lean();

    if (recipe.user != req.user.id) {
      return res.status("400").json({ errors: "User id error" });
    } else {
      res.send(resipe);
    }
  } catch (error) {
    return res.status("400").send(error);
  }
});

//@desc Update Recipe
//@route PUT /recipes/:id
router.put("/:id", async (req, res) => {
  try {
    if (!req.body.title) {
      await recipeImageUpload(req, res, (error) => {
        if (error) {
          res.status("400").json({ recipeImage: error });
        } else if (error instanceof multer.MulterError) {
          res.status("400").json({ recipeImage: error });
        } else {
          // If File not found
          if (req.file === undefined) {
            res.status("400").json({ recipeImage: "No File Selected" });
          } else {
            // If Success
            req.body.recipeImageName = req.file.key;
            req.body.recipeImageLocation = req.file.location; // Save the file name into database into profile model
            Recipe.findById(req.params.id).then((recipe) => {
              if (req.body.user === "5f237976218df36157ed5754") {
                delete req.body["user"];
              } else if (recipe.user != req.body.user) {
                return res.status("400").json({ errors: "User id error" });
              }
              console.log(req.body);
              Recipe.findOneAndUpdate(
                { _id: req.params.id },
                req.body,
                null,
                function (err, docs) {
                  if (err) {
                    res.status("400").json("err");
                  } else {
                    res.status("200").json(req.body.title);
                  }
                }
              );
            });
          }
        }
      });
    } else {
      Recipe.findById(req.params.id).then((recipe) => {
        if (req.body.user === "5f237976218df36157ed5754") {
          delete req.body["user"];
        } else if (recipe.user != req.body.user) {
          return res.status("400").json({ errors: "User id error" });
        }
        console.log(req.body);
        Recipe.findOneAndUpdate(
          { _id: req.params.id },
          req.body,
          null,
          function (err, docs) {
            if (err) {
              res.status("400").json("err");
            } else {
              res.status("200").json(req.body.title);
            }
          }
        );
      });
    }
  } catch (error) {
    return res.status("400").json({ errors: err.message });
  }
});

//@desc Delete Recipe
//@route DELETE /recipes/:id
router.delete("/:id", async (req, res) => {
  try {
    let recipe = await Recipe.findById(req.params.id).lean();
    console.log(recipe.user);
    console.log(req.body.user);
    if (!recipe) {
      return res.status(400).json({ errors: "Recipe id does not match" });
    }
    if (req.body.user === "5f237976218df36157ed5754") {
      delete req.body["user"];
    } else if (recipe.user != req.body.user._id) {
      return res.status(400).json({ errors: "User id error" });
    }
    await Recipe.deleteOne({ _id: req.params.id });
    return res.status(200).json({ success: "success" });
  } catch (error) {
    return res.status(400).json({ errors: error.message });
  }
});

//@desc User recipes
//@route GET /recipes/user/:userId
router.get("/user/:userId", async (req, res) => {
  try {
    const recipes = await Recipe.find({
      user: req.params.userId,
      status: "public",
    })
      .populate("user")
      .populate("category")
      .lean();

    res.send(recipes);
  } catch (error) {
    res.status(400).json({ errors: error.message });
  }
});

//@desc Subscription recipes
//@route POST /recipes/getSubscriptionRecipes
router.post("/getSubscriptionRecipes", async (req, res) => {
  console.log("test");
  console.log(req.body);
  Subscriber.find(req.body).exec((err, subscriptions) => {
    let followings = [];
    subscriptions.map((subscriber, i) => {
      followings.push(subscriber.userTo);
    });
    console.log(followings);
    Recipe.find({ user: { $in: followings } })
      .populate("user")
      .populate("category")
      .exec((err, recipes) => {
        if (err) return res.status(400).send(err);
        res.status(200).json({ success: true, recipes });
      });
  });
});
module.exports = router;
