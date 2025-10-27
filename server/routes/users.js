import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middlewares/verifyToken.js"; // ← Добавим аутентификацию

const router = express.Router();

// Get all users
router.get("/", verifyToken, async (req, res) => {  // ← Добавил verifyToken
  try {
    const result = await pool.query("SELECT id, name, email, role FROM users ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👇 ДОБАВЬ ЭТОТ ENDPOINT ДЛЯ ОДНОГО ПОЛЬЗОВАТЕЛЯ
// Get user by ID
router.get("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add user
router.post("/", verifyToken, async (req, res) => {  // ← Добавил verifyToken
  const { name, email, password, role } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, password, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user
router.put("/:id", verifyToken, async (req, res) => {  // ← Добавил verifyToken
  const { id } = req.params;
  const { name, email, password, role } = req.body;
  try {
    const result = await pool.query(
      "UPDATE users SET name=$1, email=$2, password=$3, role=$4 WHERE id=$5 RETURNING *",
      [name, email, password, role, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user
router.delete("/:id", verifyToken, async (req, res) => {  // ← Добавил verifyToken
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id=$1", [id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;