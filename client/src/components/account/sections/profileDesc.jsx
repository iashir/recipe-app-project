import React from "react";
import moment from "moment";

const ProfileDesc = ({ user }) => {
  return (
    <div className="card">
      <div className="card-content">
        <p>
          {user.firstName} {user.lastName}
        </p>
        <p>{user.email}</p>
        <p>User created: {moment(user.createdAt).fromNow()}</p>
      </div>
    </div>
  );
};

export default ProfileDesc;
