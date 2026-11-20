import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "../components/SectionHeading";
import type { PortfolioContent } from "../types";

type AboutProps = Pick<PortfolioContent, "about" | "stats">;

export default function About({ about, stats }: AboutProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section id="about" className="section container">
      <SectionHeading index="01" title="A little about me" subtitle="Curious by nature. Builder by choice." />
      <div className="about-grid">
        <div className="about-copy">
          {about.map((paragraph, index) => (
            <motion.p
              key={index}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : index * 0.06 }}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              className="stat-card"
              key={`${stat.label}-${index}`}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : index * 0.06 }}
            >
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
