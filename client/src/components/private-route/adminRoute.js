import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "../helper/auth";
const AdminRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() && isAuthenticated().role === 1 ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

export default AdminRoute;
