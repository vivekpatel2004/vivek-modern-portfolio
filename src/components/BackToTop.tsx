import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 560);
    window.addEventListener("scroll", updateVisibility, { passive: true });
    updateVisibility();
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className="back-to-top"
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })}
          aria-label="Back to top"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          whileHover={reduceMotion ? undefined : { y: -2 }}
        >
          <ArrowUp size={18} aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
