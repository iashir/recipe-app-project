import React from "react";
import { Comment } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import CommentInput from "./commentInput";
import LikeDislike from "../../common/LikeDislike";
const ReplyComments = ({
  comment,
  imageProf,
  showReplyInput,
  openReply,
  replyId,
  onSubmit,
  onChange,
  newReplyComment,
  parentCommentId,
  userId,
}) => {
  return (
    <Comment.Group>
      <Comment>
        <Comment.Avatar
          src={comment.user.image ? comment.user.image : imageProf}
        />
        <Comment.Content>
          <Comment.Author as={Link} to={"/account/" + comment.user._id}>
            {comment.user.username}
          </Comment.Author>
          <Comment.Metadata>
            <div>{moment(comment.createdAt).format("LLLL")}</div>
          </Comment.Metadata>
          <Comment.Text>
            <Comment.Author as={Link} to={"/account/" + comment.responseTo._id}>
              {"@" + comment.responseTo.username + "  "}
            </Comment.Author>
            {comment.content}
          </Comment.Text>
          <Comment.Actions>
            <LikeDislike
              comment
              commentId={comment._id}
              userId={localStorage.getItem("user") ? userId : null}
            />
            <Comment.Action
              onClick={() =>
                showReplyInput(comment._id, parentCommentId, comment.user._id)
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
      </Comment>
    </Comment.Group>
  );
};

export default ReplyComments;
