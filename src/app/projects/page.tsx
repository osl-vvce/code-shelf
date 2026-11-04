import { promises as fs } from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import ProjectsExplorer, { ProjectItem } from '@/components/ProjectsExplorer';

export const metadata: Metadata = {
  title: 'Projects - Code-Shelf',
  description: 'Browse open-source projects built by VVCE students and club members.',
};

interface MemberData {
  name: string;
  username: string;
  avatar_url: string;
  projects?: {
    title: string;
    description: string;
    techStack: string[];
    link: string;
    liveDemo?: string;
  }[];
}

async function getAllProjects(): Promise<ProjectItem[]> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'members.json');
    const jsonData = await fs.readFile(filePath, 'utf-8');
    const members: MemberData[] = JSON.parse(jsonData);

    const allProjects: ProjectItem[] = [];

    members.forEach((member) => {
      if (Array.isArray(member.projects)) {
        member.projects.forEach((proj) => {
          allProjects.push({
            ...proj,
            author: {
              name: member.name,
              username: member.username,
              avatar_url: member.avatar_url,
            },
          });
        });
      }
    });

    return allProjects;
  } catch (error) {
    console.error('Failed to load projects from members.json:', error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <main className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
      <ProjectsExplorer projects={projects} />
    </main>
  );
}
