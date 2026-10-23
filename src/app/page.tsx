
import { promises as fs } from 'fs';
import path from 'path';
import MemberCard from '@/components/MemberCard';
import { Users } from 'lucide-react';

interface Member {
    name: string;
    username: string;
    bio: string;
    avatar_url: string;
    skills: string[];
    projects: {
        title: string;
        description: string;
        techStack: string[];
        link: string;
        liveDemo?: string;
    }[];
}

async function getMembers(): Promise<Member[]> {
    const filePath = path.join(process.cwd(), 'data', 'members.json');
    const jsonData = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(jsonData);
}

export default async function Home() {
    const members = await getMembers();

    return (
        <main className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Page heading */}
            <div className="mb-8 flex flex-wrap items-center gap-3 border-b border-[#d0d7de] pb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f6f8fa] text-[#656d76]">
                    <Users size={22} strokeWidth={2} />
                </div>

                <h1 className="text-2xl font-semibold tracking-tight text-[#1f2328]">
                    People
                </h1>

                <span
                    aria-label={`${members.length} members`}
                    className="inline-flex min-w-8 items-center justify-center rounded-full border border-[#d0d7de] bg-[#f6f8fa] px-2.5 py-1 text-sm font-medium tabular-nums text-[#1f2328]"
                >
                    {members.length}
                </span>

                <p className="basis-full pl-0 text-sm text-[#656d76] sm:basis-auto sm:pl-1">
                    Meet the people building with Code-Shelf.
                </p>
            </div>

            {/* Responsive member grid */}
            {members.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
                    {members.map((member) => (
                        <MemberCard
                            key={member.username}
                            member={member}
                        />
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-[#d0d7de] bg-white px-6 py-12 text-center">
                    <Users
                        size={28}
                        className="mx-auto mb-3 text-[#8c959f]"
                    />
                    <h2 className="text-base font-semibold text-[#1f2328]">
                        No members yet
                    </h2>
                    <p className="mt-1 text-sm text-[#656d76]">
                        Members will appear here when they are added to Code-Shelf.
                    </p>
                </div>
            )}
        </main>
    );
}

