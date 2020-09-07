import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { isAuthenticated, logout } from "../helper/auth";
import { showLoading } from "../helper/loading";
import M from "materialize-css";
import NavLink from "./sections/navLink";

class NavBar extends Component {
  state = { loading: false, userId: {} };

  componentDidMount = () => {
    this.setState({ loading: true });
    let sidenav = document.querySelectorAll(".sidenav");
    M.Sidenav.init(sidenav);
    if (isAuthenticated()) {
      const { _id } = JSON.parse(localStorage.user);
      this.setState({ userId: _id });
    } else {
      this.setState({ userId: "" });
    }
    this.setState({ loading: false });
  };
  componentDidUpdate = () => {
    if (isAuthenticated() && this.state.userId === "") {
      const { _id } = JSON.parse(localStorage.user);
      this.setState({ userId: _id });
    }
  };

  handleLogout = (e) => {
    this.setState({ loading: true });
    logout(() => {
      this.setState({ loading: false, userId: "" });
    });
    this.props.history.push("/login");
    document.querySelector(".sidenav-overlay").click();
  };

  handleCloseNav = () => {
    document.querySelector(".sidenav-overlay").click();
  };

  NavBar = () => {
    if (isAuthenticated().role === 0) {
      return (
        <React.Fragment>
          <NavLink
            pathname={"/subscriptions"}
            className={"fa fa-users"}
            name={"Subscriptions"}
          />
          <NavLink
            pathname={"/my-recipes"}
            className={"fa fa-pencil-square-o"}
            name={"My Recipes"}
          />

          <NavLink
            pathname={"/account/" + this.state.userId}
            className={"fa fa-user-circle"}
            name={"My Account"}
          />

          <NavLink
            pathname={"#"}
            className={"fa fa-sign-out"}
            name={"Logout"}
            onLogout={this.handleLogout}
          />
        </React.Fragment>
      );
    } else if (isAuthenticated().role === 1) {
      return (
        <React.Fragment>
          <NavLink
            pathname={"/admin/recipes"}
            className={"fa fa-user"}
            name={"Admin recipes"}
          />
          <NavLink
            pathname={"/admin/categories"}
            className={"fa fa-user"}
            name={"Admin categories"}
          />
          <NavLink
            pathname={""}
            className={"fa fa-sign-out"}
            name={"Logout"}
            onLogout={this.handleLogout}
          />
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <NavLink
            pathname={"/login"}
            className={"fa fa-sign-in"}
            name={"Login"}
          />
          <NavLink
            pathname={"/register"}
            className={"fa fa-user-plus"}
            name={"Register"}
          />
        </React.Fragment>
      );
    }
  };

  NavBarResponsive = () => {
    if (isAuthenticated().role === 0) {
      return (
        <React.Fragment>
          <NavLink
            pathname={"/subscriptions"}
            className={"fa fa-users"}
            name={"Subscriptions"}
            onCloseNav={this.handleCloseNav}
          />
          <li className="divider"></li>
          <NavLink
            pathname={"/my-recipes"}
            className={"fa fa-pencil-square-o"}
            name={"My Recipes"}
            onCloseNav={this.handleCloseNav}
          />
          <li className="divider"></li>
          <NavLink
            pathname={"/account/" + this.state.userId}
            className={"fa fa-user-circle"}
            name={"My Account"}
            onCloseNav={this.handleCloseNav}
          />
          <li className="divider"></li>
          <NavLink
            pathname={"#"}
            className={"fa fa-sign-out"}
            name={"Logout"}
            onLogout={this.handleLogout}
          />
        </React.Fragment>
      );
    } else if (isAuthenticated().role === 1) {
      return (
        <React.Fragment>
          <NavLink
            pathname={"/admin/recipes"}
            className={"fa fa-user"}
            name={"Admin recipes"}
            onCloseNav={this.handleCloseNav}
          />
          <NavLink
            pathname={"/admin/categories"}
            className={"fa fa-user"}
            name={"Admin categories"}
            onCloseNav={this.handleCloseNav}
          />
          <NavLink
            pathname={""}
            className={"fa fa-sign-out"}
            name={"Logout"}
            onLogout={this.handleLogout}
          />
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <NavLink
            pathname={"/login"}
            className={"fa fa-sign-in"}
            name={"Login"}
            onCloseNav={this.handleCloseNav}
          />
          <NavLink
            pathname={"/register"}
            className={"fa fa-user-plus"}
            name={"Register"}
            onCloseNav={this.handleCloseNav}
          />
        </React.Fragment>
      );
    }
  };

  render() {
    const { loading } = this.state;
    return (
      <React.Fragment>
        {loading ? showLoading() : null}
        <nav className="teal blue-grey">
          <div className="nav-wrapper container">
            <Link to="/" className="brand-logo">
              MyRecipe
            </Link>
            <Link
              to="#"
              data-target="mobile-demo"
              className="sidenav-trigger show-on-med "
            >
              <i className="fa fa-bars fa-2x" aria-hidden="true"></i>
            </Link>

            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <NavLink
                pathname={"/recipes"}
                className={"fa fa-book"}
                name={"Public Recipies"}
              />
              {this.NavBar()}
            </ul>
          </div>
        </nav>

        <ul className="sidenav" id="mobile-demo">
          <NavLink
            pathname={"/recipes"}
            className={"fa fa-book"}
            name={"Public Recipies"}
            onCloseNav={this.handleCloseNav}
          />
          <li className="divider"></li>
          {this.NavBarResponsive()}
        </ul>
      </React.Fragment>
    );
  }
}

export default withRouter(NavBar);
