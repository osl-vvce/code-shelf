import Link from 'next/link';

interface Project {
    title: string;
    description: string;
    techStack: string[];
    link: string;
}

export default function ProjectCard({ project }: { project: Project }) {
    const getColor = (tech: string) => {
        const colors: {[key: string]: string} = {
            "React": "#61dafb",
            "TypeScript": "#3178c6",
            "JavaScript": "#f1e05a",
            "Python": "#3572A5",
            "Java": "#b07219",
            "Go": "#00ADD8",
            "Vue.js": "#41b883",
            "HTML": "#e34c26",
            "CSS": "#563d7c",
            "Node.js": "#339933",
            "C++": "#f34b7d",
            "Swift": "#ffac45",
            "Kotlin": "#A97BFF",
            "Rust": "#dea584",
            "PHP": "#4F5D95",
            "Three.js": "#000000", 
            "Docker": "#2496ed",
            "AWS": "#ec912d"
        };
        return colors[tech] || "#8b949e";
    };

    return (
        <div className="border-b border-[#d0d7de] py-6 first:pt-0">
            <div className="flex items-baseline gap-2">
                <Link href={project.link} target="_blank" className="text-[#0969da] font-semibold text-xl hover:underline">
                    {project.title}
                </Link>
                <span className="text-xs border border-[#d0d7de] rounded-full px-2 py-0.5 text-[#656d76] font-medium">Public</span>
            </div>
            <p className="text-[#656d76] text-sm mt-2 mb-4 w-full md:w-3/4">
                {project.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#656d76]">
                {project.techStack.map(tech => (
                     <div key={tech} className="flex items-center gap-1">
                        <span 
                            className="w-3 h-3 rounded-full inline-block" 
                            style={{ backgroundColor: getColor(tech) }}
                        ></span>
                        <span>{tech}</span>
                     </div>
                 ))}
            </div>
        </div>
    )
}
