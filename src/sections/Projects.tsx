import SectionHeading from "../components/SectionHeading";
import ProjectCard from "../components/ProjectCard";
import type { Project } from "../types";

type ProjectsProps = {
  projects: Project[];
  onOpenProject: (project: Project) => void;
};

export default function Projects({ projects, onOpenProject }: ProjectsProps) {
  return (
    <section id="projects" className="section container">
      <SectionHeading index="03" title="Selected projects" subtitle="A few things I've built while learning and solving problems." />
      <div className="projects-showcase">
        {projects.map((project, index) => (
          <ProjectCard key={project.name} project={project} index={index} onOpen={() => onOpenProject(project)} />
        ))}
      </div>
    </section>
  );
}
