import { promises as fs } from 'fs';
import path from 'path';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ProjectCard from '@/components/ProjectCard';
import { Users, MapPin, BookOpen } from 'lucide-react';

interface Member {
    name: string;
    username: string;
    bio: string;
    avatar_url: string;
    skills: string[];
    projects: any[];
}

async function getMember(username: string): Promise<Member | undefined> {
  const filePath = path.join(process.cwd(), 'data', 'members.json');
  const jsonData = await fs.readFile(filePath, 'utf-8');
  const members: Member[] = JSON.parse(jsonData);
  return members.find(m => m.username === username);
}

type Props = {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const member = await getMember(username);

  if (!member) {
    notFound();
  }

  return (
    <main className="max-w-screen-xl mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4 md:-mt-8">
             <div className="md:sticky md:top-24">
                <div className="relative group">
                    <Image 
                        src={member.avatar_url}
                        alt={member.username}
                        width={260}
                        height={260}
                        className="rounded-full border border-[#d0d7de] w-full max-w-[260px] mx-auto md:mx-0 z-10 relative bg-white"
                        priority
                    />
                </div>
                
                <div className="mt-4 pb-4 border-b border-[#d0d7de] md:border-0">
                    <h1 className="text-2xl font-bold text-[#1f2328]">{member.name}</h1>
                    <h2 className="text-xl text-[#656d76] font-light">{member.username}</h2>
                    <p className="mt-4 text-[#1f2328] text-base leading-snug">{member.bio}</p>
                    
                    <button className="w-full mt-4 bg-[#f6f8fa] hover:bg-[#f3f4f6] text-[#24292f] border border-[rgba(31,35,40,0.15)] font-medium py-1.5 px-3 rounded-md text-sm transition-colors shadow-sm">
                        Follow
                    </button>
                    
                    <div className="flex items-center gap-2 mt-4 text-sm text-[#656d76]">
                         <Users size={16} />
                         <span className="font-bold text-[#1f2328]">12</span> followers
                         <span>·</span>
                         <span className="font-bold text-[#1f2328]">5</span> following
                    </div>
                    
                     <div className="mt-4 flex flex-col gap-2 text-sm text-[#1f2328]">
                         <div className="flex items-center gap-2">
                             <MapPin size={16} className="text-[#656d76]" />
                             <span>San Francisco, CA</span>
                         </div>
                    </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-[#d0d7de] md:border-0 md:pt-0">
                    <h3 className="font-semibold mb-2 text-[#1f2328]">Top Skills</h3>
                    <div className="flex flex-wrap gap-1">
                        {member.skills.map(skill => (
                            <span key={skill} className="bg-[#eff1f3] text-[#1f2328] px-2 py-0.5 rounded-full text-xs font-medium border border-transparent hover:border-[#d0d7de] cursor-default transition-colors">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
             </div>
        </div>

        <div className="w-full md:w-3/4">
             <div className="flex items-center gap-4 border-b border-[#d0d7de] mb-4 overflow-x-auto">
                 <div className="flex items-center gap-2 px-4 py-2 border-b-2 border-[#fd8c73] font-semibold text-[#1f2328] cursor-pointer whitespace-nowrap">
                     <BookOpen size={16} />
                     Repositories
                     <span className="bg-[#eff1f3] text-[#1f2328] px-2 py-0.5 rounded-full text-xs ml-1">
                         {member.projects.length}
                     </span>
                 </div>
                 <div className="px-4 py-2 text-[#656d76] hover:text-[#1f2328] cursor-pointer whitespace-nowrap">
                     Projects
                 </div>
                 <div className="px-4 py-2 text-[#656d76] hover:text-[#1f2328] cursor-pointer whitespace-nowrap">
                     Packages
                 </div>
                 <div className="px-4 py-2 text-[#656d76] hover:text-[#1f2328] cursor-pointer whitespace-nowrap">
                     Stars
                 </div>
             </div>

             <div className="flex flex-col">
                 {member.projects.map((project: any) => (
                     <ProjectCard key={project.title} project={project} />
                 ))}
             </div>
        </div>
      </div>
    </main>
  );
}
