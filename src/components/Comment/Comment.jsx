import React from "react";

const Comment = ({ comment }) => {
  return <p className="comment-dec">{comment.text}</p>;
};

export default Comment;
