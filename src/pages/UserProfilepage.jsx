import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames";
import Header from "../components/Header/Header";
import Line from "../components/Line/Line";
import Course from "../components/Course/Course";
import { supabase, fetchEnrollmentsByUserId, fetchAllCourses } from "../../supabase";
import { AuthContext } from "../../AuthProvider";

const UserProfilePage = ({ className, parsedUserId }) => {
  const { user } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const classes = classNames([className, "profile"]);
  useEffect(() => {
    async function fetchData() {
      if (user) {
        // console.log(user);
        const userEnrollments = await fetchEnrollmentsByUserId(user.id);
        const courses = await fetchAllCourses();

        // console.log("userEnrollments:", userEnrollments);
        // console.log("courses:", courses);

        if (userEnrollments && courses) {
          const updatedEnrollments = userEnrollments.map((enrollment) => {
            const courseId = enrollment.course_id;
            const course = courses.find((c) => c.id === courseId);
            return {
              ...enrollment,
              course: course || null,
            };
          });

          setEnrollments(updatedEnrollments);
          // console.log(enrollments);
        }
      }
    }

    fetchData();
  }, [user]);

  // Store enrollments in local storage
  useEffect(() => {
    localStorage.setItem("enrollments", JSON.stringify(enrollments));
  }, [enrollments]);
  // console.log(enrollments);
  // Retrieve enrollments from local storage on page load
  useEffect(() => {
    const storedEnrollments = localStorage.getItem("enrollments");
    if (storedEnrollments) {
      setEnrollments(JSON.parse(storedEnrollments));
    }
  }, []);

  return (
    <div className={classes}>
      <Header theme="dark" currentPage="profile" />
      <h2>My profile</h2>
      <h4>My goals</h4>
      <div className="goal">
        <p>this month</p>
        {/* <h5>
          {days} Days/ {goal} Days
        </h5> */}
        <img src="https://nikolettdkny.dk/images/clippy.gif" alt="an animation of a clipper" />
      </div>
      <Line />
      {/* <div>
        <h4>My courses</h4>
        <h3>In progress</h3>
        <h3>Finished</h3>
      </div>
      <Line /> */}
    </div>
  );
};

export default UserProfilePage;
