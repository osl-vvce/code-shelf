"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, FolderGit2, Plus, ExternalLink, Globe, X } from 'lucide-react';

export interface ProjectItem {
  title: string;
  description: string;
  techStack: string[];
  link: string;
  liveDemo?: string;
  author: {
    name: string;
    username: string;
    avatar_url: string;
  };
}

const TECH_COLORS: Record<string, string> = {
  React: '#61dafb',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  'Vue.js': '#41b883',
  HTML: '#e34c26',
  CSS: '#563d7c',
  'Node.js': '#339933',
  'C++': '#f34b7d',
  Swift: '#ffac45',
  Kotlin: '#A97BFF',
  Rust: '#dea584',
  PHP: '#4F5D95',
  'Three.js': '#000000',
  Docker: '#2496ed',
  AWS: '#ec912d',
  Django: '#092e20',
  PostgreSQL: '#336791',
  'D3.js': '#f9a03f',
  Kafka: '#231f20',
  Redis: '#dc382d',
  Figma: '#f24e1e',
  Storybook: '#ff4785',
  Spring: '#6db33f',
  Kubernetes: '#326ce5',
};

function getTechColor(tech: string): string {
  return TECH_COLORS[tech] || '#8b949e';
}

export default function ProjectsExplorer({
  projects,
}: {
  projects: ProjectItem[];
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState<string>('All');
  const [avatarErrors, setAvatarErrors] = useState<Record<string, boolean>>({});

  // Collect unique technologies and their occurrences
  const techOptions = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((proj) => {
      proj.techStack.forEach((t) => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return [{ name: 'All', count: projects.length }, ...sorted.map(([name, count]) => ({ name, count }))];
  }, [projects]);

  // Filter projects by search query and selected technology
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesTech =
        selectedTech === 'All' ||
        project.techStack.some(
          (t) => t.toLowerCase() === selectedTech.toLowerCase()
        );

      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesTech;

      const matchesSearch =
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.author.name.toLowerCase().includes(query) ||
        project.author.username.toLowerCase().includes(query) ||
        project.techStack.some((t) => t.toLowerCase().includes(query));

      return matchesTech && matchesSearch;
    });
  }, [projects, searchQuery, selectedTech]);

  const handleAvatarError = (username: string) => {
    setAvatarErrors((prev) => ({ ...prev, [username]: true }));
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-4 border-b border-[#d0d7de] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f6f8fa] text-[#656d76]">
            <FolderGit2 size={22} strokeWidth={2} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-[#1f2328]">
                Projects
              </h1>
              <span
                aria-label={`${projects.length} total projects`}
                className="inline-flex min-w-8 items-center justify-center rounded-full border border-[#d0d7de] bg-[#f6f8fa] px-2.5 py-0.5 text-xs font-semibold tabular-nums text-[#1f2328]"
              >
                {projects.length}
              </span>
            </div>
            <p className="mt-1 text-sm text-[#656d76]">
              Explore open-source projects built by VVCE students and club members.
            </p>
          </div>
        </div>

        <Link
          href="/projects/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1f883d] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#1a7f37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f883d]/50"
        >
          <Plus size={16} />
          <span>New Project</span>
        </Link>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-4">
        {/* Search input */}
        <div className="relative max-w-lg">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#656d76]">
            <Search size={16} />
          </span>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name, description, author, or tech..."
            className="w-full rounded-lg border border-[#d0d7de] bg-white py-2 pl-9 pr-9 text-sm text-[#1f2328] placeholder:text-[#656d76] shadow-sm outline-none transition focus:border-[#0969da] focus:ring-2 focus:ring-[#0969da]/15"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute inset-y-0 right-2 flex items-center p-1 text-[#656d76] hover:text-[#1f2328]"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Tech Stack filter pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="mr-1 text-xs font-semibold text-[#656d76]">
            Filter:
          </span>
          {techOptions.map((tech) => {
            const isSelected = selectedTech === tech.name;
            return (
              <button
                key={tech.name}
                type="button"
                onClick={() => setSelectedTech(tech.name)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                  isSelected
                    ? 'border-[#0969da] bg-[#0969da] text-white shadow-sm'
                    : 'border-[#d0d7de] bg-[#f6f8fa] text-[#1f2328] hover:border-[#afb8c1] hover:bg-white'
                }`}
              >
                {tech.name !== 'All' && (
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: getTechColor(tech.name) }}
                  />
                )}
                <span>{tech.name}</span>
                <span
                  className={`text-[11px] tabular-nums ${
                    isSelected ? 'text-white/85' : 'text-[#656d76]'
                  }`}
                >
                  {tech.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Project cards listing */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const hasError = avatarErrors[project.author.username];
            const authorInitial = project.author.name
              ? project.author.name[0].toUpperCase()
              : project.author.username[0].toUpperCase();

            return (
              <article
                key={`${project.author.username}-${project.title}`}
                className="group flex flex-col justify-between rounded-xl border border-[#d0d7de] bg-white p-5 transition-all duration-200 hover:border-[#afb8c1] hover:shadow-[0_3px_8px_rgba(31,35,40,0.08)]"
              >
                <div>
                  {/* Author Header */}
                  <div className="mb-3 flex items-center justify-between border-b border-[#f0f2f4] pb-3">
                    <Link
                      href={`/${project.author.username}`}
                      className="flex items-center gap-2 group/author hover:underline"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#d0d7de] bg-[#f6f8fa] text-xs font-semibold text-[#0969da]">
                        {!hasError && project.author.avatar_url ? (
                          <Image
                            src={project.author.avatar_url}
                            alt={`${project.author.name}'s avatar`}
                            width={24}
                            height={24}
                            onError={() => handleAvatarError(project.author.username)}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span>{authorInitial}</span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-[#656d76] group-hover/author:text-[#0969da]">
                        @{project.author.username}
                      </span>
                    </Link>

                    <span className="rounded-full border border-[#d0d7de] bg-[#f6f8fa] px-2 py-0.5 text-[11px] font-medium text-[#656d76]">
                      Public
                    </span>
                  </div>

                  {/* Project Title */}
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-lg font-semibold tracking-tight text-[#0969da] hover:underline"
                    >
                      {project.title}
                    </Link>

                    <Link
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open repository for ${project.title}`}
                      className="text-[#656d76] transition-colors hover:text-[#0969da]"
                    >
                      <ExternalLink size={16} />
                    </Link>
                  </div>

                  {/* Project Description */}
                  <p className="mt-2 text-sm leading-relaxed text-[#57606a] line-clamp-3">
                    {project.description}
                  </p>
                </div>

                {/* Footer: Tech Stack and Links */}
                <div className="mt-5 space-y-3 pt-3 border-t border-[#f0f2f4]">
                  {/* Tech stack tags */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1.5 rounded-md bg-[#f6f8fa] px-2 py-0.5 text-xs text-[#24292f] border border-[#d0d7de]"
                      >
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: getTechColor(tech) }}
                        />
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Live Demo button if available */}
                  {project.liveDemo && (
                    <div className="pt-1">
                      <Link
                        href={project.liveDemo}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0969da] hover:underline"
                      >
                        <Globe size={13} />
                        <span>Live demo</span>
                      </Link>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-xl border border-dashed border-[#d0d7de] bg-[#f6f8fa] px-6 py-12 text-center">
          <FolderGit2 size={32} className="mx-auto mb-3 text-[#8c959f]" />
          <h2 className="text-base font-semibold text-[#1f2328]">
            No projects found
          </h2>
          <p className="mt-1 text-sm text-[#656d76]">
            {searchQuery || selectedTech !== 'All'
              ? 'No projects matched your current search and filter criteria.'
              : 'No projects have been submitted yet.'}
          </p>

          {(searchQuery || selectedTech !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedTech('All');
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#d0d7de] bg-white px-3.5 py-1.5 text-sm font-medium text-[#1f2328] shadow-sm transition hover:bg-[#f3f4f6]"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
