import { motion, useReducedMotion } from "framer-motion";

type SectionHeadingProps = {
  index: string;
  title: string;
  subtitle: string;
};

export default function SectionHeading({ index, title, subtitle }: SectionHeadingProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      className="section-heading"
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: reduceMotion ? 0 : 0.45 }}
    >
      <span className="section-index">{index} / 06</span>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </motion.div>
  );
}
