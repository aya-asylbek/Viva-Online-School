import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalGrades: 0
  });
  const [recentGrades, setRecentGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Используем mock данные для демо
      setStats({
        totalCourses: 7,
        totalStudents: 4,
        totalGrades: 7
      });

      // Mock recent grades
      setRecentGrades([
        { student_name: "Adam Salamat", course_name: "HTML Basics", grade: "A", date: "2 hours ago" },
        { student_name: "Maria Torres", course_name: "CSS Styling", grade: "B+", date: "4 hours ago" },
        { student_name: "Adam Salamat", course_name: "JavaScript Fundamentals", grade: "A-", date: "1 day ago" },
        { student_name: "Adrian Knowles", course_name: "HTML Basics", grade: "B+", date: "1 day ago" }
      ]);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>👨‍🏫 Teacher Dashboard</h1>
        <p>Welcome back, {user?.name || user?.email}!</p>
      </div>

      {/* 📊 Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>Total Courses</h3>
            <p>{stats.totalCourses}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Students</h3>
            <p>{stats.totalStudents}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h3>Grades Assigned</h3>
            <p>{stats.totalGrades}</p>
          </div>
        </div>
      </div>

      {/* 🚀 Quick Actions */}
      <div className="quick-actions">
        <button 
          className="action-btn primary"
          onClick={() => navigate("/courses")}
        >
          ➕ Add New Course
        </button>
        <button 
          className="action-btn secondary"
          onClick={() => navigate("/grades")}
        >
          📊 Manage Grades
        </button>
        <button 
          className="action-btn tertiary"
          onClick={() => navigate("/courses")}
        >
          📊 View Enrollment Limits
        </button>
      </div>

      <div className="dashboard-content">
        {/* 📚 Recent Activity */}
        <div className="dashboard-section">
          <h2>📈 Recent Grade Activity</h2>
          <div className="table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Grade</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentGrades.map((grade, index) => (
                  <tr key={index}>
                    <td>{grade.student_name}</td>
                    <td>{grade.course_name}</td>
                    <td>
                      <span className={`grade-badge grade-${grade.grade.replace('+', 'plus').replace('-', 'minus')}`}>
                        {grade.grade}
                      </span>
                    </td>
                    <td>{grade.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 📊 Quick Stats */}
        <div className="dashboard-section">
          <h2>🚀 Quick Access</h2>
          <div className="quick-stats">
            <div className="quick-stat-item">
              <h4>Course Management</h4>
              <p>Create, edit, and manage your courses</p>
              <button onClick={() => navigate("/courses")}>Go to Courses →</button>
            </div>
            <div className="quick-stat-item">
              <h4>Grade Students</h4>
              <p>Assign and manage student grades</p>
              <button onClick={() => navigate("/grades")}>Manage Grades →</button>
            </div>
            <div className="quick-stat-item">
              <h4>Enrollment Overview</h4>
              <p>View course capacity and enrollment limits</p>
              <button onClick={() => navigate("/courses")}>View Limits →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;