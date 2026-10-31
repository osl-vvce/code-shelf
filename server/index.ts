import express from "express";
import membersRouter from "./routes/members.js";
import projectsRouter from "./routes/projects.js";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// Middleware
app.use(express.json());

// CORS Configuration
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (_req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Code Shelf backend is running",
  });
});

// Modular route handlers
app.use("/api/members", membersRouter);
app.use("/api/projects", projectsRouter);

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});