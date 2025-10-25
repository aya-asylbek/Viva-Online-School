import express from "express";
import pool from "../db.js";

const router = express.Router();

// Get all courses
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM courses ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new course
router.post("/", async (req, res) => {
  const { name, credits, enrollment_limit } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO courses (name, credits, enrollment_limit) VALUES ($1, $2, $3) RETURNING *",
      [name, credits, enrollment_limit]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update course
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, credits, enrollment_limit } = req.body;
  try {
    const result = await pool.query(
      "UPDATE courses SET name=$1, credits=$2, enrollment_limit=$3 WHERE id=$4 RETURNING *",
      [name, credits, enrollment_limit, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete course
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM courses WHERE id=$1", [id]);
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
