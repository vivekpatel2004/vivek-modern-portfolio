import {
  SiAnthropic, SiBackblaze, SiBootstrap, SiDocker, SiExpress, SiFastapi, SiFigma,
  SiFirebase, SiFlask, SiGit, SiGithub, SiGithubcopilot, SiGooglegemini, SiGooglemaps,
  SiCss, SiHtml5, SiHuggingface, SiJavascript, SiJsonwebtokens, SiKeras, SiMongodb,
  SiMysql, SiNetlify, SiNextdotjs, SiNodedotjs, SiNpm, SiPnpm, SiPostgresql, SiPostman,
  SiPython, SiRailway, SiReact, SiReactrouter, SiRender, SiResend, SiSqlite, SiSwagger,
  SiSupabase, SiTailwindcss, SiTensorflow, SiTurso, SiTypescript, SiVercel, SiVite, SiYoutube,
} from "react-icons/si";
import type { IconType } from "react-icons";

type BrandIcon = {
  Icon: IconType;
  color: string;
};

const brandIcons: Record<string, BrandIcon> = {
  backblazeb2: { Icon: SiBackblaze, color: "#e21e29" },
  bootstrap: { Icon: SiBootstrap, color: "#7952b3" },
  claudecode: { Icon: SiAnthropic, color: "#d4a27f" },
  css: { Icon: SiCss, color: "#663399" },
  css3: { Icon: SiCss, color: "#663399" },
  docker: { Icon: SiDocker, color: "#2496ed" },
  express: { Icon: SiExpress, color: "#8a8a8a" },
  expressjs: { Icon: SiExpress, color: "#8a8a8a" },
  fastapi: { Icon: SiFastapi, color: "#009688" },
  firebase: { Icon: SiFirebase, color: "#ffca28" },
  firebaseauthentication: { Icon: SiFirebase, color: "#ffca28" },
  firebasefirestore: { Icon: SiFirebase, color: "#ffca28" },
  figma: { Icon: SiFigma, color: "#f24e1e" },
  flask: { Icon: SiFlask, color: "#94a3b8" },
  git: { Icon: SiGit, color: "#f05032" },
  github: { Icon: SiGithub, color: "#8b949e" },
  githubcopilot: { Icon: SiGithubcopilot, color: "#8b949e" },
  googlegeminiapi: { Icon: SiGooglegemini, color: "#8e75b2" },
  googlemapsapi: { Icon: SiGooglemaps, color: "#4285f4" },
  geminiapi: { Icon: SiGooglegemini, color: "#8b7ae6" },
  html5: { Icon: SiHtml5, color: "#e34f26" },
  huggingfacetransformers: { Icon: SiHuggingface, color: "#ffd21e" },
  javascript: { Icon: SiJavascript, color: "#f7df1e" },
  jsonwebtokens: { Icon: SiJsonwebtokens, color: "#d63aff" },
  jwt: { Icon: SiJsonwebtokens, color: "#d63aff" },
  keras: { Icon: SiKeras, color: "#d00000" },
  netlify: { Icon: SiNetlify, color: "#00c7b7" },
  mongodb: { Icon: SiMongodb, color: "#47a248" },
  mysql: { Icon: SiMysql, color: "#4479a1" },
  nextjs: { Icon: SiNextdotjs, color: "#a1a1aa" },
  nodedotjs: { Icon: SiNodedotjs, color: "#5fa04e" },
  nodejs: { Icon: SiNodedotjs, color: "#5fa04e" },
  npm: { Icon: SiNpm, color: "#cb3837" },
  nextdotjs: { Icon: SiNextdotjs, color: "#8a8a8a" },
  pnpm: { Icon: SiPnpm, color: "#f69220" },
  postgresql: { Icon: SiPostgresql, color: "#4169e1" },
  postman: { Icon: SiPostman, color: "#ff6c37" },
  python: { Icon: SiPython, color: "#3776ab" },
  react: { Icon: SiReact, color: "#61dafb" },
  reactjs: { Icon: SiReact, color: "#61dafb" },
  reactrouter: { Icon: SiReactrouter, color: "#ca4245" },
  railway: { Icon: SiRailway, color: "#a1a1aa" },
  render: { Icon: SiRender, color: "#46e3b7" },
  resend: { Icon: SiResend, color: "#a1a1aa" },
  sqlite: { Icon: SiSqlite, color: "#003b57" },
  swaggeropenapi: { Icon: SiSwagger, color: "#85ea2d" },
  supabase: { Icon: SiSupabase, color: "#3ecf8e" },
  supabaseauth: { Icon: SiSupabase, color: "#3ecf8e" },
  tailwindcss: { Icon: SiTailwindcss, color: "#06b6d4" },
  tensorflow: { Icon: SiTensorflow, color: "#ff6f00" },
  tursolibsql: { Icon: SiTurso, color: "#4ff8d2" },
  typescript: { Icon: SiTypescript, color: "#3178c6" },
  vercel: { Icon: SiVercel, color: "#a1a1aa" },
  vite: { Icon: SiVite, color: "#646cff" },
  youtubeapi: { Icon: SiYoutube, color: "#ff0000" },
};

function normalizeTechnology(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export default function TechIcon({ name }: { name: string }) {
  const brand = brandIcons[normalizeTechnology(name)];
  if (!brand) return null;

  const { Icon, color } = brand;
  return <Icon className="tech-icon" style={{ color }} aria-hidden="true" />;
}
