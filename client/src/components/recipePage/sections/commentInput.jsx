import React from "react";
const CommentInput = ({ onChange, onSubmit, value, name, replyId }) => {
  return (
    <div className="row">
      <form
        id={replyId ? replyId : "default"}
        name={name}
        className="col s12"
        onSubmit={onSubmit}
      >
        <div className="row">
          <div className="input-field col s8 ">
            <textarea
              name={name}
              onChange={onChange}
              value={value}
              className="materialize-textarea"
              data-length="120"
            ></textarea>
            <label htmlFor={name}>Comment</label>
          </div>
          <div className="col s4 valign-wrapper">
            <input type="submit" value="Save" className="btn valign" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommentInput;
