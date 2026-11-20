import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Github, Layers3 } from "lucide-react";
import TechIcon from "./TechIcon";
import type { Project } from "../types";

type ProjectCardProps = {
  project: Project;
  index: number;
  onOpen: () => void;
};

export default function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <motion.article
      className={`project-card ${index === 0 ? "project-featured" : ""}`}
      initial={reduceMotion ? false : { opacity: 0, y: 20, x: index % 2 ? 14 : -14 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : Math.min(index * 0.08, 0.16) }}
      whileHover={reduceMotion ? undefined : { y: -3, transition: { duration: 0.22, ease: "easeOut" } }}
    >
      <div className="project-open">
        <div className="project-content">
          <span className="project-eyebrow">{project.eyebrow}</span>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <div className="tag-list">
            {project.stack.map((technology) => (
              <span key={technology}><TechIcon name={technology} />{technology}</span>
            ))}
          </div>
          <button className="details-link" type="button" onClick={onOpen}>
            View case study <ArrowUpRight size={14} aria-hidden="true" />
          </button>
          <div className="project-actions">
            {project.demo && (
              <a className="project-action" href={project.demo} target="_blank" rel="noreferrer">
                Live demo <ExternalLink size={14} aria-hidden="true" />
              </a>
            )}
            {project.github && (
              <a className="project-action" href={project.github} target="_blank" rel="noreferrer">
                GitHub <Github size={14} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
        <button className="project-art" type="button" onClick={onOpen} aria-label={`View ${project.name} details`}>
          <div className="project-image-frame">
            {project.image ? (
              <img src={project.image} alt={`${project.name} project screenshot`} loading="lazy" />
            ) : (
              <div className="project-art-placeholder">
                <Layers3 size={36} aria-hidden="true" />
                <span>{project.name}</span>
                <small>{project.eyebrow}</small>
              </div>
            )}
            <span className="project-arrow"><ArrowUpRight aria-hidden="true" /></span>
          </div>
        </button>
      </div>
    </motion.article>
  );
}
