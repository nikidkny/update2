import React, { useState, useEffect } from "react";
import PostList from "../PostList/PostList";
import Post from "../Post/Post";
import { supabase } from "../../../supabase";
import Header from "../../components/Header/Header";
import Line from "../../components/Line/Line";
import classNames from "classnames";

const Forum = ({ handleUpdateComments, className }) => {
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  var classes = classNames([className, "forum"]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase.from("posts").select("*");
    if (error) {
      console.error("Error fetching posts:", error.message);
    } else {
      setPosts(data);
    }
  };
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  const addPost = async (title, content) => {
    const date = new Date(); // Get the current date and time
    const newPost = {
      title,
      content,
      date, // Use the current date as the post's creation time
      likes: 0,
      dislikes: 0,
      comments: [],
      topics: [{ topic: selectedTopic, topic_id: "1" }],
    };

    const { data, error } = await supabase.from("posts").insert([newPost]);
    if (error) {
      console.error("Error adding post:", error.message);
    } else {
      // Update the local state with the newly created post
      setPosts((prevPosts) => [...prevPosts, newPost]);

      // Fetch the updated list of posts from the database
      fetchPosts();

      // Reset the topic input field
      setSelectedTopic("");
    }
  };

  const handleLike = async () => {
    setLikes(likes + 1);
    const { data, error } = await supabase
      .from("posts")
      .update({ likes: likes + 1 })
      .eq("id", currentPost.id);
    if (error) {
      console.error("Error updating likes:", error.message);
    }
  };

  const handleDislike = async () => {
    setDislikes(dislikes + 1);
    const { data, error } = await supabase
      .from("posts")
      .update({ dislikes: dislikes + 1 })
      .eq("id", currentPost.id);
    if (error) {
      console.error("Error updating dislikes:", error.message);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText) return;

    const newComment = {
      id: Date.now(),
      text: commentText,
    };
    setComments([...comments, newComment]);

    const updatedComments = [...currentPost.comments, newComment];
    const { data, error } = await supabase
      .from("posts")
      .update({ comments: updatedComments })
      .eq("id", currentPost.id);
    if (error) {
      console.error("Error updating comments:", error.message);
    }
  };

  const handlePostClick = (post) => {
    setCurrentPost(post);
    setLikes(post.likes);
    setDislikes(post.dislikes);
    setComments(post.comments);
  };

  const handleBack = () => {
    setCurrentPost(null);
    setLikes(0);
    setDislikes(0);
    setComments([]);
  };
  // const searchResults = posts.filter((post) =>
  //   post.title.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  // const handleFocus = (e) => {
  //   e.target.parentNode.classList.add("search-bar--focused");
  // };

  // const handleBlur = (e) => {
  //   e.target.parentNode.classList.remove("search-bar--focused");
  // };

  return (
    <div className={classes}>
      <div className="hero">
        <Header />
        <h1>Forum</h1>
        {/* <label className="search-bar">
          <input
            className="search-bar_field"
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <i className="search-bar_icon">
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
        </label> */}
      </div>
      <Line />
      {currentPost ? (
        <Post
          post={currentPost}
          likes={likes}
          dislikes={dislikes}
          comments={comments}
          topics={currentPost.topics}
          handleBack={handleBack}
          handleLike={handleLike}
          handleDislike={handleDislike}
          handleCommentSubmit={handleCommentSubmit}
          handleUpdateComments={handleUpdateComments}
        />
      ) : (
        <React.Fragment>
          <PostList
            posts={posts}
            handlePostClick={handlePostClick}
            handleUpdateComments={handleUpdateComments}
          />
          <form
            className="new-post"
            onSubmit={(e) => {
              e.preventDefault();
              const title = e.target.elements.title.value;
              const content = e.target.elements.content.value;
              addPost(title, content);
              e.target.reset();
            }}
          >
            <div className="input-container">
              <textarea name="title" placeholder="Post Title" maxLength={50} />
              <textarea name="content" placeholder="Post Content" />
              <textarea
                name="topic"
                placeholder="Post Topic"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              />
            </div>

            <button type="submit">Add New Post</button>
          </form>
        </React.Fragment>
      )}
    </div>
  );
};

export default Forum;
