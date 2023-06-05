import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import Line from "../../globals/Line/Line";
import { supabase } from "../../../../supabase";
import Post from "../Post/Post";

const PostList = ({ className, handlePostClick }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  var classes = classNames([className, "postlist"]);
  const searchBarClasses = classNames("search", {
    "search--focused": isFocused,
  });
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

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.comments.some((comment) => comment.toLowerCase().includes(query.toLowerCase())) ||
        post.content.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  return (
    <div className={classes}>
      <div>
        <label className={searchBarClasses} htmlFor="searchInput">
          <input
            type="text"
            id="searchInput"
            name="search"
            placeholder="Search"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="search__field"
            value={searchQuery}
            onChange={handleSearch}
          />
          <i type="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
          </i>
        </label>
      </div>
      {searchQuery && filteredPosts.length > 0 && (
        <div className="search-results">
          <h5>Search Results</h5>
          {filteredPosts.map((post) => (
            <div className="search-result-item" key={post.id}>
              <h5>{post.title}</h5>
              <p>{post.content}</p>
            </div>
          ))}
          <Line />
        </div>
      )}
      <h5>All Posts</h5>
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
