import React from "react";

const CourseActions = ({ 
    course, 
    user, 
    isEditing, 
    spots, 
    prerequisitesCheck, 
    onEdit, 
    onSave, 
    onCancel, 
    onDelete, 
    onEnroll, 
    onManagePrerequisites 
}) => {
    const renderEnrollButton = () => {
        if (spots.isFull) {
            return <button className="btn-disabled" disabled>🚫 Full</button>;
        }

        if (course.prerequisites?.length > 0) {
            const check = prerequisitesCheck[course.id];
            if (check && !check.canEnroll) {
                return (
                    <button className="btn-disabled" disabled title={`Missing: ${check.missingPrerequisites.join(', ')}`}>
                        ❌ Prereq
                    </button>
                );
            }
        }

        return <button className="btn-enroll" onClick={onEnroll}>➕ Enroll</button>;
    };

    if (user?.role === "teacher") {
        if (isEditing) {
            return (
                <div className="teacher-actions">
                    <button className="btn-success" onClick={onSave}>✅ Save</button>
                    <button className="btn-danger" onClick={onCancel}>❌ Cancel</button>
                </div>
            );
        }

        return (
            <div className="teacher-actions">
                <button className="btn-edit" onClick={onEdit}>✏️ Edit</button>
                <button className="btn-prerequisites" onClick={onManagePrerequisites}>📋 Prerequisites</button>
                <button className="btn-danger" onClick={onDelete}>🗑️ Delete</button>
            </div>
        );
    }

    return renderEnrollButton();
};

export default CourseActions;