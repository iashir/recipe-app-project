import React, { useEffect, useState } from "react";
import moment from "moment";
import LikeDislike from "../../common/LikeDislike";
import ProfilePhoto from "../../common/profilePhoto";
const RecipeInfo = ({ recipe, user }) => {
  // Hook
  const size = useWindowSize();

  function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });

    useEffect(() => {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }

      // Add event listener
      window.addEventListener("resize", handleResize);

      // Call handler right away so state gets updated with initial window size
      handleResize();

      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }, [windowSize.width]); // Empty array ensures that effect is only run on mount

    return windowSize;
  }

  if (size.width <= 639) {
    return (
      <main className="container">
        <div className="row ">
          <div className="col s12 recipe-content">
            <ProfilePhoto user={recipe.user} recipeComponent />
          </div>
          <div className="col s12 recipe-content">
            <div className="card">
              <div className="card-image">
                <img
                  src={recipe.recipeImageLocation}
                  alt={recipe.recipeImageName}
                />
              </div>
              <div className="card-content">
                <span className="card-title">
                  <h3>{recipe.title}</h3>
                </span>
                <p>{moment(recipe.createdAt).format("LLLL")}</p>
                <br />
                <div class="divider"></div>
                <span className="card-title">
                  <h3>Ingredients</h3>
                </span>
                <p className="pre-wrap" style={{ marginBottom: "16px" }}>
                  {recipe.ingredients}
                </p>
                <div class="divider"></div>
                <span className="card-title">
                  <h3>Instructions</h3>
                </span>
                <p className="pre-wrap" style={{ marginBottom: "16px" }}>
                  {recipe.body}
                </p>
                <LikeDislike recipe recipeId={recipe._id} />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } else {
    return (
      <React.Fragment>
        <div className="row">
          <div className="parallax-container col s12">
            <div className="parallax">
              <img
                className="responsive-img"
                src={recipe.recipeImageLocation}
                alt={recipe.recipeImageName}
              />
            </div>
          </div>
        </div>

        <main className="container">
          <div className="row ">
            <div className="col s12 m4 l4 recipe-content">
              <ProfilePhoto user={recipe.user} recipeComponent />
            </div>
            <div className="col s12 m8 l8 recipe-content">
              <div className="card">
                <div className="card-content">
                  <span className="card-title">
                    <h3>{recipe.title}</h3>
                  </span>
                  <p>{moment(recipe.createdAt).format("LLLL")}</p>
                  <br />
                  <div class="divider"></div>
                  <span className="card-title">
                    <h3>Ingredients</h3>
                  </span>
                  <p className="pre-wrap" style={{ marginBottom: "16px" }}>
                    {recipe.ingredients}
                  </p>
                  <div class="divider"></div>
                  <span className="card-title">
                    <h3>Instructions</h3>
                  </span>
                  <p className="pre-wrap" style={{ marginBottom: "16px" }}>
                    {recipe.body}
                  </p>
                  <LikeDislike recipe recipeId={recipe._id} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </React.Fragment>
    );
  }
};

export default RecipeInfo;
