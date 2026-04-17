'use client';

interface Project {
  id: string;
  title: string;
  time: string;
  color: string;
  height: string;
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative w-full mb-6 cursor-pointer">
      <div className="relative w-full rounded-[10px] overflow-hidden transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:z-10 glass-panel" style={{ height: project.height }}>
        
        {/* Background placeholder with image overlay capability */}
        <div className={`absolute inset-0 bg-gradient-to-b ${project.color} to-[#19191d] opacity-80`} />
        
        {/* Vignette (暗角) */}
        <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] group-hover:shadow-[inset_0_0_20px_rgba(0,0,0,0.4)] transition-shadow duration-500" />
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-semibold text-lg tracking-tight mb-1">{project.title}</h3>
          <p className="text-white/60 text-sm font-medium">{project.time}</p>
        </div>
      </div>
    </div>
  );
}