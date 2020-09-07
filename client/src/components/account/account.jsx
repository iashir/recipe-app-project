import React, { Component } from "react";
import ProfilePhoto from "../common/profilePhoto";
import ProfileDesc from "./sections/profileDesc";
import axios from "axios";
import M from "materialize-css";
import { showLoading } from "../helper/loading";
import Followings from "./sections/followings";
import Followers from "./sections/followers";
import RecipeCard from "../common/recipeCard";
const imageProf = require("../../public/uploads/chef2.jpg");

class Account extends Component {
  state = {
    user: {},
    categories: [],
    loading: false,
    subscribed: false,
    newFollower: false,
    newFollowing: false,
    recipes: [],
  };
  componentDidMount = () => {
    this.setState({ loading: true });
    const id = this.props.match.params.id;
    axios
      .get("/api/users/" + id)
      .then(({ data: user }) => {
        this.setState({ user });
        let elems = document.querySelectorAll(".collapsible");
        M.Collapsible.init(elems);
        let modal = document.querySelectorAll(".modal");
        M.Modal.init(modal);
      })
      .catch((err) => {
        this.setState({ loading: false });
        this.props.history.push("/not-found");
      });

    axios.get("/api/recipes/user/" + id).then(({ data: recipes }) => {
      this.setState({ recipes, loading: false });
    });
  };

  handleFollowersUpdate = () => {
    this.setState({ newFollower: !this.state.newFollower });
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({ loading: true });
      const id = this.props.match.params.id;

      axios
        .get("/api/users/" + id)
        .then(({ data: user }) => {
          this.setState({ user });
          var elems = document.querySelectorAll(".collapsible");
          M.Collapsible.init(elems);
        })
        .catch((err) => {
          this.setState({ loading: false });
          this.props.history.push("/not-found");
        });

      axios.get("/api/recipes/user/" + id).then(({ data: recipes }) => {
        this.setState({ recipes, loading: false });
      });
      this.setState({
        newFollower: !this.state.newFollower,
        newFollowing: !this.state.newFollowing,
      });
    }
  };

  render() {
    const {
      user,
      subscribed,
      loading,
      recipes,
      newFollower,
      newFollowing,
    } = this.state;

    if (user._id) {
      return (
        <main className="container">
          {loading ? showLoading() : null}
          <div className="row ">
            <div className="col s12 m4 l4 ">
              <ProfilePhoto
                user={user}
                subscribed={subscribed}
                onFollowersUpdate={this.handleFollowersUpdate}
              />
              <Followers newFollower={newFollower} />
              <Followings newFollowing={newFollowing} />
            </div>
            <div className="col s12 m8 l8">
              <ProfileDesc user={user} />
              <RecipeCard
                recipes={recipes}
                imageProf={imageProf}
                recipesLength={recipes.length}
              />
            </div>
          </div>
        </main>
      );
    } else {
      return null;
    }
  }
}

export default Account;
