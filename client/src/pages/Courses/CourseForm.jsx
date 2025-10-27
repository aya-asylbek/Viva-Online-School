import React, { useState, useEffect } from "react";
import api from "../../api";

const CourseForm = ({ course, onCourseAdded, onCourseUpdated, onCancel, isEditing }) => {
    const [formData, setFormData] = useState({
        name: "",
        credits: 3,
        enrollment_limit: 30
    });

    // Reset form when switching between add/edit modes
    useEffect(() => {
        if (isEditing && course) {
            // Pre-fill form with course data for editing
            setFormData({
                name: course.name || "",
                credits: course.credits || 3,
                enrollment_limit: course.enrollment_limit || 30
            });
        } else {
            // Reset form for adding new course
            setFormData({
                name: "",
                credits: 3,
                enrollment_limit: 30
            });
        }
    }, [isEditing, course]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                // Update existing course
                await api.put(`/courses/${course.id}`, formData);
                onCourseUpdated();
                alert("✅ Course updated successfully!");
            } else {
                // Create new course
                await api.post("/courses", formData);
                setFormData({ name: "", credits: 3, enrollment_limit: 30 });
                onCourseAdded();
                alert("✅ Course created successfully!");
            }
        } catch (err) {
            alert("Error: " + err.response?.data?.error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-course-form">
            <h3>{isEditing ? "✏️ Edit Course" : "➕ Create New Course"}</h3>
            <div className="form-row">
                <input
                    type="text"
                    placeholder="Course Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Credits"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 3 })}
                    min="1"
                    max="6"
                    required
                />
                <input
                    type="number"
                    placeholder="Enrollment Limit"
                    value={formData.enrollment_limit}
                    onChange={(e) => setFormData({ ...formData, enrollment_limit: parseInt(e.target.value) || 30 })}
                    min="1"
                    max="100"
                    required
                />
                <button type="submit" className="btn-success">
                    {isEditing ? "💾 Update Course" : "➕ Create Course"}
                </button>
                <button type="button" className="btn-danger" onClick={onCancel}>
                    ❌ Cancel
                </button>
            </div>
        </form>
    );
};

export default CourseForm;