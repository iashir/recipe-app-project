import React, { Component } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { setAuthentication, isAuthenticated } from "./helper/auth";
import { showLoading } from "./helper/loading";
import { login, googleLogin } from "../api/auth";
import Validator from "validator";
import GoogleLogin from "react-google-login";
import { toast } from "react-toastify";

class Login extends Component {
  state = {
    username: "",
    password: "",
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
    if (this.props.history.location.state) {
      const { username, password } = this.props.history.location.state;
      this.setState({ username, password });
    }
  };

  responseSuccessGoogle = (response) => {
    const tokenId = { tokenId: response.tokenId };
    this.setState({ loading: true });
    googleLogin(tokenId)
      .then((res) => {
        const { token, user } = res.data;
        console.log(res.data);
        setAuthentication(token, user);
        if (isAuthenticated() && isAuthenticated().role === 1) {
          this.props.history.push("/admin");
          window.location.reload(false);
        } else {
          this.props.history.push("/recipes");
          window.location.reload(false);
        }
        const { username } = JSON.parse(localStorage.user);
        toast.success(`Signed in as ${username}`, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        this.setState({
          loading: false,
        });
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  };

  responseErrorGoogle = (response) => {
    console.log(response);
  };

  validate = (s) => {
    if (/^(\w+\s?)*\s*$/.test(s)) {
      return s.replace(/\s+$/, "");
    }
    console.log("TEST");
    let trim = s.trim();
    return trim;
  };

  handleChange = (e) => {
    const badInput = e.target.value;
    var value = badInput.replace(/  +/g, " ");
    this.setState({ [e.target.id]: value });
    this.validateForm(e.target.id, value);
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      username: this.state.username.trim(),
      password: this.state.password.trim(),
    };
    this.setState({ loading: true });
    login(userData)
      .then((res) => {
        // Set User to localStorage and Token to Cookies
        const { token, user } = res.data;
        setAuthentication(token, user);
        if (isAuthenticated() && isAuthenticated().role === 1) {
          this.props.history.push("/admin/recipes");
          window.location.reload(false);
        } else {
          this.props.history.push("/recipes");
          window.location.reload(false);
        }
        this.setState({
          loading: false,
          successMessage: res.data.successMessage,
        });
        const { username } = JSON.parse(localStorage.user);
        toast.success(`Signed in as ${username}`, {
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
        this.setState({ errors: err.response.data, loading: false });
        toast.error("Username or Password is invalid", {
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

  validateForm(fieldName, value) {
    const { errors } = this.state;
    switch (fieldName) {
      case "username":
        if (Validator.isEmpty(value)) {
          errors.username = "Username field is required";
          break;
        }
        errors.username = "";
        break;
      case "password":
        if (Validator.isEmpty(value)) {
          errors.password = "Password field is required";
          break;
        }
        errors.password = "";
        break;
      default:
        break;
    }
  }

  render() {
    const { errors, loading } = this.state;

    return (
      <React.Fragment>
        {loading ? showLoading() : null}
        <div className="container login-container">
          <div className="card">
            <div className="card-content">
              <div className="section">
                <div className="row">
                  <h3>Login Form</h3>
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
                        <label className="active" htmlFor="username">
                          Username
                        </label>
                        <span className="red-text">{errors.username}</span>
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
                        <label className="active" htmlFor="password">
                          Password
                        </label>
                        <span className="red-text">{errors.password}</span>
                      </div>
                    </div>

                    <div className="row">
                      <button
                        className="btn waves-effect waves-light "
                        type="submit"
                      >
                        Submit
                      </button>

                      <Link
                        to="/"
                        className="orange btn waves-effect waves-light"
                      >
                        Cancel
                      </Link>
                    </div>
                  </form>
                </div>
                <div className="divider"></div>
                <div className="row">
                  <div className="col s6 ">
                    <GoogleLogin
                      className="waves-effect waves-light btn btn-large button-size"
                      clientId="1001864418858-9a5bkmgdeqmee2bk7di7oudhjkq2370s.apps.googleusercontent.com"
                      buttonText="Google Login"
                      onSuccess={this.responseSuccessGoogle}
                      onFailure={this.responseErrorGoogle}
                      cookiePolicy={"single_host_origin"}
                    />
                  </div>
                  <div className="col s6">
                    <Link
                      to="/register"
                      className="waves-effect waves-light btn btn-large blue darken button-size"
                    >
                      Create account
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Login;
