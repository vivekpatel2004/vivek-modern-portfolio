import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Code2, Download, Github, Linkedin, Mail, MapPin, Sparkles } from "lucide-react";
import type { PortfolioContent } from "../types";

type HeroProps = {
  profile: PortfolioContent["profile"];
};

export default function Hero({ profile }: HeroProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const nameParts = profile.name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? profile.name;
  const remainingName = nameParts.slice(1).join(" ");
  const displayRole = /^full stack developer$/i.test(profile.role.trim())
    ? `AI ${profile.role}`
    : profile.role;
  const containerVariants = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.45,
        delayChildren: reduceMotion ? 0 : 0.04,
        staggerChildren: reduceMotion ? 0 : 0.1,
      },
    },
  };
  const itemVariants = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.42, ease: "easeOut" as const },
    },
  };

  return (
    <section id="home" className="hero container">
      <motion.div
        className="hero-copy"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <div className="eyebrow"><span className="status-dot" /> {profile.availability}</div>
          <p className="hero-kicker">HELLO, I'M</p>
        </motion.div>
        <motion.div className="hero-heading-group" variants={itemVariants}>
          <h1>{firstName} <span className="gradient-text">{remainingName}</span></h1>
          <h2>{displayRole}<span className="typing-cursor" aria-hidden="true">|</span></h2>
        </motion.div>
        <motion.div variants={itemVariants}>
          <p className="hero-intro">{profile.intro}</p>
          <div className="hero-meta">
            <span><MapPin size={15} aria-hidden="true" /> {profile.location}</span>
            <span><Sparkles size={15} aria-hidden="true" /> Python · React · AI</span>
          </div>
        </motion.div>
        <motion.div variants={itemVariants}>
          <div className="hero-buttons">
            {profile.resume ? (
              <a className="button button-primary" href={profile.resume} download="Vivek-Chaudhary-Resume.pdf">
                <Download size={17} aria-hidden="true" /> Download Resume
              </a>
            ) : (
              <button className="button button-primary resume-placeholder" type="button" disabled title="Add a real PDF through the admin CMS to enable downloads">
                <Download size={17} aria-hidden="true" /> Resume PDF coming soon
              </button>
            )}
          </div>
          <div className="social-row">
            <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github aria-hidden="true" /></a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin aria-hidden="true" /></a>
            <a href={`mailto:${profile.email}`} aria-label="Email"><Mail aria-hidden="true" /></a>
          </div>
        </motion.div>
      </motion.div>
      <motion.div
        className="hero-visual"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.1 }}
      >
        <div className="avatar-frame">
          {profile.avatar ? (
            <img src={profile.avatar} alt={`${profile.name} portrait`} />
          ) : (
            <div className="avatar-placeholder">
              <div className="avatar-initials">VC</div>
              <span>AI FULL STACK DEVELOPER</span>
              <Code2 size={42} aria-hidden="true" />
            </div>
          )}
        </div>
        <div className="floating-card float-top">
          <span className="float-icon"><Code2 size={17} aria-hidden="true" /></span>
          <span><b>Building</b><small>Useful digital products</small></span>
        </div>
        <div className="floating-card float-bottom">
          <span className="float-icon purple"><Sparkles size={17} aria-hidden="true" /></span>
          <span><b>AI + Full Stack</b><small>Curiosity into creation</small></span>
        </div>
      </motion.div>
      <a href="#about" className="scroll-cue"><span /> Scroll to explore <ArrowDown size={14} aria-hidden="true" /></a>
    </section>
  );
}
