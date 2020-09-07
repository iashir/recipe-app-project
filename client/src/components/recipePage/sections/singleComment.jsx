import React from "react";
import moment from "moment";
import { Header, Comment } from "semantic-ui-react";
import { Link } from "react-router-dom";
import ReplyComments from "./replyComments";
import CommentInput from "./commentInput";
import LikeDislike from "../../common/LikeDislike";
const SingleComment = ({
  comments,
  imageProf,
  showReplyInput,
  openReply,
  onChange,
  onSubmit,
  newReplyComment,
  replyId,
  repliedComments,
}) => {
  let userId;
  if (localStorage.getItem("user")) {
    let user = JSON.parse(localStorage.getItem("user"));
    userId = user._id;
  }
  return (
    <div className="row">
      <Comment.Group>
        <Header as="h3" dividing>
          Comments
        </Header>
        {comments.map((comment) => (
          <Comment key={comment._id}>
            <Comment.Avatar
              src={comment.user.image === "" ? imageProf : comment.user.image}
            />
            <Comment.Content>
              <Comment.Author as={Link} to={"/account/" + comment.user._id}>
                {comment.user.username}
              </Comment.Author>
              <Comment.Metadata>
                <div>{moment(comment.createdAt).format("LLLL")}</div>
              </Comment.Metadata>
              <Comment.Text>
                <p>{comment.content}</p>
              </Comment.Text>
              <Comment.Actions>
                <LikeDislike
                  comment
                  commentId={comment._id}
                  userId={localStorage.getItem("user") ? userId : null}
                />
                <Comment.Action
                  onClick={() =>
                    showReplyInput(comment._id, comment._id, comment.user._id)
                  }
                >
                  Reply
                </Comment.Action>
                {openReply && replyId === comment._id ? (
                  <CommentInput
                    onSubmit={onSubmit}
                    onChange={onChange}
                    value={newReplyComment}
                    name="newReplyComment"
                    replyId={replyId}
                  />
                ) : null}
              </Comment.Actions>
            </Comment.Content>
            {repliedComments.map((repliedComment) =>
              repliedComment.parentComment === comment._id ? (
                <React.Fragment key={repliedComment._id}>
                  <ReplyComments
                    comment={repliedComment}
                    imageProf={imageProf}
                    showReplyInput={showReplyInput}
                    openReply={openReply}
                    onSubmit={onSubmit}
                    onChange={onChange}
                    newReplyComment={newReplyComment}
                    replyId={replyId}
                    parentCommentId={comment._id}
                    userId={userId}
                  />
                </React.Fragment>
              ) : null
            )}
          </Comment>
        ))}
      </Comment.Group>
    </div>
  );
};

export default SingleComment;
