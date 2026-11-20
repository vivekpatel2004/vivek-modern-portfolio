import { useEffect, useMemo, useState } from "react";
import { skillCategoryNames } from "../content";
import SectionHeading from "../components/SectionHeading";
import SkillCard from "../components/SkillCard";
import type { Skill } from "../types";

const legacyCategoryMap: Record<string, string> = {
  Languages: "Programming Languages",
  "Frontend Development": "Frontend",
  "Backend Development": "Backend",
  Databases: "Database",
  AI: "AI / Machine Learning",
  "AI / ML": "AI / Machine Learning",
  "AI & Machine Learning": "AI / Machine Learning",
  "Authentication & Security": "Authentication",
  "API Development & Testing": "API & Testing Tools",
  "Deployment & Cloud": "Deployment",
  "Design & Collaboration": "Other Tools",
  Tools: "Developer Tools",
};

const legacySkillCategoryMap: Record<string, string> = {
  Python: "Programming Languages",
  ChromaDB: "Vector Databases",
  FAISS: "Vector Databases",
  "Backblaze B2": "Cloud & Storage",
  "Firebase Authentication": "Authentication",
  "Supabase Auth": "Authentication",
  "Gemini API": "AI Engineering",
  "Google Gemini API": "AI Engineering",
  RAG: "AI Engineering",
  JWT: "Authentication",
  "JWT Authentication": "Authentication",
  Postman: "API & Testing Tools",
  Docker: "DevOps & Containers",
  "Docker Compose": "DevOps & Containers",
  Vercel: "Deployment",
  Render: "Deployment",
  Netlify: "Deployment",
  Railway: "Deployment",
  "Spoonacular API": "Integrations",
  "YouTube API": "Integrations",
  "Google Maps API": "Integrations",
  Resend: "Integrations",
  Figma: "Other Tools",
  "GitHub Copilot": "Other Tools",
  "Claude Code": "Other Tools",
};

const categorySet = new Set<string>(skillCategoryNames);

function categoryForSkill(skill: Skill) {
  if (categorySet.has(skill.category)) return skill.category;
  return legacySkillCategoryMap[skill.name] ?? legacyCategoryMap[skill.category] ?? skill.category;
}

export default function Skills({ skills }: { skills: Skill[] }) {
  const [activeCategory, setActiveCategory] = useState("");
  const categories = useMemo(
    () => [...new Set(skills.map(categoryForSkill))],
    [skills],
  );
  const filteredSkills = useMemo(
    () => skills.filter((skill) => categoryForSkill(skill) === activeCategory),
    [skills, activeCategory],
  );

  useEffect(() => {
    if (categories.length > 0 && !categories.includes(activeCategory)) {
      setActiveCategory(categories[0]);
    }
  }, [activeCategory, categories]);

  return (
    <section id="skills" className="section container">
      <SectionHeading index="02" title="My tech toolkit" subtitle="Technologies I use, explore and keep improving." />
      {categories.length > 0 ? (
        <>
          <div className="filter-row" role="group" aria-label="Filter skills by category">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-chip ${activeCategory === category ? "selected" : ""}`}
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="skills-grid">
            {filteredSkills.length ? filteredSkills.map((skill, index) => (
              <SkillCard key={`${skill.category}-${skill.name}`} skill={skill} index={index} />
            )) : <p className="empty-skills" role="status">No skills are currently published in this category.</p>}
          </div>
        </>
      ) : (
        <p className="empty-skills" role="status">No skills are currently published.</p>
      )}
      <p className="micro-note">Percentages are self-assessed indicators of familiarity, not standardized test scores.</p>
    </section>
  );
}
