import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { supabase } from "../../../supabase";
import { AuthContext } from ".././../../AuthProvider";

export default function Course({
  courseId,
  title,
  progress,
  metadata,
  duration,
  description,
  image_url,
}) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from("lessons")
          .select("*")
          .order("id")
          .eq("course_id", courseId);

        if (error) {
          throw new Error(error.message);
        }

        setLessons(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [courseId]);
  // console.log("before handle btn", lessons);

  const handleButtonClick = async () => {
    // console.log("user: ", user);
    if (lessons.length > 0) {
      const firstLessonId = lessons[0].id;
      // console.log("First Lesson ID:", firstLessonId);
      // console.log(user.id);

      try {
        const {
          data: enrollmentData,
          error: enrollmentError,
          response,
        } = await supabase.from("enrollments").insert([
          {
            course_id: courseId,
            user_id: user.id,
            lesson_id: firstLessonId,
            completion_status: false,
          },
        ]);
        // console.log("Insert response:", response);
        // console.log("Enrollment Data:", enrollmentData);
        // console.log("Enrollment error:", enrollmentError);
        if (enrollmentError) {
          throw new Error(enrollmentError.message);
        }

        const { data: lessonData, error: lessonError } = await supabase
          .from("lessons")
          .select("title")
          .eq("id", firstLessonId)
          .order("id")
          .limit(1);

        if (lessonError) {
          throw new Error(lessonError.message);
        }

        // console.log("Lesson Data:", lessonData);

        if (lessonData && lessonData.length > 0) {
          navigate(`/course/${courseId}/lesson/${firstLessonId}`);
        } else {
          console.error("Lesson data not found or empty.");
        }
      } catch (error) {
        console.error("Error fetching lesson title:", error);
      }
    } else {
      console.error("Lesson data not found or empty.");
    }
  };

  return (
    <div className="course">
      {image_url && <img src={image_url} alt="course Image" />}
      <h5>{title}</h5>
      {description && <p>{description}</p>}
      {metadata && metadata.tag && <p>{metadata.tag}</p>}
      {lessons.length > 0 ? (
        <div className="button-container">
          <button onClick={handleButtonClick}>
            Start course
            <svg
              className="arrow-icon right-arrow"
              id="Layer_2"
              xmlns="http://www.w3.org/2000/svg"
              width="37"
              height="6"
              viewBox="0 0 37 6"
            >
              <g id="Layer_2-2">
                <polygon points="0 4 34 4 33 6 37 3 33 0 34 2 0 2 0 4" fill="#200bd1" />
              </g>
            </svg>
          </button>
        </div>
      ) : (
        <p>No lessons available for this course.</p>
      )}
    </div>
  );
}
