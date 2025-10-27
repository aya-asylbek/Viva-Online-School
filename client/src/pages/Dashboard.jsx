import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({});
    const [recentGrades, setRecentGrades] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            console.log("🔍 User role:", user?.role);

            if (user?.role === "teacher") {
                // TEACHER DASHBOARD
                setStats({
                    totalCourses: 7,
                    totalStudents: 4,
                    totalGrades: 7
                });
                setRecentGrades([
                    { student_name: "Adam Salamat", course_name: "HTML Basics", grade: "A", date: "2 hours ago" },
                    { student_name: "Maria Torres", course_name: "CSS Styling", grade: "B+", date: "4 hours ago" },
                    { student_name: "Adam Salamat", course_name: "JavaScript Fundamentals", grade: "A-", date: "1 day ago" },
                    { student_name: "Adrian Knowles", course_name: "HTML Basics", grade: "B+", date: "1 day ago" }
                ]);
            } else {
                // STUDENT DASHBOARD
                setStats({
                    gpa: "0.00",
                    enrolledCourses: 0,
                    gradesReceived: 0
                });
                setRecentGrades([]);
            }
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading dashboard...</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>{user?.role === "teacher" ? "👨‍🏫 Teacher Dashboard" : "👨‍🎓 Student Dashboard"}</h1>
                <p>Welcome back, {user?.name || user?.email}!</p>
            </div>

            {/* 📊 Statistics Cards */}
            <div className="stats-grid">
                {user?.role === "teacher" ? (
                    // TEACHER STATS
                    <>
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
                    </>
                ) : (
                    // STUDENT STATS
                    <>
                        <div className="stat-card">
                            <div className="stat-icon">📊</div>
                            <div className="stat-info">
                                <h3>My GPA</h3>
                                <p>{stats.gpa}</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">📚</div>
                            <div className="stat-info">
                                <h3>Enrolled Courses</h3>
                                <p>{stats.enrolledCourses}</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">📝</div>
                            <div className="stat-info">
                                <h3>Grades Received</h3>
                                <p>{stats.gradesReceived}</p>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* 🚀 Quick Actions */}
            <div className="quick-actions">
                {user?.role === "teacher" ? (
                    // TEACHER ACTIONS
                    <>
                        <button className="action-btn primary" onClick={() => navigate("/courses")}>
                            ➕ Add New Course
                        </button>
                        <button className="action-btn secondary" onClick={() => navigate("/grades")}>
                            📊 Manage Grades
                        </button>
                        <button className="action-btn tertiary" onClick={() => navigate("/courses")}>
                            📊 View Enrollment Limits
                        </button>
                    </>
                ) : (
                    // STUDENT ACTIONS
                    <>
                        <button className="action-btn primary" onClick={() => navigate("/courses")}>
                            📖 View My Courses
                        </button>
                        <button className="action-btn secondary" onClick={() => navigate("/grades")}>
                            📊 Check Grades
                        </button>
                        <button className="action-btn tertiary" onClick={() => navigate("/courses")}>
                            ➕ Enroll in Courses
                        </button>
                    </>
                )}
            </div>

            <div className="dashboard-content">
                {/* 📈 Recent Activity */}
                <div className="dashboard-section">
                    <h2>📈 {user?.role === "teacher" ? "Recent Grade Activity" : "My Recent Grades"}</h2>
                    <div className="table-container">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    {user?.role === "teacher" && <th>Student</th>}
                                    <th>Course</th>
                                    <th>Grade</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentGrades.length > 0 ? (
                                    recentGrades.map((grade, index) => (
                                        <tr key={index}>
                                            {user?.role === "teacher" && <td>{grade.student_name}</td>}
                                            <td>{grade.course_name}</td>
                                            <td>
                                                <span className={`grade-badge grade-${grade.grade.replace('+', 'plus').replace('-', 'minus')}`}>
                                                    {grade.grade}
                                                </span>
                                            </td>
                                            <td>{grade.date}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={user?.role === "teacher" ? 4 : 3} style={{ textAlign: 'center', color: '#636e72' }}>
                                            {user?.role === "teacher" ? "No recent grade activity" : "No grades yet"}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 📊 Quick Access */}
                <div className="dashboard-section">
                    <h2>🚀 Quick Access</h2>
                    <div className="quick-stats">
                        {user?.role === "teacher" ? (
                            // TEACHER QUICK ACCESS
                            <>
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
                            </>
                        ) : (
                            // STUDENT QUICK ACCESS
                            <>
                                <div className="quick-stat-item">
                                    <h4>Available Courses</h4>
                                    <p>Browse and enroll in new courses</p>
                                    <button onClick={() => navigate("/courses")}>Explore Courses →</button>
                                </div>
                                <div className="quick-stat-item">
                                    <h4>My Grades</h4>
                                    <p>View your grades and GPA progress</p>
                                    <button onClick={() => navigate("/grades")}>View Grades →</button>
                                </div>
                                <div className="quick-stat-item">
                                    <h4>My Enrollments</h4>
                                    <p>See all courses you're enrolled in</p>
                                    <button onClick={() => navigate("/enrollments")}>View My Courses →</button>
                                </div>
                            </>

                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;