import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "../helper/auth";
const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? <Component {...props} /> : <Redirect to="/login" />
    }
  />
);

export default PrivateRoute;
