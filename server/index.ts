import express from "express";
import membersRouter from "./routes/members.js";
import projectsRouter from "./routes/projects.js";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(express.json());

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Code Shelf backend is running",
  });
});

// Modular routes
app.use("/api/members", membersRouter);
app.use("/api/projects", projectsRouter);

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});