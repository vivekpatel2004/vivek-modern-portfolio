import type { PortfolioContent, Project, Skill } from "./types";

// Local fallback content. After Supabase CMS is configured, published CMS content takes precedence.
export const skillCategories = [
  ["Programming Languages", ["Python", "JavaScript", "TypeScript", "SQL"]],
  ["Frontend", ["HTML5", "CSS3", "React.js", "Next.js", "Tailwind CSS", "Bootstrap", "React Router", "Vite"]],
  ["Backend", ["Node.js", "Express.js", "FastAPI", "Flask", "REST API Development"]],
  ["Database", ["MySQL", "PostgreSQL", "MongoDB", "Firebase Firestore", "Supabase", "SQLite", "Turso/libSQL"]],
  ["AI / Machine Learning", ["TensorFlow", "Keras", "CNN", "Hugging Face Transformers", "NLP", "Generative AI"]],
  ["AI Engineering", ["Gemini API", "RAG", "Embeddings", "Vector Search", "Prompt Engineering"]],
  ["Vector Databases", ["ChromaDB", "FAISS"]],
  ["Authentication", ["JWT", "bcrypt", "Firebase Authentication", "Supabase Auth"]],
  ["API & Testing Tools", ["Postman", "REST APIs", "API Testing", "Swagger/OpenAPI"]],
  ["Developer Tools", ["VS Code", "Git", "GitHub", "npm", "pnpm", "Vite"]],
  ["DevOps & Containers", ["Docker", "Docker Compose"]],
  ["Deployment", ["Vercel", "Render", "Netlify", "Railway"]],
  ["Cloud & Storage", ["Supabase", "Firebase", "Backblaze B2"]],
  ["Integrations", ["Spoonacular API", "YouTube API", "Google Maps API", "Resend"]],
  ["Other Tools", ["Figma", "GitHub Copilot", "Claude Code"]],
] as const;

export const skillCategoryNames = skillCategories.map(([category]) => category);

const skillMetadata: Record<string, Pick<Skill, "percent" | "level">> = {
  Python: { percent: 75, level: "Working knowledge" },
  JavaScript: { percent: 80, level: "Working knowledge" },
  TypeScript: { percent: 65, level: "Working knowledge" },
  SQL: { percent: 65, level: "Working knowledge" },
  HTML5: { percent: 85, level: "Project experience" },
  CSS3: { percent: 85, level: "Project experience" },
  "React.js": { percent: 80, level: "Project experience" },
  "Next.js": { percent: 55, level: "Working knowledge" },
  "Tailwind CSS": { percent: 75, level: "Project experience" },
  Bootstrap: { percent: 70, level: "Working knowledge" },
  "React Router": { percent: 70, level: "Project experience" },
  Vite: { percent: 75, level: "Project experience" },
  "Node.js": { percent: 70, level: "Project experience" },
  "Express.js": { percent: 70, level: "Project experience" },
  FastAPI: { percent: 75, level: "Project experience" },
  Flask: { percent: 50, level: "Working knowledge" },
  MySQL: { percent: 70, level: "Working knowledge" },
  PostgreSQL: { percent: 60, level: "Working knowledge" },
  MongoDB: { percent: 65, level: "Working knowledge" },
  "Firebase Firestore": { percent: 65, level: "Project experience" },
  Supabase: { percent: 70, level: "Project experience" },
  SQLite: { percent: 60, level: "Working knowledge" },
  TensorFlow: { percent: 60, level: "Project experience" },
  Keras: { percent: 60, level: "Project experience" },
  "Hugging Face Transformers": { percent: 60, level: "Project experience" },
  "Generative AI": { percent: 60, level: "Learning & building" },
  "Gemini API": { percent: 65, level: "Project experience" },
  RAG: { percent: 60, level: "Project experience" },
  ChromaDB: { percent: 55, level: "Project experience" },
  FAISS: { percent: 50, level: "Working knowledge" },
  JWT: { percent: 65, level: "Project experience" },
  "Firebase Authentication": { percent: 65, level: "Project experience" },
  Postman: { percent: 75, level: "Daily development workflow" },
  "Swagger/OpenAPI": { percent: 55, level: "Working knowledge" },
  Git: { percent: 75, level: "Daily development workflow" },
  GitHub: { percent: 80, level: "Daily development workflow" },
  npm: { percent: 75, level: "Daily development workflow" },
  pnpm: { percent: 60, level: "Working knowledge" },
  Docker: { percent: 60, level: "Working knowledge" },
  "Docker Compose": { percent: 55, level: "Working knowledge" },
  Vercel: { percent: 75, level: "Project deployment" },
  Render: { percent: 65, level: "Project deployment" },
  Netlify: { percent: 60, level: "Working knowledge" },
  Railway: { percent: 55, level: "Working knowledge" },
  "Backblaze B2": { percent: 55, level: "Project experience" },
  Figma: { percent: 55, level: "Working knowledge" },
};

