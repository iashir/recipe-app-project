const express = require("express");
const router = express.Router();

const Subscribe = require("../models/Subscribe");

//@desc subscribe component
//@route get /api/subscribe
router.get("/", async (req, res) => {
  try {
    const categories = await Categories.find().lean();
    res.send(categories);
  } catch (error) {
    console.log(error);
  }
});

//@desc subscribe component
//@route post /api/subscribe/followers
router.post("/followers", (req, res) => {
  Subscribe.find({ userTo: req.body.userTo })
    .populate("userFrom")
    .exec((err, followers) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({
        success: true,
        followers: followers,
        followersNumber: followers.length,
      });
    });
});
//@desc subscribe component
//@route post /api/subscribe/subscribed
router.post("/subscribed", (req, res) => {
  console.log(req.body);
  Subscribe.find({
    userTo: req.body.userTo,
    userFrom: req.body.userFrom,
  }).exec((err, subscribe) => {
    if (err) return res.status(400).send(err);
    console.log(subscribe);
    let result = false;
    if (subscribe.length !== 0) {
      result = true;
    }

    res.status(200).json({ success: true, subscribed: result });
  });
});

//@desc subscribe component
//@route post /api/subscribe/followings
router.post("/followings", (req, res) => {
  Subscribe.find({ userFrom: req.body.userTo })
    .populate("userTo")
    .exec((err, followings) => {
      if (err) return res.status(400).send(err);

      res.status(200).json({
        success: true,
        followings: followings,
        followingsNumber: followings.length,
      });
    });
});

//@desc subscribe component
//@route post /api/subscribe/follow
router.post("/follow", (req, res) => {
  console.log(req.body);
  const subscribe = new Subscribe(req.body);
  subscribe.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

//@desc subscribe component
//@route post /api/subscribe/unfollow
router.post("/unfollow", (req, res) => {
  Subscribe.findOneAndDelete({
    userTo: req.body.userTo,
    userFrom: req.body.userFrom,
  }).exec((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

module.exports = router;
