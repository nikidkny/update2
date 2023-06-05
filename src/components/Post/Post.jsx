import { useState, useEffect } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHeart, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import Comment from "../Comment/Comment";
import classNames from "classnames";
import { supabase } from "../../../supabase";

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
        <h2>{post.title}</h2>
        <p>Author: {authorName}</p>
        <p>{post.content}</p>
        <p>Posted on: {new Date(post.date).toLocaleString()}</p>
        {topics && topics.length > 0 && (
          <p>Topics: {topics.map((topic) => topic.topic).join(", ")}</p>
        )}
        <div>
          <p>
            <FontAwesomeIcon icon={faHeart} onClick={handleLike} />
            {likes}
          </p>
          <p>
            <FontAwesomeIcon icon={faThumbsDown} onClick={handleDislike} />
            {dislikes}
          </p>
        </div>
        <p>Comments: {comments.length}</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const text = e.target.elements.comment.value;
            addComment(text);
            e.target.reset();
          }}
        >
          <input
            type="text"
            name="comment"
            placeholder="Enter your comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button type="submit">Comment</button>
        </form>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default Post;
