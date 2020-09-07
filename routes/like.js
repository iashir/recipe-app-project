const express = require("express");

const router = express.Router();
const Like = require("../models/Like");
const Dislike = require("../models/Dislike");
router.post("/getLikes", (req, res) => {
  let obj = {};
  if (req.body.recipe) {
    obj = { recipe: req.body.recipe };
  } else {
    obj = { comment: req.body.comment };
  }

  Like.find(obj).exec((err, likes) => {
    if (err) return res.status(400).json({ success: false });
    res.status(200).json({ success: true, likes });
  });
});

router.post("/getDislikes", (req, res) => {
  let obj = {};
  if (req.body.recipe) {
    obj = { recipe: req.body.recipe };
  } else {
    obj = { comment: req.body.comment };
  }

  Dislike.find(obj).exec((err, dislikes) => {
    if (err) return res.status(400).json({ success: false });
    res.status(200).json({ success: true, dislikes });
  });
});

router.post("/upLike", (req, res) => {
  console.log(req.body);
  Dislike.findOneAndDelete(req.body).exec((err, dislike) => {
    if (err) {
      return res.status(400).json({ success: false });
    }
  });
  Like.findOneAndDelete(req.body).exec((err, like) => {
    if (err) {
      return res.status(400).json({ success: false });
    }
    console.log(like);
    if (like === null) {
      console.log("new like");
      const like = new Like(req.body);
      like.save((err, like) => {
        if (err) {
          return res.status(400).json({ success: false });
        }
        console.log("DDDWQWEQ test");
      });
    }
    res.status(200).json({ success: true });
  });
});

router.post("/unLike", (req, res) => {
  Like.findOneAndDelete(req.body).exec((err, dislike) => {
    if (err) return res.status(400).json({ success: false });
    res.status(200).json({ success: true });
  });
});

router.post("/upDislike", (req, res) => {
  console.log(req.body);
  Like.findOneAndDelete(req.body).exec((err, like) => {
    if (err) return res.status(400).json({ success: false });
  });
  Dislike.findOneAndDelete(req.body).exec((err, dislike) => {
    if (err) return res.status(400).json({ success: false });
    if (!dislike) {
      const dislike = new Dislike(req.body);
      dislike.save((err, dislike) => {
        if (err) return res.status(400).json({ success: false });
      });
    }
    res.status(200).json({ success: true });
  });
});

router.post("/unDislike", (req, res) => {
  Dislike.findOneAndDelete(req.body).exec((err, dislike) => {
    if (err) return res.status(400).json({ success: false });
    res.status(200).json({ success: true });
  });
});

module.exports = router;
