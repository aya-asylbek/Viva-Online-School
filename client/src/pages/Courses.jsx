import React, { useState, useEffect } from "react";
import api from "../api";
import { useAuth } from "../components/AuthContext";
import "../styles/Courses.css";

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCourse, setNewCourse] = useState({
        name: "",
        credits: 3,
        enrollment_limit: 30
    });
    const [editingCourse, setEditingCourse] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", credits: 3, enrollment_limit: 30 });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await api.get("/courses");
            setCourses(res.data);
        } catch (err) {
            console.error("Error fetching courses:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/courses", newCourse);
            setCourses([...courses, res.data]);
            setNewCourse({ name: "", credits: 3, enrollment_limit: 30 });
            setShowAddForm(false);
        } catch (err) {
            alert("Error creating course: " + err.response?.data?.error);
        }
    };

    const handleEdit = (course) => {
        setEditingCourse(course.id);
        setEditForm({
            name: course.name,
            credits: course.credits,
            enrollment_limit: course.enrollment_limit
        });
    };

    const cancelEdit = () => {
        setEditingCourse(null);
    };

    const handleUpdateCourse = async (e, courseId) => {
        e.preventDefault();
        try {
            const res = await api.put(`/courses/${courseId}`, editForm);
            setCourses(courses.map(course =>
                course.id === courseId ? res.data : course
            ));
            setEditingCourse(null);
            alert("✅ Course updated successfully!");
        } catch (err) {
            alert("Error updating course: " + err.response?.data?.error);
        }
    };

    const handleDelete = async (courseId) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            try {
                await api.delete(`/courses/${courseId}`);
                setCourses(courses.filter(course => course.id !== courseId));
                alert("✅ Course deleted successfully!");
            } catch (err) {
                alert("Error deleting course: " + err.response?.data?.error);
            }
        }
    };

    const handleEnroll = async (courseId) => {
        try {
            await api.post("/enrollments", {
                student_id: user.id,
                course_id: courseId
            });
            alert("Successfully enrolled in course!");
        } catch (err) {
            alert("Enrollment failed: " + err.response?.data?.error);
        }
    };

    if (loading) return <div className="loading">Loading courses...</div>;

    return (
        <div className="courses-container">
            <div className="courses-header">
                <h1>📚 Courses</h1>
                {user?.role === "teacher" && (
                    <button
                        className="btn-primary"
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        {showAddForm ? "❌ Cancel" : "➕ Add New Course"}
                    </button>
                )}
            </div>

            {/* Add Course Form for Teachers */}
            {showAddForm && user?.role === "teacher" && (
                <form onSubmit={handleAddCourse} className="add-course-form">
                    <h3>Create New Course</h3>
                    <div className="form-row">
                        <input
                            type="text"
                            placeholder="Course Name"
                            value={newCourse.name}
                            onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Credits"
                            value={newCourse.credits}
                            onChange={(e) => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) })}
                            min="1"
                            max="6"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Enrollment Limit"
                            value={newCourse.enrollment_limit}
                            onChange={(e) => setNewCourse({ ...newCourse, enrollment_limit: parseInt(e.target.value) })}
                            min="1"
                            max="100"
                            required
                        />
                        <button type="submit" className="btn-success">Create Course</button>
                    </div>
                </form>
            )}

            {/* Courses Table */}
            <div className="table-container">
                <table className="courses-table">
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Credits</th>
                            <th>Enrollment Limit</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(course => (
                            <tr key={course.id}>
                                <td>{course.name}</td>
                                <td>{course.credits}</td>
                                <td>{course.enrollment_limit} students</td>
                                <td className="actions">
                                    {user?.role === "teacher" ? (
                                        <>
                                            {editingCourse === course.id ? (
                                                // EDIT FORM
                                                <div className="edit-form">
                                                    <input
                                                        value={editForm.name}
                                                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                                        className="edit-input"
                                                    />
                                                    <button onClick={(e) => handleUpdateCourse(e, course.id)} className="btn-success">
                                                        ✅ Save
                                                    </button>
                                                    <button onClick={cancelEdit} className="btn-danger">❌ Cancel</button>
                                                </div>
                                            ) : (
                                                // EDIT/DELETE BUTTONS
                                                <>
                                                    <button 
                                                        className="btn-edit"
                                                        onClick={() => handleEdit(course)}
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                    <button 
                                                        className="btn-danger"
                                                        onClick={() => handleDelete(course.id)}
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <button 
                                            className="btn-enroll"
                                            onClick={() => handleEnroll(course.id)}
                                        >
                                            ➕ Enroll
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {courses.length === 0 && (
                <div className="no-courses">
                    No courses available yet.
                </div>
            )}
        </div>
    );
};

export default Courses;