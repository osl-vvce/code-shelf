import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Project = {
  title: string;
  description: string;
  techStack: string[];
  link: string;
  liveDemo?: string;
};

type Member = {
  name: string;
  username: string;
  bio: string;
  avatar_url: string;
  skills: string[];
  projects: Project[];
};

const membersFile = path.join(process.cwd(), "data", "members.json");

async function readMembers(): Promise<Member[]> {
  const contents = await fs.readFile(membersFile, "utf8");
  return JSON.parse(contents) as Member[];
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const members = await readMembers();
    return NextResponse.json(
      members.map(({ name, username }) => ({ name, username })),
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to load student profiles." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "A project payload is required." }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const username = typeof input.username === "string" ? input.username.trim() : "";
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const description = typeof input.description === "string" ? input.description.trim() : "";
  const link = typeof input.link === "string" ? input.link.trim() : "";
  const liveDemo = typeof input.liveDemo === "string" ? input.liveDemo.trim() : "";
  const rawTechStack = typeof input.techStack === "string" ? input.techStack : "";

  const techStack = rawTechStack
    .split(",")
    .map((technology) => technology.trim())
    .filter(Boolean)
    .filter((technology, index, all) => all.indexOf(technology) === index);

  if (!username || !title || !description || !link || techStack.length === 0) {
    return NextResponse.json(
      { error: "Student, title, description, GitHub URL, and at least one technology are required." },
      { status: 400 },
    );
  }

  if (title.length > 100 || description.length > 1000 || techStack.length > 20 ||
      techStack.some((technology) => technology.length > 40)) {
    return NextResponse.json(
      { error: "One or more fields exceed the allowed length." },
      { status: 400 },
    );
  }

  if (!isHttpUrl(link) || !/^https?:\/\/(www\.)?github\.com\//i.test(link)) {
    return NextResponse.json(
      { error: "Enter a valid GitHub repository URL." },
      { status: 400 },
    );
  }

  if (liveDemo && !isHttpUrl(liveDemo)) {
    return NextResponse.json(
      { error: "The live demo must be a valid HTTP or HTTPS URL." },
      { status: 400 },
    );
  }

  try {
    const members = await readMembers();
    const member = members.find((item) => item.username === username);

    if (!member) {
      return NextResponse.json({ error: "Student profile was not found." }, { status: 404 });
    }

    const duplicate = member.projects.some(
      (project) => project.title.toLowerCase() === title.toLowerCase(),
    );
    if (duplicate) {
      return NextResponse.json(
        { error: "A project with this title already exists on this profile." },
        { status: 409 },
      );
    }

    const project: Project = {
      title,
      description,
      techStack,
      link,
      ...(liveDemo ? { liveDemo } : {}),
    };

    member.projects.push(project);
    await fs.writeFile(membersFile, `${JSON.stringify(members, null, 2)}\n`, "utf8");

    return NextResponse.json({ message: "Project added successfully.", project }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to save the project. Please try again." },
      { status: 500 },
    );
  }
}
