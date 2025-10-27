import React, { useState, useEffect } from "react";
import api from "../../api";
import { useAuth } from "../../components/AuthContext";
import CourseTable from "./CourseTable";
import CourseForm from "./CourseForm";
import PrerequisitesManager from "./PrerequisitesManager";
import "../../styles/Courses.css";

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [managingPrerequisites, setManagingPrerequisites] = useState(null);
    const [editingCourse, setEditingCourse] = useState(null);
    
    useEffect(() => {
        fetchCourses();
        fetchEnrollments();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await api.get("/courses/with-prerequisites/all");
            setCourses(res.data);
        } catch (err) {
            console.error("Error:", err);
            const fallbackRes = await api.get("/courses");
            setCourses(fallbackRes.data);
        } finally {
            setLoading(false);
        }
    };

    const fetchEnrollments = async () => {
        try {
            const res = await api.get("/enrollments");
            setEnrollments(res.data);
        } catch (err) {
            console.error("Error:", err);
        }
    };

    const initializeDefaultPrerequisites = async () => {
        if (!user || user.role !== "teacher") return;
        if (!window.confirm("Set default prerequisites?")) return;

        try {
            const prerequisitesMap = { 2: [1], 3: [2], 4: [3], 5: [3], 6: [5] };
            for (const [courseId, prereqIds] of Object.entries(prerequisitesMap)) {
                const course = courses.find(c => c.id === parseInt(courseId));
                if (course) {
                    await api.put(`/courses/${course.id}/prerequisites`, { prerequisiteIds: prereqIds });
                }
            }
            alert("✅ Prerequisites set!");
            fetchCourses();
        } catch (err) {
            alert("Error: " + err.response?.data?.error);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="courses-container">
            <div className="courses-header">
                <h1>📚 Courses Management</h1>
                {user?.role === "teacher" && (
                    <div className="teacher-actions-header">
                        <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
                            {showAddForm ? "❌ Cancel" : "➕ Add Course"}
                        </button>
                        <button className="btn-prerequisites-setup" onClick={initializeDefaultPrerequisites}>
                            🚀 Setup Prerequisites
                        </button>
                    </div>
                )}
            </div>

            {(showAddForm || editingCourse) && user?.role === "teacher" && (
                <CourseForm
                    course={editingCourse}
                    onCourseAdded={fetchCourses}
                    onCourseUpdated={() => {
                        setEditingCourse(null);
                        fetchCourses();
                    }}
                    onCancel={() => {
                        setShowAddForm(false);
                        setEditingCourse(null);
                    }}
                    isEditing={!!editingCourse}
                />
            )}

            {managingPrerequisites && (
                <PrerequisitesManager
                    courseId={managingPrerequisites}
                    courses={courses}
                    onClose={() => setManagingPrerequisites(null)}
                    onSave={fetchCourses}
                />
            )}

            <CourseTable
                courses={courses}
                enrollments={enrollments}
                user={user}
                onCourseUpdated={fetchCourses}  
                onDeleteCourse={fetchCourses}
                onEnrollCourse={fetchEnrollments}
                onManagePrerequisites={setManagingPrerequisites}
            />
        </div>
    );
};

export default Courses;