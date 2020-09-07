import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import classnames from "classnames";
import Validator from "validator";
import M from "materialize-css";
import { toast } from "react-toastify";
import { showLoading } from "./helper/loading";

class AddRecipe extends Component {
  state = {
    title: "",
    body: "",
    category: "",
    status: "",
    user: {},
    errors: {},
    categories: [],
    loading: false,
    recipeImage: null,
  };
  componentDidMount = () => {
    this.setState({ loading: true });
    const { _id } = JSON.parse(localStorage.user);
    axios.get("/api/categories").then(({ data: categories }) => {
      this.setState({
        user: _id,
        status: "public",
        categories,
        category: categories[0]._id,
        loading: false,
      });
      M.AutoInit();
    });
  };

  handleChange = (event) => {
    if (event.target.id === "recipeImage") {
      this.setState({
        recipeImage: event.target.files[0],
      });
    } else {
      this.setState({ [event.target.id]: event.target.value });
      this.validateForm(event.target.id, event.target.value);
    }
  };
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const { title, body, status, user, recipeImage, category } = this.state;
    if (recipeImage) {
      console.log(this.state);
      let formData = new FormData();
      formData.append("recipeImage", recipeImage, recipeImage.name);
      formData.append("title", title);
      formData.append("status", status);
      formData.append("category", category);
      formData.append("user", user);
      formData.append("body", body.trim());
      axios
        .post("/api/recipes/add", formData, {
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          },
        })
        .then((response) => {
          toast.success(`success, ${response.data} created`, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          this.props.history.push("/my-recipes");
        })
        .catch((error) => {
          this.setState({ errors: error.response.data, loading: false });
        });
    } else {
      this.setState({
        errors: { recipeImage: "No file selected" },
        loading: false,
      });
    }
  };
  validateForm(fieldName, value) {
    const { errors } = this.state;
    switch (fieldName) {
      case "title":
        if (Validator.isEmpty(value)) {
          errors.title = "Title field is required";
          break;
        }
        errors.title = "";
        break;
      case "body":
        if (Validator.isEmpty(value)) {
          errors.body = "Description field is required";
          break;
        }
        errors.body = "";
        break;
      default:
        break;
    }
  }
  render() {
    const {
      title,
      body,
      errors,
      status,
      loading,
      categories,
      category,
    } = this.state;

    return (
      <React.Fragment>
        {loading ? showLoading() : null}
        <div className="container">
          <div className="card">
            <div className="card-content">
              <div className="row">
                <form
                  onSubmit={this.handleSubmit}
                  noValidate
                  encType="multipart/form-data"
                >
                  <div className="row">
                    <div className="file-field input-field">
                      <div className="btn">
                        <span>Select</span>
                        <input
                          name="recipeImage"
                          onChange={this.handleChange}
                          type="file"
                          id="recipeImage"
                        />
                      </div>
                      <div className="file-path-wrapper">
                        <input
                          type="text"
                          placeholder="Recipe image(must be less than 5MB)"
                          className={classnames("file-path ", {
                            invalid: errors.recipeImage,
                          })}
                        />
                        <span className="red-text">{errors.recipeImage}</span>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="input-field">
                      <input
                        value={title}
                        onChange={this.handleChange}
                        type="text"
                        id="title"
                        name="title"
                        className={classnames("", {
                          invalid: errors.title,
                        })}
                      />
                      <label htmlFor="title">Title</label>
                      <span className="red-text">{errors.title}</span>
                    </div>
                  </div>

                  <div className="row">
                    <div className="input-field">
                      <select
                        name="category"
                        id="category"
                        onChange={this.handleChange}
                        value={category}
                      >
                        {categories.map((data) => (
                          <option key={data._id} value={data._id}>
                            {data.type}
                          </option>
                        ))}
                      </select>
                      <label>Choose category</label>
                    </div>
                  </div>

                  <div className="row">
                    <div className="input-field">
                      <select
                        name="status"
                        id="status"
                        onChange={this.handleChange}
                        className={classnames("", {
                          invalid: errors.status,
                        })}
                        value={status}
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                      </select>
                      <label htmlFor="status">
                        Choose status of your recipe
                      </label>
                      <span className="red-text">{errors.status}</span>
                    </div>
                  </div>

                  <div className="row">
                    <div className="input-field">
                      <textarea
                        value={body}
                        onChange={this.handleChange}
                        id="body"
                        name="body"
                        className={classnames("materialize-textarea", {
                          invalid: errors.body,
                        })}
                      ></textarea>
                      <label htmlFor="body">Description</label>
                      <span className="red-text">{errors.body}</span>
                    </div>
                  </div>

                  <div className="row">
                    <input type="submit" value="Save" className="btn" />
                    <Link to="/recipes" className="btn orange">
                      Cancel
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(AddRecipe);
