import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import classnames from "classnames";
import Validator from "validator";
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import { toast } from "react-toastify";
import { showLoading } from "./helper/loading";
class EditRecipe extends Component {
  state = {
    _id: "",
    title: "",
    body: "",
    status: "",
    category: "",
    ingredients: "",
    recipeImageName: "",
    recipeImageLocation: "",
    recipeImage: null,
    oldRecipeImage: true,
    categories: [],
    user: {},
    errors: {},
    loading: false,
  };
  componentDidMount = () => {
    const { _id } = JSON.parse(localStorage.user);

    this.setState({ user: _id, loading: true });
    const params = this.props.match.params.id;
    axios.get("/api/categories").then(({ data: categories }) => {
      this.setState({
        categories,
      });
    });
    axios.get("/api/recipes/" + params).then(({ data }) => {
      const {
        title,
        body,
        status,
        recipeImageName,
        recipeImageLocation,
        _id,
        category,
        ingredients,
      } = data;
      this.setState({
        title,
        ingredients,
        body,
        category,
        recipeImageName,
        recipeImageLocation,
        _id,
        status,
        loading: false,
      });
      M.AutoInit();
    });
  };

  handleChange = (event) => {
    if (event.target.id === "recipeImage") {
      this.setState({
        recipeImage: event.target.files[0],
        oldRecipeImage: false,
      });
    } else {
      this.setState({ [event.target.id]: event.target.value });
      this.validateForm(event.target.id, event.target.value);
    }
  };
  handleSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const {
      title,
      body,
      status,
      user,
      recipeImage,
      _id,
      oldRecipeImage,
      category,
      ingredients,
    } = this.state;
    if (!oldRecipeImage) {
      console.log("WITH IMAGE");
      let formData = new FormData();
      formData.append("recipeImage", recipeImage, recipeImage.name);
      formData.append("title", title);
      formData.append("status", status);
      formData.append("category", category);
      formData.append("user", user);
      formData.append("body", body);
      formData.append("ingredients", ingredients);
      console.log(formData);

      await axios
        .put("/api/recipes/" + _id, formData, {
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          },
        })
        .then((data) => {
          toast.success(`success`, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          this.props.history.push("/recipes");
        })
        .catch((error) => {
          if ("LIMIT_FILE_SIZE" === error.code) {
            this.setState({ errors: "Max size 5MB" });
          } else {
            this.setState({ errors: error.response.data });
          }
        });
    } else {
      const obj = {
        title,
        body,
        status,
        user,
        _id,
        category,
        ingredients,
      };
      await axios
        .put("/api/recipes/" + _id, obj)
        .then((data) => {
          toast.success(`success`, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          this.props.history.push("/recipes/" + _id);
        })
        .catch((err) => this.setState({ errors: err.response.data }));
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
      case "ingredients":
        if (Validator.isEmpty(value)) {
          errors.ingredients = "Ingredients field is required";
          break;
        }
        errors.ingredients = "";
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
      recipeImageName,
      categories,
      category,
      ingredients,
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
                          defaultValue={recipeImageName}
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
                        className={classnames("", {
                          invalid: errors.title,
                        })}
                      />
                      <label className="active" htmlFor="title">
                        Title
                      </label>
                    </div>
                  </div>

                  <div className="row">
                    <div className="input-field">
                      <select
                        id="category"
                        onChange={this.handleChange}
                        value={category}
                      >
                        {categories.map((data) => (
                          <option value={data._id}>{data.type}</option>
                        ))}
                      </select>
                      <label>Choose category</label>
                    </div>
                  </div>

                  <div className="row">
                    <div className="input-field">
                      <select
                        id="status"
                        onChange={this.handleChange}
                        value={status}
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                      </select>
                      <label htmlFor="status">
                        Choose status of your recipe
                      </label>
                    </div>
                  </div>

                  <div className="row">
                    <div className="input-field">
                      <textarea
                        value={ingredients}
                        onChange={this.handleChange}
                        id="ingredients"
                        className={classnames("materialize-textarea", {
                          invalid: errors.ingredients,
                        })}
                      ></textarea>
                      <label className="active" htmlFor="ingredients">
                        Ingredients
                      </label>
                      <span className="red-text">{errors.ingredients}</span>
                    </div>
                  </div>

                  <div className="row">
                    <div className="input-field">
                      <textarea
                        value={body}
                        onChange={this.handleChange}
                        id="body"
                        className={classnames("materialize-textarea", {
                          invalid: errors.body,
                        })}
                      ></textarea>
                      <label className="active" htmlFor="body">
                        Description
                      </label>
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

export default EditRecipe;
