import { Router } from "express";
import { readMembers, writeMembers, type Project } from "./members.js";

const router = Router();

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// GET /api/projects - Get all projects with optional ?tech=, ?search=, and ?username= filtering
router.get("/", async (req, res) => {
  try {
    const { tech, search, username } = req.query;
    const members = await readMembers();

    let allProjects = members.flatMap((m) =>
      (m.projects || []).map((p) => ({
        ...p,
        author: {
          name: m.name,
          username: m.username,
          avatar_url: m.avatar_url,
        },
      }))
    );

    if (typeof username === "string" && username.trim()) {
      const searchUsername = username.trim().toLowerCase();
      allProjects = allProjects.filter(
        (p) => p.author.username.toLowerCase() === searchUsername
      );
    }

    if (typeof tech === "string" && tech.trim()) {
      const searchTech = tech.trim().toLowerCase();
      allProjects = allProjects.filter((p) =>
        p.techStack.some((t) => t.toLowerCase() === searchTech)
      );
    }

    if (typeof search === "string" && search.trim()) {
      const query = search.trim().toLowerCase();
      allProjects = allProjects.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.author.name.toLowerCase().includes(query) ||
          p.author.username.toLowerCase().includes(query) ||
          p.techStack.some((t) => t.toLowerCase().includes(query))
      );
    }

    res.status(200).json(allProjects);
  } catch (error) {
    console.error("Error loading projects:", error);
    res.status(500).json({ error: "Failed to load projects" });
  }
});

// POST /api/projects - Add a new project to a member's profile
router.post("/", async (req, res) => {
  try {
    const {
      username,
      title,
      description,
      link,
      liveDemo,
      techStack: rawTechStack,
    } = req.body || {};

    const cleanUsername = typeof username === "string" ? username.trim() : "";
    const cleanTitle = typeof title === "string" ? title.trim() : "";
    const cleanDescription = typeof description === "string" ? description.trim() : "";
    const cleanLink = typeof link === "string" ? link.trim() : "";
    const cleanLiveDemo = typeof liveDemo === "string" ? liveDemo.trim() : "";

    let techStack: string[] = [];
    if (Array.isArray(rawTechStack)) {
      techStack = rawTechStack.map((t) => String(t).trim()).filter(Boolean);
    } else if (typeof rawTechStack === "string") {
      techStack = rawTechStack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
    techStack = [...new Set(techStack)];

    if (!cleanUsername || !cleanTitle || !cleanDescription || !cleanLink || techStack.length === 0) {
      res.status(400).json({
        error: "Student username, title, description, repository link, and at least one technology are required.",
      });
      return;
    }

    if (cleanTitle.length > 100 || cleanDescription.length > 1000) {
      res.status(400).json({
        error: "Title must be 100 characters or fewer and description must be 1000 characters or fewer.",
      });
      return;
    }

    if (!isHttpUrl(cleanLink) || !/^https?:\/\/(www\.)?github\.com\//i.test(cleanLink)) {
      res.status(400).json({ error: "Enter a valid GitHub repository URL." });
      return;
    }

    if (cleanLiveDemo && !isHttpUrl(cleanLiveDemo)) {
      res.status(400).json({ error: "The live demo must be a valid HTTP or HTTPS URL." });
      return;
    }

    const members = await readMembers();
    const member = members.find(
      (m) => m.username.toLowerCase() === cleanUsername.toLowerCase()
    );

    if (!member) {
      res.status(404).json({ error: `Student profile '@${cleanUsername}' not found.` });
      return;
    }

    const duplicate = (member.projects || []).some(
      (p) => p.title.toLowerCase() === cleanTitle.toLowerCase()
    );

    if (duplicate) {
      res.status(409).json({ error: "A project with this title already exists on this profile." });
      return;
    }

    const newProject: Project = {
      title: cleanTitle,
      description: cleanDescription,
      techStack,
      link: cleanLink,
      ...(cleanLiveDemo ? { liveDemo: cleanLiveDemo } : {}),
    };

    if (!member.projects) {
      member.projects = [];
    }
    member.projects.push(newProject);

    await writeMembers(members);

    res.status(201).json({
      message: "Project added successfully.",
      project: newProject,
    });
  } catch (error) {
    console.error("Error saving project:", error);
    res.status(500).json({ error: "Unable to save project." });
  }
});

// DELETE /api/projects - Remove a project from a member's profile
router.delete("/", async (req, res) => {
  try {
    const username = (req.body?.username || req.query?.username) as string | undefined;
    const title = (req.body?.title || req.query?.title) as string | undefined;

    const cleanUsername = typeof username === "string" ? username.trim() : "";
    const cleanTitle = typeof title === "string" ? title.trim() : "";

    if (!cleanUsername || !cleanTitle) {
      res.status(400).json({
        error: "Both username and project title are required to delete a project.",
      });
      return;
    }

    const members = await readMembers();
    const member = members.find(
      (m) => m.username.toLowerCase() === cleanUsername.toLowerCase()
    );

    if (!member) {
      res.status(404).json({ error: `Student profile '@${cleanUsername}' not found.` });
      return;
    }

    const initialCount = (member.projects || []).length;
    member.projects = (member.projects || []).filter(
      (p) => p.title.toLowerCase() !== cleanTitle.toLowerCase()
    );

    if (member.projects.length === initialCount) {
      res.status(404).json({
        error: `Project '${cleanTitle}' was not found on @${cleanUsername}'s profile.`,
      });
      return;
    }

    await writeMembers(members);

    res.status(200).json({
      message: `Project '${cleanTitle}' deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project." });
  }
});

export default router;
