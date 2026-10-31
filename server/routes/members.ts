import { Router } from "express";
import { promises as fs } from "node:fs";
import path from "node:path";

const router = Router();
const membersFile = path.join(process.cwd(), "data", "members.json");

type Member = {
  name: string;
  username: string;
  bio: string;
  avatar_url: string;
  skills: string[];
  projects: unknown[];
  location?: string;
  batch?: string;
  github_url?: string;
  followers?: number;
  following?: number;
  website?: string;
};

async function readMembers(): Promise<Member[]> {
  const contents = await fs.readFile(membersFile, "utf-8");
  return JSON.parse(contents) as Member[];
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
      res.status(404).json({ error: `Member '${username}' not found` });
      return;
    }

    res.status(200).json(member);
  } catch (error) {
    console.error("Error loading member:", error);
    res.status(500).json({ error: "Failed to load member profile" });
  }
});

export default router;
