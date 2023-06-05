import React, { useState, useEffect } from "react";
import classNames from "classnames";
import Header from "../components/Header/Header";
import Line from "../components/Line/Line";
import Course from "../components/Course/Course";
import { supabase, fetchAllCourses } from "../../supabase";
import InputCheckbox from "../components/InputCheckbox/InputCheckbox";

const CoursesPage = ({ className }) => {
  const [courses, setCourses] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const classes = classNames([className, "courses"]);

  useEffect(() => {
    async function fetchData() {
      const fetchedCourses = await fetchAllCourses();

      if (fetchedCourses) {
        setCourses(fetchedCourses);
      }
    }

    fetchData();
  }, []);

  const handleTagChange = (tag, checked) => {
    setSelectedTags((prevTags) => {
      if (checked) {
        return [...prevTags, tag];
      } else {
        return prevTags.filter((t) => t !== tag);
      }
    });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const renderInputCheckBoxes = (courses) => {
    const allTagsSet = new Set();
    courses.forEach((course) => {
      if (course.metadata && course.metadata.tag) {
        course.metadata.tag.forEach((tag) => {
          allTagsSet.add(tag);
        });
      }
    });

    const allTags = Array.from(allTagsSet);

    const tagCounts = {};

    courses.forEach((course) => {
      if (course.metadata && course.metadata.tag) {
        course.metadata.tag.forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    return allTags.map((tag, index) => (
      <InputCheckbox
        key={index}
        id={`checkbox-${index}`}
        name={tag}
        label={`${tag} (${tagCounts[tag]})`}
        checked={selectedTags.includes(tag)}
        onChange={(e) => handleTagChange(tag, e.target.checked)}
      />
    ));
  };

  const filteredCourses = courses.filter((course) => {
    if (selectedTags.length === 0) {
      return true; // Show all courses if no tags are selected
    }
    if (course.metadata && course.metadata.tag) {
      return course.metadata.tag.some((tag) => selectedTags.includes(tag));
    }
    return false;
  });

  const searchResults = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFocus = (e) => {
    e.target.parentNode.classList.add("search-bar--focused");
  };

  const handleBlur = (e) => {
    e.target.parentNode.classList.remove("search-bar--focused");
  };

  return (
    <div className={classes}>
      <Header theme="dark" />
      <div className="courses-main">
        <div className="hero">
          <h1>Courses</h1>
          <label className="search-bar">
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
          </label>
        </div>
        <Line className="decoration" />
        <div className="courses-main_content">
          <aside>
            <h5>Filters</h5>
            <h5>Topic</h5>
            {renderInputCheckBoxes(courses)}
          </aside>
          <div className="courses-main_content_course">
            {searchQuery ? (
              searchResults.length === 0 ? (
                <h3 className="no-results">No results</h3>
              ) : (
                searchResults.map((course) => (
                  <Course
                    key={course.id}
                    courseId={course.id}
                    title={course.title}
                    description={course.description}
                    metadata={course.metadata}
                  />
                ))
              )
            ) : filteredCourses.length === 0 ? (
              <p className="no-results">No results</p>
            ) : (
              filteredCourses.map((course) => (
                <Course
                  key={course.id}
                  courseId={course.id}
                  title={course.title}
                  description={course.description}
                  metadata={course.metadata}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
