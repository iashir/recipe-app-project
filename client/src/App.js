import "./App.css";
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Recipes from "./components/recipes/recipes";
import Login from "./components/login";
import Register from "./components/register";
import AddRecipe from "./components/addRecipe";
import NavBarComponent from "./components/Navbar/NavBar";
import EditRecipe from "./components/editRecipe";
import MyRecipes from "./components/myRecipes";
import AdminRecipes from "./components/admin/recipes";
import AdminCategories from "./components/admin/category";
import AdminEditRecipes from "./components/admin/editRecipe";
import NotFound from "./components/NotFound";
import Recipe from "./components/recipePage/recipe";
import PrivateRoute from "./components/private-route/privateRoute";
import AdminRoute from "./components/private-route/adminRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Account from "./components/account/account";

function App() {
  return (
    <React.Fragment>
      <NavBarComponent />
      <Switch>
        <Route exact path="/recipes" component={Recipes} />
        <PrivateRoute exact path="/subscriptions" component={Recipes} />
        <PrivateRoute exact path="/account" component={Account} />
        <PrivateRoute exact path="/my-recipes" component={MyRecipes} />
        <PrivateRoute
          exact
          path="/my-recipes/edit/:id"
          component={EditRecipe}
        />
        <PrivateRoute exact path="/my-recipes/add" component={AddRecipe} />
        <AdminRoute exact path="/admin/recipes" component={AdminRecipes} />
        <AdminRoute exact path="/admin/edit/:id" component={AdminEditRecipes} />
        <AdminRoute
          exact
          path="/admin/categories"
          component={AdminCategories}
        />

        <Route exact path="/recipes/:id" component={Recipe} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/account/:id" component={Account} />

        <Route path="/not-found" component={NotFound} />
        <Redirect exact from="/" to="/recipes"></Redirect>
        <Redirect to="/not-found" component={NotFound}></Redirect>
      </Switch>
      <ToastContainer />
    </React.Fragment>
  );
}

export default App;
