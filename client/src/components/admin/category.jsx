import React, { Component } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { showLoading } from "../helper/loading";

class Category extends Component {
  state = { type: "", loading: false };
  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    axios
      .post("/api/categories", { type: this.state.type })
      .then(({ data }) => {
        toast.success(`${data}`, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        this.setState({ type: "", loading: false });
      })
      .catch(() => {
        toast.error(`error`, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        this.setState({ type: "", loading: false });
      });
  };
  render() {
    const { loading } = this.state;
    return (
      <div className="container">
        {loading ? showLoading() : null}
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="input-field col s6">
              <input
                onChange={this.handleChange}
                id="type"
                type="text"
                className="validate"
              />
              <label htmlFor="type">Category</label>
            </div>
            <input type="submit" className="btn" />
          </div>
        </form>
      </div>
    );
  }
}

export default Category;
