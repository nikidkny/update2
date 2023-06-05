import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xntlptjhmiswskncddwy.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhudGxwdGpobWlzd3NrbmNkZHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ0MTA2MTUsImV4cCI6MTk5OTk4NjYxNX0.WnxT09BuWLVdEcdSHrve0uib4_Zzu7l1VUY99PI8UaE";

// Initialize the Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

if (typeof BigInt.prototype.toJSON !== "function") {
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };
}
// Fetch user
async function fetchUser() {
  const { user, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error);
    return;
  }

  console.log("User:", user);
}

fetchUser();

// Fetch enrollments by user ID
const fetchEnrollmentsByUserId = async (userId) => {
  const userIdWithoutHyphens = userId.replace(/-/g, "");
  const parsedUserId = BigInt("0x" + userIdWithoutHyphens.slice(0, 10));
  console.log("userId:", userId);
  console.log("parsedUserId:", parsedUserId);
  try {
    const { data, error } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", parsedUserId);

    if (error) {
      console.error(error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Fetch all enrollments
const fetchEnrollments = async () => {
  try {
    const { data, error } = await supabase.from("enrollments").select("*");

    if (error) {
      console.error(error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Insert a new enrollment
const insertEnrollment = async (enrollmentData) => {
  try {
    const { data, error } = await supabase.from("enrollments").insert([
      {
        user_id: enrollmentData.user_id,
        course_id: enrollmentData.course_id,
        lesson_id: enrollmentData.lesson_id,
        completion_status: enrollmentData.completion_status,
      },
    ]);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Update an enrollment by ID
const updateEnrollment = async (enrollmentId, updates) => {
  try {
    const { data, error } = await supabase
      .from("enrollments")
      .update(updates)
      .eq("id", enrollmentId);

    if (error) {
      console.error(error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Delete an enrollment by ID
const deleteEnrollment = async (enrollmentId) => {
  try {
    const { data, error } = await supabase.from("enrollments").delete().eq("id", enrollmentId);

    if (error) {
      console.error(error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Fetch all courses
const fetchAllCourses = async () => {
  try {
    const { data, error } = await supabase.from("courses").select("*");

    if (error) {
      console.error(error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Fetch lesson content by lesson ID
const fetchLessonContent = async (lessonId) => {
  try {
    const { data, error } = await supabase.from("lessons").select("*").eq("id", lessonId);

    if (error) {
      console.error(error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Fetch the next lesson by lesson ID and course ID
const fetchNextLesson = async (lessonId, courseId) => {
  try {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", courseId)
      .gt("id", lessonId)
      .limit(1)
      .order("id", { ascending: true });

    if (error) {
      console.error(error);
      return null;
    }

    return data[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Fetch the previous lesson by lesson ID and course ID
const fetchPreviousLesson = async (lessonId, courseId) => {
  try {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", courseId)
      .lt("id", lessonId)
      .limit(1)
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      return null;
    }

    return data[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Fetch posts
const fetchPosts = async () => {
  try {
    const { data, error } = await supabase.from("posts").select("*");

    if (error) {
      console.error(error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export {
  supabase,
  fetchEnrollmentsByUserId,
  fetchAllCourses,
  fetchUser,
  fetchEnrollments,
  fetchLessonContent,
  fetchNextLesson,
  fetchPreviousLesson,
  insertEnrollment,
  updateEnrollment,
  deleteEnrollment,
  fetchPosts,
};
