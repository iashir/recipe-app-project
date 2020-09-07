import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import { Link, withRouter } from "react-router-dom";
import M from "materialize-css";
import { showLoading } from "./helper/loading";
import { toast } from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";
class MyRecipes extends Component {
  state = { userRecipes: [], loading: false, user: {} };
  componentDidMount = () => {
    AOS.init();
    var floatButton = document.querySelectorAll(".fixed-action-btn");
    M.FloatingActionButton.init(floatButton);
    const user = JSON.parse(localStorage.user);
    this.setState({ loading: true, user });

    axios
      .get(`/api/myrecipes/${user._id}`)
      .then(({ data: userRecipes }) => {
        this.setState({ userRecipes, loading: false });
        if (this.state.userRecipes.length === 0) {
          var elemsTap = document.querySelector(".tap-target");
          var instancesTap = M.TapTarget.init(elemsTap);
          instancesTap.open();
        }
      })
      .catch((err) => console.log(err));
  };

  deleteRecipe = (e) => {
    const currentRecipe = this.state.userRecipes.find(
      (m) => m._id === e.currentTarget.id
    );
    const userRecipes = this.state.userRecipes.filter(
      (m) => m._id !== e.currentTarget.id
    );
    this.setState({ userRecipes });
    const id = e.currentTarget.id;
    const obj = {
      _id: id,
      user: this.state.user,
    };
    axios
      .delete(`/api/recipes/${id}`, { data: obj })
      .then(() => {
        toast.success(`You successfully deleted ${currentRecipe.title}`, {
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
        this.setState({ errors: err });
      });
  };

  render() {
    const { userRecipes, loading } = this.state;

    if (userRecipes.length === 0) {
      return (
        <React.Fragment>
          <div className="container">
            {loading ? showLoading() : null}
            <p>You did't crate recipes yet</p>
            <div className="fixed-action-btn ">
              <Link
                to="/my-recipes/add"
                id="menu"
                className="btn-floating btn-large waves-effect waves-light red pulse"
              >
                <i className="material-icons">add</i>
              </Link>
              <div className="tap-target teal lighten-4" data-target="menu">
                <div className="tap-target-content">
                  <h5>You don't have recipes yet</h5>
                  <p>Click me to add your first recipe</p>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <main className="container">
            {loading ? showLoading() : null}
            <div className="fixed-action-btn ">
              <Link
                to="/my-recipes/add"
                id="menu"
                className="btn-floating btn-large waves-effect waves-light red"
              >
                <i className="material-icons">add</i>
              </Link>
            </div>

            <table className="stipped ">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {userRecipes.map((recipe) => (
                  <tr
                    key={recipe._id}
                    data-aos="fade-left"
                    data-aos-easing="linear"
                    data-aos-duration="4500"
                  >
                    <td>
                      <Link to={"/recipes/" + recipe._id}>{recipe.title}</Link>
                    </td>
                    <td>
                      {moment(recipe.createdAt).startOf("hour").fromNow()}
                    </td>
                    <td>
                      <span className="dash status">{recipe.status}</span>
                    </td>
                    <td>
                      <Link
                        to={"/my-recipes/edit/" + recipe._id}
                        className="btn btn-small "
                      >
                        <i className="fa fa-edit"></i>
                      </Link>

                      <button
                        id={recipe._id}
                        style={{ marginRight: "0px" }}
                        className="btn red btn-small"
                        onClick={this.deleteRecipe}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </main>
        </React.Fragment>
      );
    }
  }
}

export default withRouter(MyRecipes);
