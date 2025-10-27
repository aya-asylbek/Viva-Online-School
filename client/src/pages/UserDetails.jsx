import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../components/AuthContext";
import "../styles/UserDetails.css";

const UserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);

    if (currentUser?.role !== "teacher") {
        return (
            <div className="access-denied">
                <h2>❌ Access Denied</h2>
                <p>This page is available for teachers only.</p>
            </div>
        );
    }

    useEffect(() => {
        fetchUserDetails();
    }, [userId]);

    const fetchUserDetails = async () => {
        try {
            // 1 user info
            const userResponse = await api.get(`/users/${userId}`);
            setUser(userResponse.data);

            // 2.classes
            const enrollmentsResponse = await api.get("/enrollments");
            const userEnrollments = enrollmentsResponse.data.filter(e => e.student_id == userId);
            setCourses(userEnrollments);

            // 3. grades
            const gradesResponse = await api.get(`/grades/student/${userId}`);
            setGrades(gradesResponse.data);

        } catch (err) {
            console.error("Error fetching user details:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading user details...</div>;
    if (!user) return <div className="error">User not found</div>;

    return (
        <div className="user-details">
            <button className="back-btn" onClick={() => navigate("/users")}>
                ← Back to Users
            </button>

            <div className="user-header">
                <h1>👤 User Details: {user.name}</h1>
            </div>

            <div className="user-info-grid">
                <div className="info-card">
                    <h3>📊 Basic Information</h3>
                    <div className="info-item">
                        <strong>ID:</strong> {user.id}
                    </div>
                    <div className="info-item">
                        <strong>Name:</strong> {user.name}
                    </div>
                    <div className="info-item">
                        <strong>Email:</strong> {user.email}
                    </div>
                    <div className="info-item">
                        <strong>Role:</strong> 
                        <span className={`role-badge ${user.role}`}>
                            {user.role}
                        </span>
                    </div>
                </div>

                <div className="info-card">
                    <h3>📚 Academic Progress</h3>
                    <div className="info-item">
                        <strong>Enrolled Courses:</strong> {courses.length}
                    </div>
                    <div className="info-item">
                        <strong>Grades Received:</strong> {grades.length}
                    </div>
                </div>
            </div>

            <div className="section">
                <h3>🎓 Course History</h3>
                <div className="table-container">
                    <table className="grades-table">
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Grade</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grades.map(grade => (
                                <tr key={grade.id}>
                                    <td>{grade.course}</td>
                                    <td>
                                        <span className={`grade-badge grade-${grade.grade.replace('+', 'plus').replace('-', 'minus')}`}>
                                            {grade.grade}
                                        </span>
                                    </td>
                                    <td>{new Date(grade.date_assigned).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserDetails;