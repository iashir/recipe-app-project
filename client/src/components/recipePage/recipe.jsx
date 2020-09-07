import React, { Component } from "react";
import axios from "axios";
import { showLoading } from "../helper/loading";
import M from "materialize-css";
import { toast } from "react-toastify";
import { isAuthenticated } from "../helper/auth";
import Comment from "./sections/comment";
import RecipeInfo from "./sections/recipeInfo";
const imageProf = require("../../public/uploads/chef2.jpg");
class Recipe extends Component {
  state = {
    recipe: [],
    loading: false,
    profileImage: true,
    newComment: "",
    newReplyComment: "",
    comments: [],
    repliedComments: [],
    commentAdded: [],
    openReply: false,
    replyId: "",
    parentCommentId: "",
  };
  componentDidMount = () => {
    this.setState({ loading: true });
    const url = window.location.pathname.toString();

    if (isAuthenticated()) {
      const { _id } = JSON.parse(localStorage.user);
      this.setState({ user: _id });
    }

    axios
      .get("/api" + url)
      .then(({ data }) => {
        if (data.user.image === "") {
          data.user.image = imageProf;
        }
        this.setState({ recipe: data, loading: false });
        let parallax = document.querySelectorAll(".parallax");
        M.Parallax.init(parallax);
      })
      .catch((err) => {
        toast.error("Invalid recipe");
        // toast.error(`${err.response.data}`, {
        //   position: "bottom-center",
        //   autoClose: 5000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        // });
        this.setState({ loading: false });
      });
  };

  renderRecipe = (recipe, user) => {};
  deleteComment = (e) => {
    const comments = this.state.comments.filter(
      (m) => m._id !== e.currentTarget.id
    );
    this.setState({ comments });
    const id = e.currentTarget.id;
    const obj = {
      _id: id,
      user: this.state.user,
    };
    axios
      .delete(`/api/comment/${id}`, { data: obj })
      .then(() => {
        toast.success(`You successfully deleted comment`, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((err) => {
        toast.error(`${err.response.data}`, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };
  render() {
    const {
      recipe,
      loading,
      comments,
      user,
      newComment,
      openReply,
      replyId,
      newReplyComment,
      repliedComments,
    } = this.state;
    if (recipe.length !== 0) {
      return (
        <React.Fragment>
          {loading ? showLoading() : null}
          <RecipeInfo recipe={recipe} user={recipe.user} />
          <div className="container">
            <Comment
              comments={comments}
              newComment={newComment}
              user={user}
              imageProf={imageProf}
              onSubmit={this.handleComment}
              onChange={this.handleChange}
              onDelete={this.deleteComment}
              showReplyInput={this.showReplyInput}
              openReply={openReply}
              replyId={replyId}
              newReplyComment={newReplyComment}
              repliedComments={repliedComments}
            />
          </div>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
}

export default Recipe;
