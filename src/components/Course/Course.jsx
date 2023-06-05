import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { supabase } from "../../../supabase";
import { AuthContext } from ".././../../AuthProvider";

export default function Course({ courseId, title, progress, metadata, duration, description }) {
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

  const handleButtonClick = async () => {
    if (lessons.length > 0) {
      const firstLessonId = lessons[0].id;
      console.log("First Lesson ID:", firstLessonId);

      try {
        const { data: lessonData, error: lessonError } = await supabase
          .from("lessons")
          .select("title")
          .eq("id", firstLessonId)
          .limit(1);

        if (lessonError) {
          throw new Error(lessonError.message);
        }

        console.log("Lesson Data:", lessonData);

        if (lessonData && lessonData.length > 0) {
          navigate(`/lesson/${courseId}/${firstLessonId}`);
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
      <h5>{title}</h5>
      {description && <p>{description}</p>}
      {metadata && metadata.tag && <p>{metadata.tag}</p>}
      {lessons.length > 0 ? (
        <button onClick={handleButtonClick}>Start course</button>
      ) : (
        <p>No lessons available for this course.</p>
      )}
    </div>
  );
}
