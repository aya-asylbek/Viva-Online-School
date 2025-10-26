import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import PrivateRouteForDashboard from "./components/PrivateRouteForDashboard";
import Grades from "./pages/Grades";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
  path="/dashboard"
  element={
    <PrivateRouteForDashboard>
      <Dashboard />
    </PrivateRouteForDashboard>
  }
/>

       <Route
    path="/courses"
    element={
      <PrivateRouteForDashboard>
        <Courses />
      </PrivateRouteForDashboard>
    }
  />

  <Route
  path="/grades"
  element={
    <PrivateRouteForDashboard>
      <Grades />
    </PrivateRouteForDashboard>
  }
/>

</Routes>
    </Router>
  );
}

export default App;




