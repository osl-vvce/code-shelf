import { Router } from "express";
import { promises as fs } from "node:fs";
import path from "node:path";

const router = Router();
const membersFile = path.join(process.cwd(), "data", "members.json");

export type Project = {
  title: string;
  description: string;
  techStack: string[];
  link: string;
  liveDemo?: string;
};

export type Member = {
  name: string;
  username: string;
  bio: string;
  avatar_url: string;
  skills: string[];
  projects: Project[];
  location?: string;
  batch?: string;
  github_url?: string;
  followers?: number;
  following?: number;
  website?: string;
};

export async function readMembers(): Promise<Member[]> {
  const contents = await fs.readFile(membersFile, "utf-8");
  return JSON.parse(contents) as Member[];
}

export async function writeMembers(members: Member[]): Promise<void> {
  await fs.writeFile(membersFile, `${JSON.stringify(members, null, 2)}\n`, "utf-8");
}

// GET /api/members - Fetch all members
router.get("/", async (_req, res) => {
  try {
    const members = await readMembers();
    res.status(200).json(members);
  } catch (error) {
    console.error("Error loading members:", error);
    res.status(500).json({ error: "Failed to load members" });
  }
});

// GET /api/members/:username - Fetch a member profile by username
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const members = await readMembers();
    const member = members.find(
      (m) => m.username.toLowerCase() === username.toLowerCase()
    );

    if (!member) {
      res.status(404).json({ error: `Member '@${username}' not found` });
      return;
    }

    res.status(200).json(member);
  } catch (error) {
    console.error("Error loading member:", error);
    res.status(500).json({ error: "Failed to load member profile" });
  }
});

// POST /api/members - Register a new member profile
router.post("/", async (req, res) => {
  try {
    const {
      name,
      username,
      bio,
      skills: rawSkills,
      avatar_url,
      location,
      batch,
      github_url,
      website,
    } = req.body || {};

    const cleanName = typeof name === "string" ? name.trim() : "";
    const cleanUsername = typeof username === "string" ? username.trim().toLowerCase() : "";
    const cleanBio = typeof bio === "string" ? bio.trim() : "";
    const cleanLocation = typeof location === "string" ? location.trim() : "";
    const cleanBatch = typeof batch === "string" ? batch.trim() : "";
    const cleanGithubUrl = typeof github_url === "string" ? github_url.trim() : "";
    const cleanWebsite = typeof website === "string" ? website.trim() : "";

    let skills: string[] = [];
    if (Array.isArray(rawSkills)) {
      skills = rawSkills.map((s) => String(s).trim()).filter(Boolean);
    } else if (typeof rawSkills === "string") {
      skills = rawSkills.split(",").map((s) => s.trim()).filter(Boolean);
    }
    skills = [...new Set(skills)];

    if (!cleanName || !cleanUsername || !cleanBio || skills.length === 0) {
      res.status(400).json({
        error: "Name, username, bio, and at least one skill are required.",
      });
      return;
    }

    // Check valid username format (alphanumeric, underscores, hyphens)
    if (!/^[a-zA-Z0-9_-]{2,30}$/.test(cleanUsername)) {
      res.status(400).json({
        error: "Username must be 2-30 characters and contain only letters, numbers, hyphens, and underscores.",
      });
      return;
    }

    const members = await readMembers();
    const existing = members.find(
      (m) => m.username.toLowerCase() === cleanUsername
    );

    if (existing) {
      res.status(409).json({
        error: `Username '@${cleanUsername}' is already taken.`,
      });
      return;
    }

    const cleanAvatarUrl =
      typeof avatar_url === "string" && avatar_url.trim()
        ? avatar_url.trim()
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`;

    const newMember: Member = {
      name: cleanName,
      username: cleanUsername,
      bio: cleanBio,
      avatar_url: cleanAvatarUrl,
      skills,
      projects: [],
      ...(cleanLocation ? { location: cleanLocation } : {}),
      ...(cleanBatch ? { batch: cleanBatch } : {}),
      ...(cleanGithubUrl ? { github_url: cleanGithubUrl } : {}),
      ...(cleanWebsite ? { website: cleanWebsite } : {}),
    };

    members.push(newMember);
    await writeMembers(members);

    res.status(201).json({
      message: "Member registered successfully.",
      member: newMember,
    });
  } catch (error) {
    console.error("Error creating member:", error);
    res.status(500).json({ error: "Failed to create member profile." });
  }
});

export default router;
