import React, { useState, useEffect } from "react";
import SingleComment from "./singleComment";
import CommentInput from "./commentInput";
import { toast } from "react-toastify";
import { isAuthenticated } from "../../helper/auth";
import axios from "axios";
import { useParams } from "react-router-dom";
import { showLoading } from "../../helper/loading";
const imageProf = require("../../../public/uploads/chef2.jpg");
const Comments = () => {
  const recipe = useParams();
  const [newComment, setnewComment] = useState("");
  const [newReplyComment, setnewReplyComment] = useState("");
  const [comments, setComments] = useState([]);
  const [repliedComments, setRepliedComments] = useState([]);
  const [openReply, setOpenReply] = useState(false);
  const [loading, setLoading] = useState(false);
  const [replyId, setReplyId] = useState("");
  const [parentCommentId, setParentCommentId] = useState("");
  const [responseTo, setResponseTo] = useState("");
  const [commentsAdded, setCommentsAdded] = useState(0);
  ///////////////////////////////////////////
  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/comment/" + recipe.id)
      .then(({ data }) => {
        setComments(data.comments.reverse());
        setRepliedComments(data.repliedComments);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Unable to load comments");
      });
  }, [commentsAdded, recipe.id]);

  /////////////////////////////////////////
  const handleComment = (e) => {
    e.preventDefault();
    if (!isAuthenticated()) {
      return toast.error(`Please login`, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    const { _id } = JSON.parse(localStorage.user);
    let comment =
      e.target.name === "newReplyComment" || replyId === e.target.id
        ? newReplyComment
        : newComment;
    let obj = {};
    if (e.target.name === "newReplyComment" && parentCommentId !== "") {
      obj = {
        user: _id,
        content: comment,
        recipe: recipe.id,
        responseTo: responseTo,
        parentComment: parentCommentId,
      };
    } else {
      obj = {
        user: _id,
        content: comment,
        recipe: recipe.id,
      };
    }

    let name = e.target.name;
    if (comment === "") {
      return toast.error("empty comment");
    }
    setLoading(true);
    // this.setState({ loading: true });
    axios
      .post("/api/comment/" + recipe.id, obj)
      .then((res) => {
        if (res.data.success) {
          console.log(res.data);
          setOpenReply(false);
          setLoading(false);
          if (name === "newComment") {
            setnewComment("");
          } else {
            setnewReplyComment("");
          }
          setCommentsAdded(commentsAdded + 1);
        }
      })
      .catch((error) => {
        toast.error("Error occured while posting comment");
      });
  };

  ///////////////////////////////////////////
  const handleChange = (e) => {
    if (e.target.name === "newComment") {
      setnewComment(e.target.value);
    } else {
      setnewReplyComment(e.target.value);
    }
    // this.setState({ [e.target.name]: e.target.value });
  };

  ///////////////////////////////////////////
  const showReplyInput = (replyId, parentCommentId, responseTo) => {
    setOpenReply(!openReply);
    setReplyId(replyId);
    setParentCommentId(parentCommentId);
    setResponseTo(responseTo);
  };

  return (
    <React.Fragment>
      {loading ? showLoading() : null}
      <CommentInput
        onSubmit={handleComment}
        onChange={handleChange}
        value={newComment}
        name="newComment"
      />
      <SingleComment
        comments={comments}
        imageProf={imageProf}
        showReplyInput={showReplyInput}
        openReply={openReply}
        onSubmit={handleComment}
        onChange={handleChange}
        replyId={replyId}
        newReplyComment={newReplyComment}
        repliedComments={repliedComments}
      />
    </React.Fragment>
  );
};

export default Comments;
