import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "aichurekasylbek",
  host: "localhost",
  database: "viva_school",
  password: "",
  port: 5432,
});

pool.connect()
  .then(() => console.log("Connected to viva_school database"))
  .catch((err) => console.error("Database connection error:", err));

export default pool;
