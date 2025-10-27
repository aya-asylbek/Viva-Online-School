import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const isTeacher = user?.role === 'teacher';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="navbar">
            <div className="nav-content">
                <Link to="/dashboard" className="nav-logo">
                    🎓 Viva School
                </Link>

                <div className="nav-links">
                    <Link to="/dashboard" className="nav-link">
                        🏠 Dashboard
                    </Link>

                    {isTeacher ? (
                        <>
                            <Link to="/courses" className="nav-link">
                                📚 Manage Courses
                            </Link>
                            <Link to="/grades" className="nav-link">
                                📝 Grade Students
                            </Link>
                            <Link to="/enrollments" className="nav-link">
                                👥 Manage Enrollment
                            </Link>
                            {user?.role === "teacher" && (
                                <Link to="/users" className="nav-link">
                                    👥 Users
                                </Link>
                            )}
                        </>
                    ) : (
                        <>
                            <>
                                <Link to="/courses" className="nav-link">📖 Available Courses</Link>
                                <Link to="/grades" className="nav-link">📊 My Grades</Link>
                                <Link to="/enrollments" className="nav-link">👥 My Enrollments</Link>
                            </>
                        </>
                    )}
                </div>

                <div className="user-section">
                    <span className="user-info">
                        {isTeacher ? '👨‍🏫' : '👨‍🎓'} {user?.name || (isTeacher ? 'Teacher' : 'Student')}
                    </span>
                    <button onClick={handleLogout} className="logout-btn">
                        🚪 Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
