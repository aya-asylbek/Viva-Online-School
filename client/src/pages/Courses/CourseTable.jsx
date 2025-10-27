import React, { useState } from "react";
import api from "../../api";
import CourseActions from "./CourseActions";

const CourseTable = ({ courses, enrollments, user, onCourseUpdated, onDeleteCourse, onEnrollCourse, onManagePrerequisites }) => {
    const [editingCourse, setEditingCourse] = useState(null);
    const [editForm, setEditForm] = useState({ name: "", credits: 3, enrollment_limit: 30 });
    const [prerequisitesCheck, setPrerequisitesCheck] = useState({});

    const getAvailableSpots = (course) => {
        const currentEnrollments = enrollments.filter(e => e.course_id === course.id);
        const available = course.enrollment_limit - currentEnrollments.length;
        return { current: currentEnrollments.length, available, isFull: available <= 0 };
    };

    const getPrerequisiteNames = (course) => {
        if (!course.prerequisites || course.prerequisites.length === 0) return [];
        return course.prerequisites.map(prereqId => {
            const prereqCourse = courses.find(c => c.id === prereqId);
            return prereqCourse ? prereqCourse.name : `Course ${prereqId}`;
        });
    };

    const checkCoursePrerequisites = async (courseId) => {
        try {
            const res = await api.get(`/courses/${courseId}/check-prerequisites/${user.id}`);
            setPrerequisitesCheck(prev => ({ ...prev, [courseId]: res.data }));
            return res.data;
        } catch (err) {
            return { canEnroll: true, missingPrerequisites: [] };
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

    const handleUpdateCourse = async (courseId) => {
        console.log("🔄 Updating course:", courseId, editForm);
        try {
            const response = await api.put(`/courses/${courseId}`, editForm);
            console.log("✅ Update success:", response.data);
            
            setEditingCourse(null);
            onCourseUpdated(); // Обновляем список в родителе
            alert("✅ Course updated!");
        } catch (err) {
            console.error("❌ Update error:", err);
            alert("Error: " + err.response?.data?.error);
        }
    };

    const handleCancelEdit = () => {
        setEditingCourse(null);
    };

    const handleDelete = async (courseId) => {
        if (window.confirm("Delete this course?")) {
            try {
                await api.delete(`/courses/${courseId}`);
                onDeleteCourse();
                alert("✅ Course deleted!");
            } catch (err) {
                alert("Error: " + err.response?.data?.error);
            }
        }
    };

    const handleEnroll = async (course) => {
        try {
            if (course.prerequisites?.length > 0) {
                const prerequisitesResult = await checkCoursePrerequisites(course.id);
                if (!prerequisitesResult.canEnroll) {
                    alert(`❌ Missing: ${prerequisitesResult.missingPrerequisites.join(', ')}`);
                    return;
                }
            }

            const spots = getAvailableSpots(course);
            if (spots.isFull) {
                alert(`❌ Course "${course.name}" is full!`);
                return;
            }

            await api.post("/enrollments", { student_id: user.id, course_id: course.id });
            onEnrollCourse();
            alert("✅ Enrolled!");
        } catch (err) {
            alert("Enrollment failed: " + err.response?.data?.error);
        }
    };

    return (
        <div className="table-container">
            <table className="courses-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Course Name</th>
                        <th>Credits</th>
                        <th>Enrollment</th>
                        <th>Prerequisites</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(course => (
                        <tr key={course.id}>
                            <td className="course-id">{course.id}</td>
                            <td className="course-name">
                                {editingCourse === course.id ? (
                                    <input
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="edit-input"
                                        placeholder="Course name"
                                    />
                                ) : (
                                    course.name
                                )}
                            </td>
                            <td className="course-credits">
                                {editingCourse === course.id ? (
                                    <input
                                        type="number"
                                        value={editForm.credits}
                                        onChange={(e) => setEditForm({ ...editForm, credits: parseInt(e.target.value) })}
                                        className="edit-input"
                                        min="1"
                                        max="10"
                                    />
                                ) : (
                                    course.credits
                                )}
                            </td>
                            <td className="enrollment-info">
                                <div className="enrollment-stats">
                                    <span className="current-enrollment">
                                        {getAvailableSpots(course).current}/{course.enrollment_limit}
                                    </span>
                                    <span className={`spots-left ${getAvailableSpots(course).isFull ? 'full' : 'available'}`}>
                                        ({getAvailableSpots(course).available} spots left)
                                    </span>
                                </div>
                            </td>
                            <td className="prerequisites-cell">
                                {course.prerequisites && course.prerequisites.length > 0 ? (
                                    <div className="prerequisites-info">
                                        <div className="prerequisites-badge">
                                            📋 {course.prerequisites.length} required
                                        </div>
                                        <div className="prerequisites-tooltip">
                                            Requires: {getPrerequisiteNames(course).join(', ')}
                                        </div>
                                    </div>
                                ) : (
                                    <span className="no-prerequisites">No prerequisites</span>
                                )}
                            </td>
                            <td className="actions">
                                <CourseActions
                                    course={course}
                                    user={user}
                                    isEditing={editingCourse === course.id}
                                    spots={getAvailableSpots(course)}
                                    prerequisitesCheck={prerequisitesCheck}
                                    onEdit={() => handleEdit(course)}
                                    onSave={() => handleUpdateCourse(course.id)}
                                    onCancel={handleCancelEdit}
                                    onDelete={() => handleDelete(course.id)}
                                    onEnroll={() => handleEnroll(course)}
                                    onManagePrerequisites={() => onManagePrerequisites(course.id)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {courses.length === 0 && <div className="no-courses">No courses available</div>}
        </div>
    );
};

export default CourseTable;