const skills: Skill[] = skillCategories.flatMap(([category, names]) =>
  names.map((name): Skill => ({
    name,
    category,
    icon: name,
    ...(skillMetadata[name] ?? {}),
  })),
);

export const defaultContent: PortfolioContent = {
  profile: {
    name: "Vivek Chaudhary",
    role: "Full Stack Developer",
    location: "Delhi NCR, India",
    email: "vivekpatel9026@gmail.com",
    github: "https://github.com/vivekpatel2004",
    linkedin: "https://www.linkedin.com/in/vivek-chaudhary-a5a483271/",
    resume: "",
    intro: "I build practical software experiences, reliable Python backends and AI-powered applications that solve real problems.",
    availability: "Open to software development opportunities",
    avatar: ""
  },
  about: [
    "I'm a Computer Science graduate interested in full-stack engineering, Python backend development and AI-powered applications.",
    "I work with React, TypeScript, Python, FastAPI, Node.js and databases to build user interfaces, backend services, APIs and application workflows.",
    "I enjoy learning by building, improving existing systems and turning ideas into useful software."
  ],
  skills,
  projects: [
    {
      name: "AI Document Chatbot", eyebrow: "RAG · DOCUMENT INTELLIGENCE",
      description: "A document question-answering application that helps users understand uploaded files through contextual AI responses.",
      details: ["Upload and process PDF, DOCX and TXT files", "Extract, chunk and retrieve relevant document content", "Generate context-aware answers using Gemini and a RAG workflow"],
      stack: ["React", "TypeScript", "Python", "FastAPI", "Gemini API", "RAG", "Turso/libSQL", "Backblaze B2"],
      demo: "https://ai-document-chatbot-xi.vercel.app/", github: "https://github.com/vivekpatel2004/ai-document-chatbot",
      image: "", featured: true
    },
    {
      name: "SnapDiet", eyebrow: "AI · FOOD RECOGNITION",
      description: "An AI-powered food recognition application that connects image classification with recipe and nutrition discovery.",
      details: ["Upload food images for classification", "Use a CNN model built with TensorFlow and Keras", "Connect recipe and nutrition information through Spoonacular API"],
      stack: ["React", "Python", "FastAPI", "TensorFlow", "Keras", "MongoDB", "Spoonacular API"],
      demo: "https://snapdiet-frontend.vercel.app/", github: "", image: "", featured: true
    },
    {
      name: "TaskFlow", eyebrow: "FULL-STACK · PRODUCTIVITY",
      description: "A full-stack task management application with authentication and organized task workflows.",
      details: ["JWT-based authentication and protected APIs", "Create, update, filter and manage tasks", "Task status, priority and due-date workflows"],
      stack: ["React", "Node.js", "Express.js", "MySQL", "JWT", "bcrypt"],
      demo: "https://taskflow-app-three-ruby.vercel.app/", github: "", image: "", featured: true
    },
    {
      name: "Royal Phoenicia Hotel Management Website", eyebrow: "FULL STACK · HOTEL MANAGEMENT",
      description: "A hotel website project designed to present hotel services and room information through a responsive interface with authentication and backend integration.",
      details: [
        "Build a responsive hotel website interface.",
        "Create hotel information and room presentation sections.",
        "Integrate authentication using Firebase Authentication.",
        "Develop frontend components and backend application workflows.",
      ],
      stack: ["React", "JavaScript", "CSS3", "Firebase Authentication", "Node.js", "REST API"],
      demo: "", github: "", image: "", featured: true,
    },
    {
      name: "AI Text Summarizer", eyebrow: "ARTIFICIAL INTELLIGENCE · NLP",
      description: "An AI-based text summarization project that explores transformer models to convert lengthy text into shorter, meaningful summaries.",
      details: [
        "Generate concise summaries from longer text content.",
        "Explore transformer-based summarization models.",
        "Work with models such as BART and Pegasus.",
        "Apply natural language processing techniques to text summarization.",
      ],
      stack: ["Python", "Hugging Face Transformers", "NLP", "BART", "Pegasus", "SAMSum"],
      demo: "", github: "", image: "", featured: true,
    },
    {
      name: "Binaire Fresnel Assessment", eyebrow: "DEVELOPER ASSESSMENT · SOFTWARE DEVELOPMENT",
      description: "A software development assessment project. Its technology stack and functionality should be documented directly from the GitHub repository rather than assumed.",
      details: [
        "Technical assessment project developed as part of a software development evaluation.",
        "Repository source code and README should be reviewed to document its verified functionality.",
        "Add the actual technologies and implemented features after repository inspection.",
      ],
      stack: [],
      demo: "", github: "https://github.com/vivekpatel2004/Binaire_Freznel_Assessment", image: "", featured: true,
    }
  ],
  experience: [
    {
      role: "Software Implementation Engineer", company: "Satoop Media Pvt. Ltd.", period: "Jun 2025 – Jan 2026", location: "Delhi Cantonment, India",
      points: ["Supported implementation, configuration, testing and deployment of healthcare management software.", "Performed data mapping and validation to support accurate application workflows.", "Tested functionality, identified technical issues and coordinated with development teams during implementation."]
    },
    {
      role: "Web Development Intern", company: "Bharat Intern", period: "Nov 2024 – Jan 2025", location: "Remote",
      points: ["Developed responsive web interfaces using HTML, CSS and JavaScript.", "Built practice projects including a Netflix login interface, weather application and personal portfolio.", "Worked with frontend components, API integration and Git/GitHub workflows."]
    }
  ],
  education: [
    {
      degree: "Bachelor of Technology (B.Tech)",
      field: "Computer Science and Engineering",
      school: "Shri Ramswaroop Memorial University",
      location: "Lucknow, Uttar Pradesh, India",
      board: "University",
      period: "July 2021 – August 2025",
      detail: "CGPA: 6.72",
      description: "Completed a Bachelor's degree in Computer Science and Engineering in August 2025. Focused on Data Structures and Algorithms, Full-Stack Web Development and software development.",
    },
    {
      degree: "Class XII – Senior Secondary",
      field: "Science with Computer Application",
      school: "H R Inter College",
      location: "Sant Kabir Nagar, Uttar Pradesh, India",
      board: "Uttar Pradesh Board (UP Board)",
      period: "2021",
      detail: "Percentage: 71%",
      description: "Completed Senior Secondary education in 2021 through the Uttar Pradesh Board, studying Science with Computer Application.",
    },
    {
      degree: "Class X – Secondary",
      field: "Science with Computer Application",
      school: "H R Inter College",
      location: "Sant Kabir Nagar, Uttar Pradesh, India",
      board: "Uttar Pradesh Board (UP Board)",
      period: "2019",
      detail: "Percentage: 76%",
      description: "Completed Secondary education in 2019 through the Uttar Pradesh Board at H R Inter College, Sant Kabir Nagar.",
    },
  ],
  certifications: [
    { name: "The Complete 2024 Web Development Bootcamp", issuer: "Udemy", date: "Jan 2025", url: "https://www.udemy.com/certificate/UC-c255618f-c8a2-4d0c-94a8-a56c39ea6045/" },
    { name: "The Cybersecurity Threat Landscape", issuer: "LinkedIn Learning", date: "Mar 2024", url: "https://www.linkedin.com/learning/certificates/5729db5415530f832b88872f2f41e118e1c896e93590caae005b348fe5ae1f35?trk=share_certificate" }
  ],
  stats: [{ label: "Featured projects", value: "06" }, { label: "Core focus", value: "Full Stack + AI" }, { label: "Based in", value: "India" }]
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSkill(value: unknown): value is Skill {
  return isRecord(value)
    && typeof value.name === "string"
    && typeof value.category === "string"
    && typeof value.icon === "string"
    && (value.percent === undefined || typeof value.percent === "number")
    && (value.level === undefined || typeof value.level === "string");
}

function isProject(value: unknown): value is Project {
  return isRecord(value)
    && typeof value.name === "string"
    && typeof value.eyebrow === "string"
    && typeof value.description === "string"
    && Array.isArray(value.details)
    && value.details.every((detail) => typeof detail === "string")
    && Array.isArray(value.stack)
    && value.stack.every((technology) => typeof technology === "string")
    && typeof value.demo === "string"
    && typeof value.github === "string"
    && typeof value.image === "string"
    && typeof value.featured === "boolean";
}

function normalizeSkills(savedValue: unknown): Skill[] {
  return Array.isArray(savedValue) ? savedValue.filter(isSkill) : defaultContent.skills;
}

function normalizeProjects(savedValue: unknown): PortfolioContent["projects"] {
  return Array.isArray(savedValue) ? savedValue.filter(isProject) : defaultContent.projects;
}

function normalizeEducation(value: unknown): PortfolioContent["education"] {
  if (!Array.isArray(value)) return defaultContent.education;
  return value.filter((item): item is PortfolioContent["education"][number] =>
    isRecord(item)
    && typeof item.degree === "string"
    && typeof item.school === "string"
    && typeof item.period === "string"
    && typeof item.detail === "string"
    && ["field", "board", "location", "description"].every((key) =>
      item[key] === undefined || typeof item[key] === "string"
    )
  );
}

export function normalizePortfolioContent(published: PortfolioContent): PortfolioContent {
  return {
    ...defaultContent,
    ...published,
    profile: { ...defaultContent.profile, ...published.profile },
    skills: normalizeSkills(published.skills),
    projects: normalizeProjects(published.projects),
    education: normalizeEducation(published.education),
  };
}