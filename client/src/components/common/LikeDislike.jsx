import React, { Fragment, useEffect, useState } from "react";
import { Comment, Icon } from "semantic-ui-react";
import "materialize-css";
import axios from "axios";
import { toast } from "react-toastify";
import { isAuthenticated } from "../helper/auth";

const LikeDislike = (props) => {
  const [Likes, setLikes] = useState(0);
  const [Dislikes, setDislikes] = useState(0);
  const [LikeAction, setLikeAction] = useState(null);
  const [DislikeAction, setDislikeAction] = useState(null);
  const [variable, setVariable] = useState({});
  useEffect(() => {
    var obj = {};
    var userId;
    if (isAuthenticated()) {
      const { _id } = JSON.parse(localStorage.user);
      userId = _id;
    }
    if (props.recipe) {
      obj = { recipe: props.recipeId, user: userId };
    } else {
      obj = { comment: props.commentId, user: userId };
    }
    setVariable(obj);
    axios
      .post("/api/like/getLikes", obj)
      .then((res) => {
        if (res.data.success) {
          setLikes(res.data.likes.length);
          res.data.likes.map((like) => {
            if (like.user === userId) {
              return setLikeAction("liked");
            } else {
              return setLikeAction(null);
            }
          });
        }
        // else {
        //   toast.error("error");
        // }
      })
      .catch((err) => console.log(err));
    axios
      .post("/api/like/getDislikes", obj)
      .then((res) => {
        if (res.data.success) {
          setDislikes(res.data.dislikes.length);
          res.data.dislikes.map((like) => {
            if (like.user === userId) {
              return setDislikeAction("disliked");
            } else {
              return setLikeAction(null);
            }
          });
        }
        // else {
        //   // toast.error("error");
        //   console.log(err);
        // }
      })
      .catch((err) => console.log(err));
  }, [Likes, Dislikes, props.commentId, props.recipe, props.recipeId]);
  const onLike = () => {
    if (isAuthenticated()) {
      if (LikeAction === null) {
        console.log(variable);
        axios
          .post("/api/like/upLike", variable)
          .then((res) => {
            if (res.data.success) {
              if (DislikeAction === "disliked") {
                setDislikeAction(null);
                setDislikes(Dislikes - 1);
              }
              setLikes(Likes + 1);
              setLikeAction("liked");
            } else {
              alert("fail to uplike");
            }
          })
          .catch((err) => toast.error("Error occured"));
      } else {
        axios.post("/api/like/unLike", variable).then((res) => {
          if (res.data.success) {
            setLikes(Likes - 1);
            setLikeAction(null);
          } else {
            alert("fail to uplike");
          }
        });
      }
    } else {
      toast.error("Please login");
    }
  };

  const onDislike = () => {
    if (isAuthenticated()) {
      if (DislikeAction === null) {
        axios
          .post("/api/like/upDislike", variable)
          .then((res) => {
            if (res.data.success) {
              if (LikeAction === "liked") {
                setLikeAction(null);
                setLikes(Likes - 1);
              }
              setDislikes(Dislikes + 1);
              setDislikeAction("disliked");
            } else {
              alert("fail to uplike");
            }
          })
          .catch((err) => toast.error("Error occured"));
      } else {
        axios.post("/api/like/unDislike", variable).then((res) => {
          if (res.data.success) {
            setDislikes(Dislikes - 1);
            setDislikeAction(null);
          } else {
            alert("fail to uplike");
          }
        });
      }
    } else {
      toast.error("Please login");
    }
  };
  if (props.recipe) {
    return (
      <Fragment>
        <i
          style={{ cursor: "pointer", paddingLeft: "8px" }}
          className={
            LikeAction === "liked"
              ? "tiny material-icons icon-red"
              : "tiny material-icons icon-grey"
          }
          onClick={() => onLike()}
        >
          thumb_up
        </i>
        <span className="center"> {Likes}</span>

        <i
          style={{ cursor: "pointer", paddingLeft: "8px" }}
          className={
            DislikeAction === "disliked"
              ? "tiny material-icons  icon-red"
              : "tiny material-icons  icon-grey"
          }
          onClick={() => onDislike()}
        >
          thumb_down
        </i>
        <span className="center"> {Dislikes}</span>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <Comment.Action onClick={() => onLike()}>
          <Icon
            className={LikeAction === "liked" ? "icon-red" : null}
            name="thumbs up"
          />
          {Likes}
        </Comment.Action>

        <Comment.Action onClick={() => onDislike()}>
          <Icon
            className={DislikeAction === "disliked" ? "icon-red" : null}
            name="thumbs down"
          />
          {Dislikes}
        </Comment.Action>
      </Fragment>
    );
  }
};

export default LikeDislike;
