import express from "express";
import pool from "../db.js";

const router = express.Router();

// Get all enrollments
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.id, u.name AS student, c.name AS course, e.date_enrolled 
       FROM enrollments e
       JOIN users u ON e.student_id = u.id
       JOIN courses c ON e.course_id = c.id
       ORDER BY e.id ASC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Enroll a student
router.post("/", async (req, res) => {
  const { student_id, course_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2) RETURNING *",
      [student_id, course_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update enrollment
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { course_id } = req.body;
  try {
    const result = await pool.query(
      "UPDATE enrollments SET course_id=$1 WHERE id=$2 RETURNING *",
      [course_id, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete enrollment
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM enrollments WHERE id=$1", [id]);
    res.json({ message: "Enrollment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
