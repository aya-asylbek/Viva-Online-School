import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Get courses ,verified with token only for students and teachers
router.get("/", verifyToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM courses ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST courses.only teacher
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

// PUT courses .only teacher
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

// Delete courses...only teacher
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

// get prereq
router.get("/:id/prerequisites", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT c.* 
       FROM prerequisites p
       JOIN courses c ON p.prerequisite_id = c.id
       WHERE p.course_id = $1`,
      [id]
    );
    
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id/prerequisites", verifyToken, async (req, res) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ error: "Only teachers can update prerequisites" });
  }

  const { id } = req.params;
  const { prerequisiteIds } = req.body;
  
  try {
    // delete old prereq
    await pool.query("DELETE FROM prerequisites WHERE course_id = $1", [id]);
    
    // add new 
    if (prerequisiteIds && prerequisiteIds.length > 0) {
      for (const prereqId of prerequisiteIds) {
        await pool.query(
          "INSERT INTO prerequisites (course_id, prerequisite_id) VALUES ($1, $2)",
          [id, prereqId]
        );
      }
    }
    
    // return updtaet
    const courseResult = await pool.query("SELECT * FROM courses WHERE id = $1", [id]);
    const prerequisitesResult = await pool.query(
      "SELECT prerequisite_id FROM prerequisites WHERE course_id = $1",
      [id]
    );
    
    const course = courseResult.rows[0];
    course.prerequisites = prerequisitesResult.rows.map(row => row.prerequisite_id);
    
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ck prereq
router.get("/:id/check-prerequisites/:studentId", verifyToken, async (req, res) => {
  const { id: courseId, studentId } = req.params;
  
  try {
    
    const prerequisitesResult = await pool.query(
      "SELECT prerequisite_id FROM prerequisites WHERE course_id = $1",
      [courseId]
    );
    
    const prerequisiteIds = prerequisitesResult.rows.map(row => row.prerequisite_id);
    
    if (prerequisiteIds.length === 0) {
      return res.json({
        canEnroll: true,
        missingPrerequisites: []
      });
    }
    
    //no f should be to get new class
    const completedCoursesResult = await pool.query(
      `SELECT DISTINCT g.course_id 
       FROM grades g
       WHERE g.student_id = $1 AND g.grade != 'F'`,
      [studentId]
    );
    
    const completedCourseIds = completedCoursesResult.rows.map(row => row.course_id);
    const missingPrerequisites = [];
    
  
    if (prerequisiteIds.length > 0) {
      const missingIds = prerequisiteIds.filter(id => !completedCourseIds.includes(id));
      
      if (missingIds.length > 0) {
       
        const missingCoursesResult = await pool.query(
          "SELECT id, name FROM courses WHERE id = ANY($1)",
          [missingIds]
        );
        
        missingPrerequisites.push(...missingCoursesResult.rows.map(c => c.name));
      }
    }
    
    res.json({
      canEnroll: missingPrerequisites.length === 0,
      missingPrerequisites
    });
  } catch (err) {
    console.error("Error checking prerequisites:", err);
    res.status(400).json({ error: err.message });
  }
});


router.get("/with-prerequisites/all", verifyToken, async (req, res) => {
  try {
    const coursesResult = await pool.query("SELECT * FROM courses ORDER BY id");
    const courses = coursesResult.rows;
    
    
    for (let course of courses) {
      const prereqResult = await pool.query(
        "SELECT prerequisite_id FROM prerequisites WHERE course_id = $1",
        [course.id]
      );
      course.prerequisites = prereqResult.rows.map(row => row.prerequisite_id);
    }
    
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;