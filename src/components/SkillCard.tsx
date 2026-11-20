import { motion, useReducedMotion } from "framer-motion";
import { Code2 } from "lucide-react";
import TechIcon from "./TechIcon";
import type { Skill } from "../types";

export default function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const reduceMotion = useReducedMotion() ?? false;
  const percent = typeof skill.percent === "number"
    ? Math.max(0, Math.min(100, skill.percent))
    : null;

  return (
    <motion.article
      className="skill-card"
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : Math.min(index * 0.035, 0.24) }}
      whileHover={reduceMotion ? undefined : { y: -3, transition: { duration: 0.22, ease: "easeOut" } }}
    >
      <div className="skill-top">
        <span className="skill-icon">
          <TechIcon name={skill.icon} />
          <Code2 className="skill-fallback-icon" aria-hidden="true" />
        </span>
        <div className="skill-copy">
          <h3>{skill.name}</h3>
          {skill.level && <span className="skill-level">{skill.level}</span>}
        </div>
        {percent !== null && <span className="skill-percent">{percent}%</span>}
      </div>
      {percent !== null && (
        <div
          className="progress-track"
          role="meter"
          aria-label={`${skill.name} self-assessed familiarity`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <motion.span
            initial={reduceMotion ? false : { width: 0 }}
            whileInView={{ width: `${percent}%` }}
            viewport={{ once: true }}
            transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.1 }}
          />
        </div>
      )}
    </motion.article>
  );
}
