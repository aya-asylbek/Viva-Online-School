import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();


// Get courses -verified with token only for students and teachers
router.get("/", verifyToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM courses ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// POST courses - only teacher
router.post("/", verifyToken, async (req, res) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ error: "Only teachers can add courses" });
  }

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

// PUT courses - only teacher
router.put("/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ error: "Only teachers can update courses" });
  }

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

// DELETE courses - only teacher
router.delete("/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ error: "Only teachers can delete courses" });
  }

  const { id } = req.params;
  try {
    await pool.query("DELETE FROM courses WHERE id=$1", [id]);
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;