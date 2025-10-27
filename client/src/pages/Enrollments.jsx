import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../components/AuthContext";
import "../styles/Enrollments.css";

const Enrollments = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const res = await api.get("/enrollments");
      setEnrollments(res.data);
    } catch (err) {
      console.error("Failed to fetch enrollments", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (enrollmentId) => {
    if (window.confirm("Are you sure you want to remove this enrollment?")) {
      try {
        await api.delete(`/enrollments/${enrollmentId}`);
        fetchEnrollments();
        alert("✅ Enrollment removed successfully!");
      } catch (err) {
        alert("Error: " + err.response?.data?.error);
      }
    }
  };

  if (loading) return <div className="loading">Loading enrollments...</div>;

  return (
    <div className="enrollments-container">
      <div className="enrollments-header">
        <h1>👥 {user?.role === "teacher" ? "Manage Enrollment" : "My Enrollments"}</h1>
        
        {/* Statistics for Teacher */}
        {user?.role === "teacher" && (
          <div className="enrollment-stats">
            <span>📊 Total Enrollments: {enrollments.length}</span>
            <span>👤 Unique Students: {new Set(enrollments.map(e => e.student)).size}</span>
          </div>
        )}
      </div>

      {/* Teacher View - Table with Actions */}
      {user?.role === "teacher" ? (
        <div className="table-container">
          <table className="enrollments-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Enrollment Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map(enrollment => (
                <tr key={enrollment.id}>
                  <td>{enrollment.student}</td>
                  <td>{enrollment.course}</td>
                  <td>
                    {enrollment.date_enrolled ? 
                      new Date(enrollment.date_enrolled).toLocaleDateString() : 
                      'Recent'
                    }
                  </td>
                  <td className="actions">
                    <button 
                      onClick={() => handleUnenroll(enrollment.id)}
                      className="btn-danger"
                    >
                      🗑️ Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Student View  Simple List */
        <div className="enrollments-list">
          <h2>My Course Enrollments</h2>
          {enrollments
            .filter(enrollment => {
              // Filter by student name
              const studentName = user.name || user.email;
              return enrollment.student === studentName;
            })
            .map(enrollment => (
              <div key={enrollment.id} className="enrollment-item">
                <span className="course-name">{enrollment.course}</span>
                <span className="enrollment-date">
                  Enrolled on: {enrollment.date_enrolled ? 
                    new Date(enrollment.date_enrolled).toLocaleDateString() : 
                    'Recent'
                  }
                </span>
              </div>
            ))
          }
        </div>
      )}

      {enrollments.length === 0 && (
        <div className="no-enrollments">
          {user?.role === "teacher" 
            ? "No enrollments yet." 
            : "You are not enrolled in any courses yet."}
        </div>
      )}
    </div>
  );
};

export default Enrollments;