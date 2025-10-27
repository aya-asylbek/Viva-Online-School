import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middlewares/verifyToken.js";


const router = express.Router();

// Get all grades teacher and student can see
router.get("/", verifyToken, async (req, res) => {
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

// Assign grade (only teacher)
router.post("/", verifyToken, async (req, res) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ error: "Only teachers can assign grades" });
  }

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

// Update grade (teacher only)
router.put("/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ error: "Only teachers can update grades" });
  }
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

// Delete grade only teacher
router.delete("/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ error: "Only teachers can delete grades" });
  }

  const { id } = req.params;
  try {
    await pool.query("DELETE FROM grades WHERE id=$1", [id]);
    res.json({ message: "Grade deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GPA Calculation for a student by teacher
router.get("/gpa/:studentId", verifyToken, async (req, res) => {
  const { studentId } = req.params;

  try {
    const result = await pool.query(
      "SELECT grade FROM grades WHERE student_id = $1",
      [studentId]
    );

    const grades = result.rows.map(row => row.grade);

    if (grades.length === 0) {
      return res.json({ gpa: null, message: "No grades yet" });
    }

    // Convert letter grades to GPA scale
    const gradeMap = {
      "A+": 4.0, "A": 4.0, "A-": 3.7,
      "B+": 3.3, "B": 3.0, "B-": 2.7,
      "C+": 2.3, "C": 2.0, "C-": 1.7,
      "D+": 1.3, "D": 1.0, "D-": 0.7,
      "F": 0.0,
    };

    const total = grades.reduce((acc, g) => acc + (gradeMap[g] || 0), 0);
    const gpa = (total / grades.length).toFixed(2);

    res.json({ gpa });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
   // Get student dashboard stats (enrollments count, grades count, GPA)
router.get("/student/:id/dashboard-stats", verifyToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    // 1. Count enrolled courses
    const enrollmentsResult = await pool.query(
      "SELECT COUNT(*) FROM enrollments WHERE student_id = $1",
      [id]
    );
    const enrolledCourses = parseInt(enrollmentsResult.rows[0].count);

    // 2. Count grades received
    const gradesResult = await pool.query(
      "SELECT COUNT(*) FROM grades WHERE student_id = $1",
      [id]
    );
    const gradesReceived = parseInt(gradesResult.rows[0].count);

    // 3. Calculate GPA 
    const gpaResult = await pool.query(
      "SELECT grade FROM grades WHERE student_id = $1",
      [id]
    );

    const grades = gpaResult.rows.map(row => row.grade);
    let gpa = 0.00;

    if (grades.length > 0) {
      const gradeMap = {
        "A+": 4.0, "A": 4.0, "A-": 3.7,
        "B+": 3.3, "B": 3.0, "B-": 2.7,
        "C+": 2.3, "C": 2.0, "C-": 1.7,
        "D+": 1.3, "D": 1.0, "D-": 0.7,
        "F": 0.0,
      };
      const total = grades.reduce((acc, g) => acc + (gradeMap[g] || 0), 0);
      gpa = (total / grades.length).toFixed(2);
    }

    res.json({
      enrolledCourses,
      gradesReceived, 
      gpa: parseFloat(gpa)
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get student's grades for grades page
router.get("/student/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      `SELECT g.id, c.name AS course, g.grade, g.date_assigned 
       FROM grades g
       JOIN courses c ON g.course_id = c.id
       WHERE g.student_id = $1
       ORDER BY g.date_assigned DESC`,
      [id]
    );
    
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;

