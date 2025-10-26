import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ name: "", credits: "" });

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return navigate("/login");
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async () => {
    try {
      const res = await api.post("/courses", newCourse);
      setCourses([...courses, res.data]);
      setNewCourse({ name: "", credits: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/courses/${id}`);
      setCourses(courses.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Courses</h1>

      {user.role === "teacher" && (
        <div>
          <input
            placeholder="Course Name"
            value={newCourse.name}
            onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
          />
          <input
            placeholder="Credits"
            type="number"
            value={newCourse.credits}
            onChange={(e) => setNewCourse({ ...newCourse, credits: e.target.value })}
          />
          <button onClick={handleAdd}>Add Course</button>
        </div>
      )}

      <ul>
        {courses.map((c) => (
          <li key={c.id}>
            {c.name} ({c.credits} credits)
            {user.role === "teacher" && (
              <button onClick={() => handleDelete(c.id)}>❌</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Courses;
