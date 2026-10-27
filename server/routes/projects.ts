
import { Router } from "express";
import { pool } from "../db";

const router = Router();

// GET /api/projects
// Search, filter, and paginate projects.
router.get("/", async (req, res) => {
  try {
    const { search, tech, category } = req.query;
    const limit = Number(req.query.limit ?? 10);
    const offset = Number(req.query.offset ?? 0);

    const conditions: string[] = [];
    const values: (string | number)[] = [];

    if (typeof search === "string" && search.trim()) {
      values.push(`%${search.trim()}%`);
      conditions.push(
        `(title ILIKE $${values.length} OR description ILIKE $${values.length})`
      );
    }

    if (typeof tech === "string" && tech.trim()) {
      values.push(tech.trim());
      conditions.push(`$${values.length} = ANY(tech_stack)`);
    }

    if (typeof category === "string" && category.trim()) {
      values.push(category.trim());
      conditions.push(`category ILIKE $${values.length}`);
    }

    if (
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100 ||
      !Number.isInteger(offset) ||
      offset < 0
    ) {
      return res.status(400).json({
        status: "error",
        message: "limit must be 1–100 and offset must be 0 or greater",
      });
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    values.push(limit);
    const limitParam = `$${values.length}`;

    values.push(offset);
    const offsetParam = `$${values.length}`;

    const result = await pool.query(
      `SELECT id, title, description, tech_stack, category,
              github_url, created_at
       FROM projects
       ${whereClause}
       ORDER BY id
       LIMIT ${limitParam} OFFSET ${offsetParam}`,
      values
    );

    return res.status(200).json({
      status: "ok",
      count: result.rows.length,
      projects: result.rows,
    });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch projects",
    });
  }
});

// GET /api/projects/:id
// Retrieve one project.
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        status: "error",
        message: "Project ID must be a positive integer",
      });
    }

    const result = await pool.query(
      `SELECT id, title, description, tech_stack, category,
              github_url, created_at
       FROM projects WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Project not found",
      });
    }

    return res.status(200).json({
      status: "ok",
      project: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch project",
    });
  }
});

// POST /api/projects
// Create a project.
router.post("/", async (req, res) => {
  try {
    const { title, description, tech_stack, category, github_url } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      !Array.isArray(tech_stack) ||
      !tech_stack.every(
        (tech: unknown) => typeof tech === "string" && tech.trim().length > 0
      )
    ) {
      return res.status(400).json({
        status: "error",
        message: "A title and valid tech_stack array are required",
      });
    }

    if (
      (description != null && typeof description !== "string") ||
      (category != null && typeof category !== "string") ||
      (github_url != null && typeof github_url !== "string")
    ) {
      return res.status(400).json({
        status: "error",
        message: "Invalid description, category, or GitHub URL",
      });
    }

    const result = await pool.query(
      `INSERT INTO projects
        (title, description, tech_stack, category, github_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, description, tech_stack, category,
                 github_url, created_at`,
      [
        title.trim(),
        description ?? null,
        tech_stack.map((tech: string) => tech.trim()),
        category ?? null,
        github_url ?? null,
      ]
    );

    return res.status(201).json({
      status: "ok",
      message: "Project created successfully",
      project: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to create project:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to create project",
    });
  }
});

// PUT /api/projects/:id
// Update an existing project.
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tech_stack, category, github_url } = req.body;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        status: "error",
        message: "Project ID must be a positive integer",
      });
    }

    if (
      typeof title !== "string" ||
      !title.trim() ||
      !Array.isArray(tech_stack) ||
      !tech_stack.every(
        (tech: unknown) => typeof tech === "string" && tech.trim().length > 0
      ) ||
      (description != null && typeof description !== "string") ||
      (category != null && typeof category !== "string") ||
      (github_url != null && typeof github_url !== "string")
    ) {
      return res.status(400).json({
        status: "error",
        message: "Provide a valid title, tech_stack, and optional project fields",
      });
    }

    const result = await pool.query(
      `UPDATE projects
       SET title = $1, description = $2, tech_stack = $3,
           category = $4, github_url = $5
       WHERE id = $6
       RETURNING id, title, description, tech_stack, category,
                 github_url, created_at`,
      [
        title.trim(),
        description ?? null,
        tech_stack.map((tech: string) => tech.trim()),
        category ?? null,
        github_url ?? null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Project not found",
      });
    }

    return res.status(200).json({
      status: "ok",
      message: "Project updated successfully",
      project: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to update project:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to update project",
    });
  }
});

// DELETE /api/projects/:id
// Delete a project.
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        status: "error",
        message: "Project ID must be a positive integer",
      });
    }

    const result = await pool.query(
      "DELETE FROM projects WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Project not found",
      });
    }

    return res.status(200).json({
      status: "ok",
      message: "Project deleted successfully",
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to delete project",
    });
  }
});

export default router;
