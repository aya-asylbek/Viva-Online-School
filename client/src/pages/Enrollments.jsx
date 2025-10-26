import React, { useEffect, useState } from "react";
import api from "../api";

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await api.get("/enrollments");
        setEnrollments(res.data);
      } catch (err) {
        console.error("Failed to fetch enrollments", err);
      }
    };

    fetchEnrollments();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Enrollments</h1>
      {enrollments.length === 0 ? (
        <p>No enrollments found.</p>
      ) : (
        <ul>
          {enrollments.map((enroll) => (
            <li key={enroll.id}>
              {enroll.student} enrolled in <strong>{enroll.course}</strong> on{" "}
              {new Date(enroll.date_enrolled).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Enrollments;
