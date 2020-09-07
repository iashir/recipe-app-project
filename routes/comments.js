const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");
const ReplyComment = require("../models/replyComment");
//@desc comment component
//@route post /api/comment/:id

router.get("/:id", async (req, res) => {
  try {
    const comments = await Comment.find({ recipe: req.params.id })
      .populate("user")
      .lean();
    const repliedComments = await ReplyComment.find({ recipe: req.params.id })
      .populate("user")
      .populate("responseTo")
      .lean();
    await res.status(200).json({ comments, repliedComments });
  } catch (error) {
    console.log(error);
  }
});

router.post("/:id", async (req, res) => {
  try {
    if (req.body.parentComment) {
      console.log("Reply Comment");
      const comment = new ReplyComment(req.body);
      await comment.save((err, comment) => {
        if (err) return res.json({ success: false, err });
        Comment.find({ _id: comment._id })
          .populate("user")
          .exec((err, doc) => {
            if (err) return res.json({ success: false, err });
            return res.status(200).json({ success: true });
          });
      });
    } else {
      const comment = new Comment(req.body);
      await comment.save((err, comment) => {
        if (err) return res.json({ success: false, err });
        Comment.find({ _id: comment._id })
          .populate("user")
          .exec((err, doc) => {
            if (err) return res.json({ success: false, err });
            return res.status(200).json({ success: true });
          });
      });
    }
    // await Comment.create(req.body);
  } catch (error) {
    return res.json({ success: false, err });
  }
});

// //@desc comment component
// //@route put /api/comment/:id
// router.put("/:id", async (req, res) => {
//   try {
//     const commentId = req.params.id;
//     const obj = {
//       recipe: req.body.recipe,
//       user: req.body.user,
//       content: req.body.content,
//     };
//     Comment.findOneAndUpdate({ _id: commentId }, req.body, null, function (
//       err,
//       docs
//     ) {
//       if (err) {
//         res.status("400").json("err");
//       } else {
//         res.status("200").json("success");
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });
//@desc comment component
//@route delete /api/comment/:id
router.delete("/:id", async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id).lean();

    if (!comment) {
      return res.status("400").json({ errors: "comment id does not match" });
    }
    console.log(comment.user, " and ", req.body.user);
    if (comment.user != req.body.user) {
      return res.status("400").send("User id error");
    }
    await Comment.deleteOne({ _id: req.params.id });
    return res.status("200").send("success");
  } catch (error) {
    return res.status("400").send(error.message);
  }
});

module.exports = router;
