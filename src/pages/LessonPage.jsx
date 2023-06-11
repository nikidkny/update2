import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import Header from "../components/Header/Header";

export default function LessonPage() {
  const { courseId, lessonId } = useParams();
  const [currentLesson, setCurrentLesson] = useState(null);
  const [previousLesson, setPreviousLesson] = useState(null);
  const [nextLesson, setNextLesson] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchLessonContent() {
      try {
        const { data: lessonData, error: lessonError } = await supabase
          .from("lessons")
          .select("*")
          .eq("course_id", courseId)
          .eq("id", parseInt(lessonId, 10))
          .order("id")
          .limit(1);

        // console.log("courseId:", courseId);
        // console.log("lessonId:", lessonId);
        // console.log("Lesson Data:", lessonData);
        // console.log("Lesson Error:", lessonError);

        if (lessonError) {
          throw new Error(lessonError.message);
        }

        if (lessonData && lessonData.length > 0) {
          const lesson = lessonData[0];
          setCurrentLesson(lesson);
        }
      } catch (error) {
        console.error("Error fetching lesson content:", error);
      }
    }

    fetchLessonContent();
  }, [courseId, lessonId]);

  useEffect(() => {
    async function fetchPreviousLesson() {
      try {
        const { data: previousLessonData, error: previousLessonError } = await supabase
          .from("lesson_groups")
          .select("lesson_id")
          .eq("course_id", courseId)
          .lt("lesson_id", parseInt(lessonId, 10))
          .order("lesson_id", { ascending: true })
          .limit(1);

        // console.log("courseId:", courseId);
        // console.log("lessonId:", lessonId);
        // console.log("Lesson Data:", previousLessonData);
        // console.log("Lesson Error:", previousLessonError);

        if (previousLessonError) {
          throw new Error(previousLessonError.message);
        }

        if (previousLessonData && previousLessonData.length > 0) {
          const previousLessonId = previousLessonData[0].lesson_id;
          const { data: previousLessonContent, error: previousLessonContentError } = await supabase
            .from("lessons")
            .select("*")
            .eq("course_id", courseId)
            .eq("id", previousLessonId)
            .limit(1);

          if (previousLessonContentError) {
            throw new Error(previousLessonContentError.message);
          }

          if (previousLessonContent && previousLessonContent.length > 0) {
            const previousLesson = previousLessonContent[0];
            setPreviousLesson(previousLesson);
          } else {
            setPreviousLesson(null);
          }
        } else {
          setPreviousLesson(null);
        }
      } catch (error) {
        console.error("Error fetching previous lesson:", error);
      }
    }

    fetchPreviousLesson();
  }, [courseId, lessonId]);

  useEffect(() => {
    async function fetchNextLesson() {
      try {
        const { data: nextLessonData, error: nextLessonError } = await supabase
          .from("lesson_groups")
          .select("lesson_id")
          .eq("course_id", courseId)
          .gt("lesson_id", parseInt(lessonId, 10))
          .order("lesson_id", { ascending: true })
          .limit(1);

        // console.log("courseId:", courseId);
        // console.log("lessonId:", lessonId);
        // console.log("Lesson Data:", nextLessonData);
        // console.log("Lesson Error:", nextLessonError);

        if (nextLessonError) {
          throw new Error(nextLessonError.message);
        }

        if (nextLessonData && nextLessonData.length > 0) {
          const nextLessonId = nextLessonData[0].lesson_id;
          const { data: nextLessonContent, error: nextLessonContentError } = await supabase
            .from("lessons")
            .select("*")
            .eq("course_id", courseId)
            .eq("id", nextLessonId)
            .limit(1);

          if (nextLessonContentError) {
            throw new Error(nextLessonContentError.message);
          }

          if (nextLessonContent && nextLessonContent.length > 0) {
            const nextLesson = nextLessonContent[0];
            setNextLesson(nextLesson);
          } else {
            setNextLesson(null);
          }
        } else {
          setNextLesson(null);
        }
      } catch (error) {
        console.error("Error fetching next lesson:", error);
      }
    }

    fetchNextLesson();
  }, [courseId, lessonId]);

  const handlePreviousLessonClick = () => {
    if (previousLesson && previousLesson.id) {
      navigate(`/lesson/${courseId}/${previousLesson.id}`);
    }
  };

  const handleNextLessonClick = () => {
    if (nextLesson && nextLesson.id) {
      navigate(`/lesson/${courseId}/${nextLesson.id}`);
    }
  };

  return (
    <div className="lesson-page">
      {currentLesson ? (
        <div className="lesson">
          <Header theme="dark" />
          <section className="lesson--content">
            <h3>{currentLesson.title}</h3>
            <div className="paragraphs">
              {currentLesson.description.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </section>
          <section className="lesson--media">
            <div className="lesson--media-sticky">
              {currentLesson.image_url && <img src={currentLesson.image_url} alt="Lesson Image" />}
              {/*{currentLesson.video_url && <video src={currentLesson.video_url} controls />} */}
              {/* Add more elements for other columns */}
              <div className="page-actions">
                {previousLesson && previousLesson.id && (
                  <div className="button-container lesson-buttons">
                    <svg
                      className="arrow-icon left-arrow"
                      id="Layer_2"
                      xmlns="http://www.w3.org/2000/svg"
                      width="37"
                      height="6"
                      viewBox="0 0 37 6"
                    >
                      <g id="Layer_2-2">
                        <polygon points="37 2 3 2 4 0 0 3 4 6 3 4 37 4 37 2" fill="#200bd1" />
                      </g>
                    </svg>
                    <button className="previous-lesson-button" onClick={handlePreviousLessonClick}>
                      Previous Lesson
                    </button>
                  </div>
                )}
                {nextLesson ? (
                  <div className="button-container lesson-buttons">
                    <button className="next-lesson-button" onClick={handleNextLessonClick}>
                      Next Lesson
                    </button>
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
                  </div>
                ) : (
                  <Link to={`/profile`}>Finish Course</Link>
                )}
              </div>
            </div>
          </section>
        </div>
      ) : (
        <p>Loading lesson content...</p>
      )}
    </div>
  );
}
