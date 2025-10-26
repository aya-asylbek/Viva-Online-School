import React, { useEffect, useState } from "react";
import api from "../api";

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [error, setError] = useState("");

  // form to add grade
  const [newGrade, setNewGrade] = useState({
    student_id: "",
    course_id: "",
    grade: ""
  });

  const fetchGrades = async () => {
    try {
      const res = await api.get("/grades");
      setGrades(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch grades.");
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const handleChange = (e) => {
    setNewGrade({ ...newGrade, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/grades", newGrade);
      setNewGrade({ student_id: "", course_id: "", grade: "" });
      fetchGrades(); // update
    } catch (err) {
      console.error(err);
      setError("Failed to submit grade.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Grades</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="student_id"
          value={newGrade.student_id}
          placeholder="Student ID"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="course_id"
          value={newGrade.course_id}
          placeholder="Course ID"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="grade"
          value={newGrade.grade}
          placeholder="Grade (e.g., A, B+)"
          onChange={handleChange}
          required
        />
        <button type="submit">Assign Grade</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {grades.map((g) => (
          <li key={g.id}>
            {g.student} - {g.course} - {g.grade}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Grades;
