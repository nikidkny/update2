import { useEffect, useContext } from "react";
import { AuthContext, AuthProvider } from "../AuthProvider";
import LoginPage from "./pages/LoginPage";
import UserProfilePage from "./pages/UserProfilepage";
import CommunityPage from "./pages/CommunityPage";
import CoursesPage from "./pages/CoursesPage";
import LessonPage from "./pages/LessonPage";
import FinishedPage from "./pages/FinishedPage";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

const App = ({ handleLogin }) => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      {user ? (
        <>
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/forum" element={<CommunityPage />} />
          <Route path="/course/:courseId/lesson/:lessonId" element={<LessonPage />} />
          {/* <Route path="/finished/:courseId" element={<FinishedPage />} /> */}
        </>
      ) : (
        <Route path="/" element={<Navigate to="/" replace />} />
      )}
    </Routes>
  );
};

export default App;
