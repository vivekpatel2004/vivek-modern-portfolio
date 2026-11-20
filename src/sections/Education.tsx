import { Award, ExternalLink, GraduationCap } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "../components/SectionHeading";
import type { PortfolioContent } from "../types";

type EducationProps = Pick<PortfolioContent, "education" | "certifications">;

export default function Education({ education, certifications }: EducationProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section id="education" className="section container">
      <SectionHeading index="05" title="Education" subtitle="Academic background and certifications." />
      <div className="education-list">
        {education.map((item, index) => (
          <motion.article
            className="education-card"
            key={`${item.school}-${index}`}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : index * 0.08 }}
            whileHover={reduceMotion ? undefined : { y: -3, transition: { duration: 0.22, ease: "easeOut" } }}
          >
            <span className="education-icon"><GraduationCap aria-hidden="true" /></span>
            <div className="education-card-copy">
              <div className="timeline-top">
                <div><h3>{item.degree}</h3><b>{item.school}</b></div>
                <span>{item.period}</span>
              </div>
              <div className="education-meta">
                {item.field && <span>{item.field}</span>}
                {item.board && <span>{item.board}</span>}
                {item.location && <span>{item.location}</span>}
              </div>
              {item.detail && <p className="education-highlight">{item.detail}</p>}
              {item.description && <p>{item.description}</p>}
            </div>
          </motion.article>
        ))}
      </div>
      {certifications.length > 0 && (
        <div className="certifications-block">
          <h3 className="subsection-title"><Award size={18} aria-hidden="true" /> Certifications</h3>
          <div className="certifications-list">
            {certifications.map((certification, index) => (
              <motion.a
                className="cert-card"
                key={`${certification.name}-${index}`}
                href={certification.url}
                target="_blank"
                rel="noreferrer"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : index * 0.06 }}
                whileHover={reduceMotion ? undefined : { y: -3, transition: { duration: 0.22, ease: "easeOut" } }}
              >
                <span><b>{certification.name}</b><small>{certification.issuer} · {certification.date}</small></span>
                <ExternalLink size={16} aria-hidden="true" />
              </motion.a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
