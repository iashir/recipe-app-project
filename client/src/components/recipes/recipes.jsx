import React, { Component } from "react";
import axios from "axios";
import { showLoading } from "../helper/loading";
import AOS from "aos";
import "aos/dist/aos.css";
import { paginate } from "../helper/paginate";
import Pagination from "../common/pagination";
import M from "materialize-css";
import { isAuthenticated } from "../helper/auth";
import SelectInput from "./sections/selectInput";
import RecipeCard from "../common/recipeCard";
import SearchInput from "../common/searchInput";

const imageProf = require("../../public/uploads/chef2.jpg");

class Recipes extends Component {
  state = {
    recipes: [],
    loading: false,
    categories: [],
    currentPage: 1,
    pageSize: 6,
    searchQuery: "",
    selectedCategory: "",
  };

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
      selectedCategory: "",
      currentPage: 1,
    });
  };
  handleSearchClose = () => {
    this.setState({ searchQuery: "" });
  };
  componentDidMount = () => {
    AOS.init();
    var elems = document.querySelectorAll(".materialboxed");
    M.Materialbox.init(elems);
    this.setState({ loading: true });
    if (isAuthenticated()) {
      let { _id } = JSON.parse(localStorage.user);
      this.setState({ userId: _id });
    }
    if (window.location.pathname === "/subscriptions") {
      let { _id } = JSON.parse(localStorage.user);
      axios
        .post("/api/recipes/getSubscriptionRecipes", {
          userFrom: _id,
        })
        .then((res) => {
          if (res.data.success) {
            this.setState({ recipes: res.data.recipes, loading: false });
          } else {
            alert("fail");
          }
        });
    } else {
      axios.get("/api/recipes").then(({ data: recipes }) => {
        this.setState({ recipes, loading: false });
      });
    }
    axios.get("/api/categories").then(({ data: categories }) => {
      this.setState({ categories });
      M.AutoInit();
    });
  };
  componentDidUpdate = (prevProps) => {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({ loading: true });
      if (window.location.pathname === "/subscriptions") {
        let { _id } = JSON.parse(localStorage.user);
        axios
          .post("/api/recipes/getSubscriptionRecipes", {
            userFrom: _id,
          })
          .then((res) => {
            if (res.data.success) {
              this.setState({ recipes: res.data.recipes, loading: false });
            } else {
              alert("fail");
            }
          });
      } else {
        axios.get("/api/recipes").then(({ data: recipes }) => {
          this.setState({ recipes, loading: false });
        });
      }
    }
  };
  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleCategorySelect = (e) => {
    console.log(e.target.value);
    this.setState({
      selectedCategory: e.target.value,
      searchQuery: "",
      currentPage: 1,
    });
  };

  handleSearch = (e) => {
    e.preventDefault();
    this.setState({
      selectedCategory: "",
      currentPage: 1,
    });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      selectedCategory,
      searchQuery,
      recipes: allRecipes,
    } = this.state;

    let filtered = allRecipes;
    if (searchQuery)
      filtered = allRecipes.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedCategory && selectedCategory !== "")
      filtered = allRecipes.filter(
        (recipe) => recipe.category._id === selectedCategory
      );

    const recipes = paginate(filtered, currentPage, pageSize);

    return { totalCount: filtered.length, data: recipes };
  };

  render() {
    const {
      pageSize,
      currentPage,
      loading,
      searchQuery,
      categories,
      selectedCategory,
    } = this.state;
    const { totalCount, data } = this.getPagedData();

    return (
      <div className="container">
        <div className="row">
          {loading ? showLoading() : null}
          <div className="col s12 m3">
            <div className="nav-wrapper white">
              <SearchInput
                onChange={this.handleChange}
                onSearchClose={this.handleSearchClose}
                searchQuery={searchQuery}
                onSearch={this.handleSearch}
              />
              <SelectInput
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={this.handleCategorySelect}
              />
            </div>
          </div>
          <div className="col s12 m9">
            <RecipeCard recipes={data} imageProf={imageProf} />
            <div className="row">
              <Pagination
                itemsCount={totalCount}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={this.handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Recipes;
