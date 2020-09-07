import React from "react";

export const showLoading = () => {
  return (
    <div className="valign-wrapper loading ">
      <div className="container">
        <div className="progress">
          <div className="indeterminate"></div>
        </div>
      </div>
    </div>
  );
};
