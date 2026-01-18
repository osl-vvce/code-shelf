import Link from 'next/link';
import Image from 'next/image';

interface Member {
    name: string;
    username: string;
    bio: string;
    avatar_url: string;
}

export default function MemberCard({ member }: { member: Member }) {
    return (
        <div className="border border-[#d0d7de] rounded-md p-4 bg-white hover:bg-[#f6f8fa] transition-colors h-full flex flex-col">
            <div className="flex items-start gap-4">
                <Image 
                    src={member.avatar_url} 
                    alt={member.username} 
                    width={48} 
                    height={48} 
                    className="rounded-full border border-[#d0d7de]"
                />
                <div className="flex flex-col">
                    <Link href={`/${member.username}`} className="font-semibold text-[#1f2328] hover:text-[#0969da] text-lg leading-tight">
                        {member.name}
                    </Link>
                    <span className="text-[#656d76] text-sm font-light">
                        {member.username}
                    </span>
                </div>
            </div>
            <p className="mt-3 text-sm text-[#1f2328] line-clamp-2 flex-grow">
                {member.bio}
            </p>
        </div>
    )
}
