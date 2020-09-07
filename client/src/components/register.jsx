import React, { Component } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { showLoading } from "./helper/loading";
import { register } from "../api/auth";
import { isAuthenticated } from "./helper/auth";
import Validator from "validator";
class Register extends Component {
  state = {
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    password2: "",
    errors: {},
    loading: false,
    successMessage: "",
  };
  componentDidMount = () => {
    if (isAuthenticated() && isAuthenticated().role === 1) {
      this.props.history.push("/admin");
    } else if (isAuthenticated() && isAuthenticated().role === 0) {
      this.props.history.push("/recipes");
    }
  };
  handleChange = (e) => {
    const badInput = e.target.value;
    var value = badInput.replace(/  +/g, " ");
    this.setState({ [e.target.id]: value });
    this.validateField(e.target.id, value);
  };
  handleSubmit = (e) => {
    e.preventDefault();
    let {
      username,
      firstName,
      lastName,
      email,
      password2,
      password,
    } = this.state;
    const newUser = {
      username: username.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password: password.trim(),
      password2: password2.trim(),
    };
    this.setState({ loading: true });
    register(newUser)
      .then((res) => {
        this.setState({
          loading: false,
          successMessage: res.data.successMessage,
        });
        this.props.history.push({
          pathname: "/login",
          state: {
            username: newUser.username,
            password: newUser.password,
          },
        });
      }) // re-direct to login on successful register
      .catch((err) => {
        this.setState({
          errors: err.response.data,
          loading: false,
        });
      });
  };

  validateField = (fieldName, value) => {
    let { errors, password } = this.state;
    const passwordRegEx = new RegExp(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$"
    );
    switch (fieldName) {
      case "username":
        if (Validator.isEmpty(value)) {
          errors.username = "Username field is required";
          break;
        }
        if (!Validator.isLength(value, { min: 3, max: 15 })) {
          errors.username =
            "Username must be more than 3 and less than 15 characters";
          break;
        }
        errors.username = "";
        break;
      case "firstName":
        if (Validator.isEmpty(value)) {
          errors.firstName = "First Name field is required";
          break;
        } else if (!Validator.isAlpha(value)) {
          errors.firstName = "First Name must be letters only";
          break;
        }
        errors.firstName = "";
        break;
      case "lastName":
        if (Validator.isEmpty(value)) {
          errors.lastName = "Last Name field is required";
          break;
        } else if (!Validator.isAlpha(value)) {
          errors.lastName = "Last Name must be letters only";
          break;
        }
        errors.lastName = "";
        break;
      case "email":
        if (Validator.isEmpty(value)) {
          errors.email = "Email field is required";
          break;
        } else if (!Validator.isEmail(value)) {
          errors.email = "Email is invalid";
          break;
        }
        errors.email = "";
        break;
      case "password":
        if (Validator.isEmpty(value)) {
          errors.password = "Password field is required";
          break;
        }
        if (!Validator.isLength(value, { min: 6, max: 30 })) {
          errors.password =
            "Password must be at least 6 and no more than 30 characters";
          break;
        } else if (!passwordRegEx.test(value)) {
          errors.password =
            "Password must contain at least 1 uppercase, 1 lowercase, 1 numeric and 1 special character";
          break;
        }
        errors.password = "";
        break;
      case "password2":
        if (Validator.isEmpty(value)) {
          errors.password2 = "Confirm password field is required";
          break;
        }
        if (!Validator.equals(password, value)) {
          errors.password2 = "Passwords must match";
          break;
        }
        errors.password2 = "";
        break;
      default:
        break;
    }
    this.setState({ errors });
  };

  render() {
    const { errors, loading } = this.state;
    return (
      <React.Fragment>
        {loading ? showLoading() : null}
        <div className="container">
          <div className="card">
            <div className="card-content">
              <div className="row">
                <h3>Register Form</h3>
              </div>

              <div className="row">
                <form
                  className="col s12"
                  noValidate
                  onSubmit={this.handleSubmit}
                >
                  <div className="row">
                    <div className="input-field col s12">
                      <input
                        id="username"
                        type="text"
                        onChange={this.handleChange}
                        value={this.state.username}
                        className={classnames("", {
                          invalid: errors.username,
                        })}
                      />
                      <label htmlFor="username">Username</label>
                      <span className="red-text">{errors.username}</span>
                    </div>
                  </div>

                  <div className="row">
                    <div className="input-field col s6">
                      <input
                        id="firstName"
                        type="text"
                        onChange={this.handleChange}
                        value={this.state.firstName}
                        className={classnames("", {
                          invalid: errors.firstName,
                        })}
                      />
                      <label htmlFor="firstName">First Name</label>
                      <span className="red-text">{errors.firstName}</span>
                    </div>

                    <div className="input-field col s6">
                      <input
                        id="lastName"
                        type="text"
                        onChange={this.handleChange}
                        value={this.state.lastName}
                        className={classnames("", {
                          invalid: errors.lastName,
                        })}
                      />
                      <label htmlFor="lastName">Last Name</label>
                      <span className="red-text">{errors.lastName}</span>
                    </div>
                  </div>

                  <div className="row">
                    <div className="input-field col s12">
                      <input
                        id="email"
                        onChange={this.handleChange}
                        value={this.state.email}
                        type="email"
                        className={classnames("", {
                          invalid: errors.email,
                        })}
                      />
                      <label htmlFor="email">Email</label>
                      <span className="red-text">{errors.email}</span>
                    </div>
                  </div>

                  <div className="row">
                    <div className="input-field col s12">
                      <input
                        id="password"
                        onChange={this.handleChange}
                        value={this.state.password}
                        type="password"
                        className={classnames("", {
                          invalid: errors.password,
                        })}
                      />
                      <label htmlFor="password">Password</label>
                      <span className="red-text">{errors.password}</span>
                    </div>
                  </div>

                  <div className="row">
                    <div className="input-field col s12">
                      <input
                        id="password2"
                        onChange={this.handleChange}
                        value={this.state.password2}
                        type="password"
                        className={classnames("", {
                          invalid: errors.password2,
                        })}
                      />
                      <label htmlFor="password2">Confirm Password</label>
                      <span className="red-text">{errors.password2}</span>
                    </div>
                  </div>

                  <div className="row">
                    {errors.errorMessage ? (
                      <div className="card-panel deep-orange">
                        {errors.errorMessage}
                      </div>
                    ) : null}
                  </div>

                  <div className="row">
                    <button
                      className="btn waves-effect waves-light"
                      type="submit"
                      name="action"
                    >
                      Submit
                    </button>

                    <Link to="/" className="orange-effect orange btn">
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

export default Register;
