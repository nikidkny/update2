import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import Line from "../../components/Line/Line";
import { supabase } from "../../../supabase";
import Post from "../Post/Post";

const PostList = ({ className, handlePostClick }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  var classes = classNames([className, "postlist"]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error.message);
    } else {
      const postsWithDate = data.map((post) => {
        return {
          ...post,
          date: new Date(post.date), // Convert the server timestamp to a JavaScript Date object
        };
      });
      setPosts(postsWithDate);
    }
  };
  const getTimeElapsed = (date) => {
    const postDate = date.getTime();
    const currentDate = new Date().getTime(); // Use the current date and time on the client side
    const timeDifference = currentDate - postDate;

    const minutes = Math.floor(timeDifference / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) {
      return `${minutes} m`;
    } else if (hours < 24) {
      return `${hours} h`;
    } else {
      return `${days} d`;
    }
  };
  const truncateContent = (content, maxLength) => {
    if (content.length > maxLength) {
      return content.slice(0, maxLength) + "...";
    }
    return content;
  };

  return (
    <div className={classes}>
      <h3>All Posts</h3>
      <div className="titles">
        <h5>Title</h5>
        <h5>Description</h5>
        <h5>Topics</h5>
        <h5>Comments</h5>
        <h5>Posted</h5>
        <h5>Ratings</h5>
      </div>
      <Line />
      {filteredPosts.length === 0 &&
        posts.map((post) => (
          <div className="postlist--item" key={post.id}>
            <div className="postlist--item--content">
              <h5>{post.title}</h5>
              <p className="description">{truncateContent(post.content, 100)}</p>
              <div className="topics">
                {Array.isArray(post.topics) &&
                  post.topics.map((topic, index) => <p key={index}>{topic.topic}</p>)}
              </div>
              <p className="comment">{post.comments ? post.comments.length : 0}</p>
              <p>{getTimeElapsed(post.date)}</p>
              <div className="icons">
                <i>
                  <FontAwesomeIcon icon={faHeart} />
                  <p>{post.likes}</p>
                </i>
                <i>
                  <FontAwesomeIcon icon={faThumbsDown} />
                  <p>{post.dislikes}</p>
                </i>
              </div>
            </div>
            <div className="button-container">
              <button onClick={() => handlePostClick(post)}>
                Open Post
                <div className="arrow"></div>
              </button>
            </div>

            <Line />
          </div>
        ))}
    </div>
  );
};

export default PostList;
