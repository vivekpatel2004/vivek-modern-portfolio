import { BriefcaseBusiness } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "../components/SectionHeading";
import type { PortfolioContent } from "../types";

type ExperienceProps = Pick<PortfolioContent, "experience">;

export default function Experience({ experience }: ExperienceProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section id="experience" className="section container">
      <SectionHeading index="04" title="Professional experience" subtitle="The roles and responsibilities that have shaped my work so far." />
      <div className="experience-list">
        {experience.map((item, index) => (
          <motion.article
            className="timeline-item experience-card"
            key={`${item.company}-${index}`}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : index * 0.08 }}
            whileHover={reduceMotion ? undefined : { y: -3, transition: { duration: 0.22, ease: "easeOut" } }}
          >
            <span className="timeline-dot" />
            <div className="timeline-top">
              <div>
                <h3>{item.role}</h3>
                <b><BriefcaseBusiness size={14} aria-hidden="true" /> {item.company}</b>
              </div>
              <span>{item.period}</span>
            </div>
            <small>{item.location}</small>
            <ul>{item.points.map((point, pointIndex) => <li key={`${point}-${pointIndex}`}>{point}</li>)}</ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
