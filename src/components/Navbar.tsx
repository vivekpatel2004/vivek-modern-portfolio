import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import type { Theme } from "../hooks/useTheme";

type NavbarProps = {
  theme: Theme;
  toggleTheme: () => void;
};

const links = ["About", "Skills", "Projects", "Experience", "Education", "Contact"];

export default function Navbar({ theme, toggleTheme }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const sections = links
      .map((item) => document.getElementById(item.toLowerCase()))
      .filter((section): section is HTMLElement => section !== null);
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)[0];
      if (current) setActiveSection(current.target.id);
    }, { rootMargin: "-25% 0px -65% 0px" });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      className="nav-wrap"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      <nav className="nav container" aria-label="Main navigation">
        <a className="brand" href="#home" aria-label="Vivek home">
          <span className="brand-mark">V</span>
          <span>vivek<span className="brand-dot">.</span></span>
        </a>
        <div id="primary-navigation" className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
          {links.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className={activeSection === item.toLowerCase() ? "active" : ""}
              aria-current={activeSection === item.toLowerCase() ? "location" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <button className="icon-button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
            {theme === "dark" ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          </button>
          <a className="nav-cta" href="#contact">Let's talk <ArrowUpRight size={15} aria-hidden="true" /></a>
          <button
            className="icon-button menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </nav>
    </motion.header>
  );
}
