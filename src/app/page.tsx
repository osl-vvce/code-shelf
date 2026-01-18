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
    projects: any[];
}

async function getMembers(): Promise<Member[]> {
  const filePath = path.join(process.cwd(), 'data', 'members.json');
  const jsonData = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(jsonData);
}

export default async function Home() {
  const members = await getMembers();

  return (
    <main className="max-w-screen-xl mx-auto px-4 md:px-8 py-8">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#d0d7de]">
        <Users className="text-[#656d76]" size={24} />
        <h1 className="text-2xl font-semibold text-[#1f2328]">People</h1>
        <span className="bg-[#eff1f3] text-[#1f2328] px-2 py-0.5 rounded-full text-sm font-medium border border-[#d0d7de]">
            {members.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
            <MemberCard key={member.username} member={member} />
        ))}
      </div>
    </main>
  );
}