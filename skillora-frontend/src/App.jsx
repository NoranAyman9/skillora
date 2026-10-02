import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CourseDetails from "./pages/CourseDetails";
import MyCourses from "./pages/MyCourses";
import InstructorDashboard from "./pages/InstructorDashboard";
import CreateCourse from "./pages/CreateCourse";
import EditCourse from "./pages/EditCourse";
import CreateLesson from "./pages/CreateLesson";
import EditLesson from "./pages/EditLesson";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/courses/:id"
            element={<CourseDetails />}
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-courses"
            element={
              <ProtectedRoute role="student">
                <MyCourses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/instructor/dashboard"
            element={
              <ProtectedRoute role="instructor">
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses/create"
            element={
              <ProtectedRoute role="instructor">
                <CreateCourse />
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses/:id/edit"
            element={
              <ProtectedRoute role="instructor">
                <EditCourse />
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses/:courseId/lessons/create"
            element={
              <ProtectedRoute role="instructor">
                <CreateLesson />
              </ProtectedRoute>
            }
          />

          <Route
            path="/lessons/:id/edit"
            element={
              <ProtectedRoute role="instructor">
                <EditLesson />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </main>

      <footer className="skillora-footer">
        <div className="container">
          <strong>Skillora</strong>

          <span>
            Learn. Build. Grow.
          </span>
        </div>
      </footer>
    </>
  );
};

export default App;