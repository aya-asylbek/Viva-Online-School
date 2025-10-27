import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../components/AuthContext";
import "../styles/Grades.css";

const Grades = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Form to add grade
  const [newGrade, setNewGrade] = useState({
    student_id: "",
    course_id: "",
    grade: "A"
  });

  // Edit state
  const [editingGrade, setEditingGrade] = useState(null);
  const [editForm, setEditForm] = useState({
    grade: "A"
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [gradesRes, coursesRes, usersRes] = await Promise.all([
        api.get("/grades"),
        api.get("/courses"),
        api.get("/users")
      ]);

      setGrades(gradesRes.data || []);
      setCourses(coursesRes.data || []);
      
      const studentUsers = (usersRes.data || []).filter(user => user.role === 'student');
      setStudents(studentUsers);

    } catch (err) {
      console.error("❌ ERROR:", err);
      setError("Failed to load data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setNewGrade({ ...newGrade, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/grades", newGrade);
      setNewGrade({ student_id: "", course_id: "", grade: "A" });
      fetchData();
      alert("✅ Grade assigned successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to submit grade: " + (err.response?.data?.error || err.message));
    }
  };

  // EDIT FUNCTIONS
  const handleEdit = (grade) => {
    setEditingGrade(grade.id);
    setEditForm({ grade: grade.grade });
  };

  const handleUpdateGrade = async (e, gradeId) => {
    e.preventDefault();
    try {
      await api.put(`/grades/${gradeId}`, editForm);
      setEditingGrade(null);
      fetchData();
      alert("✅ Grade updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to update grade: " + (err.response?.data?.error || err.message));
    }
  };

  const cancelEdit = () => {
    setEditingGrade(null);
  };

  // DELETE FUNCTION
  const handleDelete = async (gradeId) => {
    if (window.confirm("Are you sure you want to delete this grade?")) {
      try {
        await api.delete(`/grades/${gradeId}`);
        fetchData();
        alert("✅ Grade deleted successfully!");
      } catch (err) {
        console.error(err);
        setError("Failed to delete grade: " + (err.response?.data?.error || err.message));
      }
    }
  };

  const calculateGPA = (studentGrades) => {
    const gradePoints = {
      'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 
      'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'D': 1.0, 'F': 0.0
    };
    
    const totalPoints = studentGrades.reduce((sum, grade) => {
      return sum + (gradePoints[grade.grade] || 0);
    }, 0);
    
    return studentGrades.length > 0 ? (totalPoints / studentGrades.length).toFixed(2) : "0.00";
  };

  // Filter grades based on user role
  const userGrades = user?.role === "student" 
    ? grades.filter(grade => {
        const studentName = user.name || user.email;
        return grade.student === studentName;
      })
    : grades;

  if (loading) return <div className="loading">Loading grades...</div>;

  return (
    <div className="grades-container">
      <div className="grades-header">
        <h1>📊 {user?.role === "teacher" ? "Grade Management" : "My Grades"}</h1>
        {user?.role === "student" && userGrades.length > 0 && (
          <div className="gpa-badge">
            📈 GPA: {calculateGPA(userGrades)}
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {/* Assign Grade Form - Only for Teachers */}
      {user?.role === "teacher" && (
        <div className="assign-grade-section">
          <h2>➕ Assign New Grade</h2>
          <form onSubmit={handleSubmit} className="grade-form">
            <div className="form-row">
              <select
                name="student_id"
                value={newGrade.student_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Student</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.email})
                  </option>
                ))}
              </select>

              <select
                name="course_id"
                value={newGrade.course_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>

              <select
                name="grade"
                value={newGrade.grade}
                onChange={handleChange}
                required
              >
                <option value="A">A</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="B-">B-</option>
                <option value="C+">C+</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="F">F</option>
              </select>

              <button type="submit" className="btn-primary">
                Assign Grade
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grades Table */}
      <div className="grades-section">
        <h2>{user?.role === "teacher" ? "All Grades" : "My Grade History"}</h2>
        <div className="table-container">
          <table className="grades-table">
            <thead>
              <tr>
                {user?.role === "teacher" && <th>Student</th>}
                <th>Course</th>
                <th>Grade</th>
                <th>Date</th>
                {user?.role === "teacher" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {userGrades.map(grade => (
                <tr key={grade.id}>
                  {user?.role === "teacher" && (
                    <td>{grade.student}</td>
                  )}
                  <td>{grade.course}</td>
                  <td>
                    {editingGrade === grade.id ? (
                      <select
                        value={editForm.grade}
                        onChange={(e) => setEditForm({ grade: e.target.value })}
                        className="edit-grade-select"
                      >
                        <option value="A">A</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B">B</option>
                        <option value="B-">B-</option>
                        <option value="C+">C+</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="F">F</option>
                      </select>
                    ) : (
                      <span className={`grade-badge grade-${grade.grade.replace('+', 'plus').replace('-', 'minus')}`}>
                        {grade.grade}
                      </span>
                    )}
                  </td>
                  <td>
                    {grade.date_assigned ? new Date(grade.date_assigned).toLocaleDateString() : 'Recent'}
                  </td>
                  
                  {/* EDIT/DELETE ACTIONS - Only for Teachers */}
                  {user?.role === "teacher" && (
                    <td className="actions">
                      {editingGrade === grade.id ? (
                        <>
                          <button 
                            onClick={(e) => handleUpdateGrade(e, grade.id)}
                            className="btn-success"
                          >
                            ✅ Save
                          </button>
                          <button 
                            onClick={cancelEdit}
                            className="btn-danger"
                          >
                            ❌ Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleEdit(grade)}
                            className="btn-edit"
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(grade.id)}
                            className="btn-danger"
                          >
                            🗑️ Delete
                          </button>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {userGrades.length === 0 && (
          <div className="no-grades">
            {user?.role === "teacher" 
              ? "No grades have been assigned yet." 
              : "You don't have any grades yet."}
          </div>
        )}
      </div>
    </div>
  );
};

export default Grades;