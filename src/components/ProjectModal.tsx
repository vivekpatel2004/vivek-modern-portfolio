import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ExternalLink, Github, X } from "lucide-react";
import TechIcon from "./TechIcon";
import type { Project } from "../types";

type ProjectModalProps = {
  project: Project | null;
  close: () => void;
};

export default function ProjectModal({ project, close }: ProjectModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    if (!project) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = document.querySelectorAll<HTMLElement>(
        ".project-modal a[href], .project-modal button:not([disabled])",
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [project, close]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="modal-backdrop"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          onClick={close}
        >
          <motion.div
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            initial={reduceMotion ? false : { y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button ref={closeButtonRef} className="modal-close" onClick={close} aria-label="Close project details">
              <X aria-hidden="true" />
            </button>
            <span className="project-eyebrow">{project.eyebrow}</span>
            <h2 id="project-modal-title">{project.name}</h2>
            <p>{project.description}</p>
            <h3>Key features</h3>
            <ul>{project.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
            <h3>Technology stack</h3>
            <div className="tag-list">{project.stack.map((technology) => <span key={technology}><TechIcon name={technology} />{technology}</span>)}</div>
            <div className="modal-actions">
              {project.demo && (
                <a className="button button-primary" href={project.demo} target="_blank" rel="noreferrer">
                  Live demo <ExternalLink size={15} aria-hidden="true" />
                </a>
              )}
              {project.github && (
                <a className="button button-ghost" href={project.github} target="_blank" rel="noreferrer">
                  GitHub <Github size={15} aria-hidden="true" />
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
