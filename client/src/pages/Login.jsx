import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { useAuth } from '../components/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password, role });
      login(res.data.user, res.data.token); 
      
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="school-title">🎓 Viva School</h1>
        <p className="school-subtitle">Learn coding step by step</p>
        
        {/* Role Selection */}
        <div className="role-buttons">
          <button 
            type="button"
            onClick={() => setRole('student')}
            className={`role-btn ${role === 'student' ? 'active' : ''}`}
          >
            👨‍🎓 Student
          </button>
          <button 
            type="button"
            onClick={() => setRole('teacher')}
            className={`role-btn ${role === 'teacher' ? 'active' : ''}`}
          >
            👨‍🏫 Teacher
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              placeholder="your.email@school.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="login-btn"
          >
            {loading ? 'Signing In...' : '🚀 Start Learning'}
          </button>
        </form>

        {/* Course Preview */}
        <div className="course-preview">
          <h3>What you'll learn:</h3>
          <div className="course-list">
            <div className="course-item">HTML</div>
            <div className="course-item">CSS</div>
            <div className="course-item">JavaScript</div>
            <div className="course-item">React</div>
            <div className="course-item">Node</div>
            <div className="course-item">Postgres</div>
          </div>
        </div>

        <p className="signup-link">
          New here? <a href="/register">Create account</a>
        </p>
      </div>
    </div>
  );
};

export default Login;