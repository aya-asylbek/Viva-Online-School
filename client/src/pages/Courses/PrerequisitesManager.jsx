import React, { useState, useEffect } from "react";
import api from "../../api";

const PrerequisitesManager = ({ courseId, courses, onClose, onSave }) => {
    const [availablePrerequisites, setAvailablePrerequisites] = useState([]);
    const [selectedPrerequisites, setSelectedPrerequisites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPrerequisites();
    }, [courseId]);

    const loadPrerequisites = async () => {
        try {
            // Get current course prerequisites
            const currentCourse = courses.find(c => c.id === courseId);
            setSelectedPrerequisites(currentCourse?.prerequisites || []);
            
            // Get available courses (exclude current course)
            const available = courses.filter(course => course.id !== courseId);
            setAvailablePrerequisites(available);
        } catch (err) {
            console.error("Error loading prerequisites:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await api.put(`/courses/${courseId}/prerequisites`, {
                prerequisiteIds: selectedPrerequisites
            });
            onSave();
            onClose();
            alert("✅ Prerequisites updated successfully!");
        } catch (err) {
            alert("Error saving prerequisites: " + err.response?.data?.error);
        }
    };

    if (loading) return <div className="modal-overlay">Loading...</div>;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>📋 Manage Course Prerequisites</h3>
                <p>Select courses that must be completed before enrollment:</p>
                
                <div className="prerequisites-list">
                    {availablePrerequisites.map(course => (
                        <div key={course.id} className="prerequisite-item">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedPrerequisites.includes(course.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedPrerequisites([...selectedPrerequisites, course.id]);
                                        } else {
                                            setSelectedPrerequisites(selectedPrerequisites.filter(id => id !== course.id));
                                        }
                                    }}
                                />
                                <span className="prerequisite-course">
                                    <strong>{course.name}</strong> 
                                    <span className="course-meta">({course.credits} credits)</span>
                                </span>
                            </label>
                        </div>
                    ))}
                </div>
                
                <div className="selected-count">
                    {selectedPrerequisites.length} prerequisite(s) selected
                </div>

                <div className="modal-actions">
                    <button onClick={handleSave} className="btn-success">💾 Save</button>
                    <button onClick={onClose} className="btn-danger">❌ Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default PrerequisitesManager;