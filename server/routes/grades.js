import express from "express";
import pool from "../db.js";

const router = express.Router();

// Get all grades
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT g.id, u.name AS student, c.name AS course, g.grade, g.date_assigned 
       FROM grades g
       JOIN users u ON g.student_id = u.id
       JOIN courses c ON g.course_id = c.id
       ORDER BY g.id ASC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add grade
router.post("/", async (req, res) => {
  const { student_id, course_id, grade } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO grades (student_id, course_id, grade) VALUES ($1, $2, $3) RETURNING *",
      [student_id, course_id, grade]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update grade
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { grade } = req.body;
  try {
    const result = await pool.query(
      "UPDATE grades SET grade=$1 WHERE id=$2 RETURNING *",
      [grade, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete grade
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM grades WHERE id=$1", [id]);
    res.json({ message: "Grade deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
