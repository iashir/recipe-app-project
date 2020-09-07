import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";
import { showLoading } from "../helper/loading";
import { toast } from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";
class AdminRecipes extends Component {
  state = { recipes: [], loading: false, user: "" };
  componentDidMount = () => {
    AOS.init();
    const { _id } = JSON.parse(localStorage.user);
    this.setState({ loading: true, user: _id });
    axios.get("/api/admin/recipes").then(({ data: recipes }) => {
      this.setState({ recipes, loading: false });
    });
  };

  deleteRecipe = (e) => {
    const currentRecipe = this.state.recipes.find(
      (m) => m._id === e.currentTarget.id
    );
    const recipes = this.state.recipes.filter(
      (m) => m._id !== e.currentTarget.id
    );
    this.setState({ recipes });
    const id = e.currentTarget.id;
    const obj = {
      _id: id,
      user: this.state.user,
    };
    console.log(obj);
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
    const { recipes, loading } = this.state;
    return (
      <main className="container">
        {loading ? showLoading() : null}
        <table className="stipped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe) => (
              <tr
                key={recipe._id}
                data-aos="fade-left"
                data-aos-easing="linear"
                data-aos-duration="4500"
              >
                <td>
                  <Link to={"/recipes/" + recipe._id}>{recipe.title}</Link>
                </td>
                <td>{moment(recipe.createdAt).format("LLLL")}</td>
                <td>
                  <span className="dash status">{recipe.status}</span>
                </td>
                <td>
                  <Link
                    to={"/admin/edit/" + recipe._id}
                    className="btn btn-float "
                  >
                    <i className="fa fa-edit"></i>
                  </Link>

                  <button
                    id={recipe._id}
                    className="btn red"
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
    );
  }
}

export default AdminRecipes;
