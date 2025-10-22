import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// main 
app.get('/', (req, res) => {
  res.json({ message: 'Hello! Viva Online School Server is running!' });
});

//check connection to db
app.get("/api/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "✅ Server and Database connected successfully!",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});


//server 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});