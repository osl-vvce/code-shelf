
import "dotenv/config";
import express from "express";
import { pool } from "./db";
import projectsRouter from "./routes/projects";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(express.json());

app.use("/api/projects", projectsRouter);

app.use("/api/projects", projectsRouter);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Code Shelf backend is running",
  });
});

app.get("/api/db-health", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS time");

    res.status(200).json({
      status: "ok",
      message: "Database connected successfully",
      databaseTime: result.rows[0].time,
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
});


app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});
