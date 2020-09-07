import React from "react";
import Subscribe from "./subscribe";
import { Link } from "react-router-dom";
const imageProf = require("../../public/uploads/chef2.jpg");

const ProfilePhoto = ({
  user,
  subscribed,
  onFollowersUpdate,
  recipeComponent,
}) => {
  return (
    <div className="card center-align">
      <div className="card-content">
        <img
          className="circle responsive-img img-small"
          style={{ objectFit: "contain", width: "70%" }}
          src={user.image === "" ? imageProf : user.image}
          alt={user ? "Image of " + user.username : null}
        ></img>
        {recipeComponent ? (
          <p>
            <Link to={"/account/" + user._id}>{user.username}</Link>
          </p>
        ) : (
          <p>{user.username}</p>
        )}

        <Subscribe
          userId={user._id}
          onFollowersUpdate={onFollowersUpdate}
          subscribed={subscribed}
        />
      </div>
    </div>
  );
};

export default ProfilePhoto;
