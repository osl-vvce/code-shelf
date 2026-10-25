"use client";

import { useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import MemberCard from "@/components/MemberCard";

interface Project {
  title: string;
  description: string;
  techStack: string[];
  link: string;
  liveDemo?: string;
}

interface Member {
  name: string;
  username: string;
  bio: string;
  avatar_url: string;
  skills: string[];
  projects: Project[];
}

export default function MemberDirectory({
  members,
}: {
  members: Member[];
}) {
  const [query, setQuery] = useState("");

  const filteredMembers = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    if (!searchTerm) return members;

    return members.filter((member) => {
      const searchableText = [
        member.name,
        member.username,
        member.bio,
        ...member.skills,
        ...member.projects.flatMap((project) => [
          project.title,
          project.description,
          ...project.techStack,
        ]),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchTerm);
    });
  }, [members, query]);

  return (
    <section aria-label="Member directory">
      <div className="mb-6">
        <label
          htmlFor="member-search"
          className="mb-2 block text-sm font-medium text-[#1f2328]"
        >
          Search members
        </label>

        <div className="relative max-w-xl">
          <Search
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#656d76]"
          />
          <input
            id="member-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, username, skill, or project..."
            className="w-full rounded-lg border border-[#d0d7de] bg-white py-3 pl-10 pr-4 text-sm text-[#1f2328] outline-none transition focus:border-[#0969da] focus:ring-2 focus:ring-[#0969da]/20"
          />
        </div>

        <p className="mt-2 text-sm text-[#656d76]" aria-live="polite">
          Showing {filteredMembers.length} of {members.length} members
        </p>
      </div>

      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
          {filteredMembers.map((member) => (
            <MemberCard key={member.username} member={member} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#d0d7de] bg-white px-6 py-12 text-center">
          <Users
            size={28}
            aria-hidden="true"
            className="mx-auto mb-3 text-[#8c959f]"
          />
          <h2 className="text-base font-semibold text-[#1f2328]">
            No matching members
          </h2>
          <p className="mt-1 text-sm text-[#656d76]">
            Try another name, username, skill, or project keyword.
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-4 rounded-md border border-[#d0d7de] px-4 py-2 text-sm font-medium text-[#0969da] hover:bg-[#f6f8fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0969da]"
          >
            Clear search
          </button>
        </div>
      )}
    </section>
  );
}
