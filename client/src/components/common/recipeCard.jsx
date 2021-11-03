import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import LikeDislike from "../common/LikeDislike";
import AOS from "aos";

const RecipeCard = ({ recipes, imageProf, recipesLength }) => {
  useEffect(() => {
    AOS.init();
  }, []);

  if (recipes.length !== 0) {
    return (
      <React.Fragment>
        {recipesLength ? <p>Recipes posted: {recipesLength}</p> : null}
        {recipes.map((data) => (
          <div className="col s12 l6" data-aos="fade-up" key={data._id}>
            <div className="card large hoverable">
              <div className="card-image">
                <img
                  src={data.recipeImageLocation}
                  alt={data.recipeImageName}
                ></img>
                {data.status === "private" && (
                  <span
                    className="card-title card-panel red"
                    style={{ padding: "3px", fontSize: "1rem" }}
                  >
                    Subscribers only
                  </span>
                )}
              </div>
              <div className="card-content center-align">
                <span className="card-title truncate">{data.title}</span>
                <div className="flow-tex">Category: {data.category.type}</div>
                <div className="chip">
                  <img
                    src={data.user.image === "" ? imageProf : data.user.image}
                    alt={data.user.username}
                  ></img>

                  <Link to={"/account/" + data.user._id}>
                    {data.user.username}
                  </Link>
                </div>
                <div style={{ marginTop: "8px" }} className="center-align ">
                  <LikeDislike recipe recipeId={data._id} />
                </div>
              </div>
              <div className="card-action">
                <div className="center-align">
                  <Link
                    style={{ margin: "8px" }}
                    className="btn btn-small"
                    to={"/recipes/" + data._id}
                  >
                    Read more
                  </Link>
                  <div style={{ fontSize: "0.7rem", fontStyle: "italic" }}>
                    {moment(data.createdAt).format("LLLL")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </React.Fragment>
    );
  } else {
    return <p>No recipes</p>;
  }
};

export default RecipeCard;
