import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses/Courses";
import Grades from "./pages/Grades";
import Enrollments from "./pages/Enrollments";
import Navbar from "./components/Navbar";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes with Navbar */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>
                  <Navbar />
                  <Dashboard />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <div>
                  <Navbar />
                  <Courses />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/grades"
            element={
              <ProtectedRoute>
                <div>
                  <Navbar />
                  <Grades />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/enrollments"
            element={
              <ProtectedRoute>
                <div>
                  <Navbar />
                  <Enrollments />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;