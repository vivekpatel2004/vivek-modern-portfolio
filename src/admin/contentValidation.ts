import type { PortfolioContent } from "../types";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isOptionalUrl(value: string) {
  if (!value) return true;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

export function validatePortfolioContent(content: PortfolioContent): string | null {
  const { profile } = content;
  if (!profile.name.trim() || !profile.role.trim()) {
    return "Profile name and professional role are required.";
  }
  if (!isValidEmail(profile.email)) {
    return "Enter a valid contact email address.";
  }
  for (const [label, value] of [
    ["GitHub URL", profile.github],
    ["LinkedIn URL", profile.linkedin],
    ["Résumé URL", profile.resume],
    ["Profile image URL", profile.avatar],
  ]) {
    if (!isOptionalUrl(value)) return `${label} must be an HTTPS URL or a site-relative path.`;
  }

  const invalidSkill = content.skills.find((skill) =>
    !skill.name.trim()
    || !skill.category.trim()
    || !skill.icon.trim()
    || (skill.percent !== undefined && (!Number.isFinite(skill.percent) || skill.percent < 0 || skill.percent > 100))
  );
  if (invalidSkill) {
    return "Every skill needs a name, category and icon; familiarity must be between 0 and 100.";
  }

  for (const project of content.projects) {
    if (!project.name.trim() || !project.description.trim()) {
      return "Every project needs a title and short description.";
    }
    if (!isOptionalUrl(project.demo) || !isOptionalUrl(project.github)) {
      return `Project links for ${project.name} must be valid HTTPS URLs.`;
    }
    if (project.details.some((detail) => !detail.trim()) || project.stack.some((technology) => !technology.trim())) {
      return `Remove empty details or technology tags from ${project.name}.`;
    }
  }

  if (content.experience.some((item) =>
    !item.role.trim()
    || !item.company.trim()
    || !item.period.trim()
    || item.points.some((point) => !point.trim())
  )) {
    return "Each experience entry needs a role, company and period; remove empty responsibilities.";
  }

  if (content.education.some((item) => !item.degree.trim() || !item.school.trim() || !item.period.trim())) {
    return "Each education entry needs a qualification, school and study period.";
  }

  if (content.certifications.some((item) =>
    !item.name.trim()
    || !item.issuer.trim()
    || !isOptionalUrl(item.url)
  )) {
    return "Each certification needs a name and issuer, and any credential URL must be valid.";
  }

  if (content.about.some((paragraph) => !paragraph.trim())) {
    return "Remove empty About paragraphs before saving.";
  }

  return null;
}
