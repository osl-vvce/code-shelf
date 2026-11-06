
import { promises as fs } from 'fs';
import path from 'path';
import MemberDirectory from '@/components/MemberDirectory';
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

            <MemberDirectory members={members} />
        </main>
    );
}
