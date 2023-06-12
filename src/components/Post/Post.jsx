import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import Comment from "../Comment/Comment";
import classNames from "classnames";
import { supabase } from "../../../supabase";
import Line from "../Line/Line";

const Post = ({
  className,
  post,
  handleBack,
  handleLike,
  handleDislike,
  handleUpdateComments,
  likes,
  dislikes,
  topics,
}) => {
  const classes = classNames([className, "post"]);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [authorName, setAuthorName] = useState("");

  useEffect(() => {
    setComments(post.comments || []);
    fetchAuthorName();
  }, [post]);

  const fetchAuthorName = async () => {
    // Fetch the author's name from the Supabase database
    const { data: userData, error } = await supabase
      .from("users")
      .select("name")
      .eq("id", parseInt(post.user_id, 10))
      .single();

    if (error) {
      console.error("Error fetching author's name:", error);
    } else {
      setAuthorName(userData.name);
    }
  };

  const addComment = async (text) => {
    const newComment = {
      id: Date.now(),
      text,
    };
    const updatedComments = [...comments, newComment];

    // Update the comments in the Supabase database
    await supabase.from("posts").update({ comments: updatedComments }).eq("id", post.id);

    setComments(updatedComments);
    handleUpdateComments(post.id, updatedComments); // Notify parent component about the updated comments
  };

  return (
    <div className={classes}>
      <button onClick={handleBack}>Back</button>
      <div className="post-content">
        <div className="title">
          <h4>{post.title}</h4>
        </div>

        <div className="description">
          <p>{post.content}</p>
        </div>
        <div className="details">
          <p>Author: {authorName}</p>
          <p>Posted on: {new Date(post.date).toLocaleString()}</p>
          {topics && topics.length > 0 && (
            <p>Topics: {topics.map((topic) => topic.topic).join(", ")}</p>
          )}
        </div>
        <div className="interaction">
          <p>
            <FontAwesomeIcon icon={faHeart} onClick={handleLike} />
            {likes}
          </p>
          <p>
            <FontAwesomeIcon icon={faThumbsDown} onClick={handleDislike} />
            {dislikes}
          </p>
        </div>
        <div className="comments">
          <Line />
          <p>Comments ({comments.length}): </p>
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
          <Line />

          <form
            className="add-comment"
            onSubmit={(e) => {
              e.preventDefault();
              const text = e.target.elements.comment.value;
              addComment(text);
              e.target.reset();
            }}
          >
            <textarea
              minLength={5}
              name="comment"
              placeholder="Enter your comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit">Comment</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Post;
