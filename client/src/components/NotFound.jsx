import React, { Component } from "react";
import { Link } from "react-router-dom";
class NotFound extends Component {
  render() {
    return (
      <div className="not-found valign-wrapper center-align">
        <div className="row">
          <div className="card-content">
            <h1>Error 404</h1>
            <h5>Page Not Found</h5>
            <Link to="/recipes" className="btn">
              Home page
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default NotFound;
