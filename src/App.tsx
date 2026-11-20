import { lazy, Suspense, useCallback, useState } from "react";
import BackToTop from "./components/BackToTop";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProjectModal from "./components/ProjectModal";
import { usePortfolio } from "./hooks/usePortfolio";
import { useTheme } from "./hooks/useTheme";
import { hasSupabase } from "./lib/supabase";
import About from "./sections/About";
import Contact from "./sections/Contact";
import Education from "./sections/Education";
import Experience from "./sections/Experience";
import Hero from "./sections/Hero";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";
import type { Project } from "./types";

const AdminPage = lazy(() => import("./admin/AdminPage"));

export default function App() {
  const [adminOpen, setAdminOpen] = useState(() => location.pathname === "/admin");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const { theme, setTheme } = useTheme();
  const portfolio = usePortfolio(adminOpen);
  const closeProject = useCallback(() => setActiveProject(null), []);

  function openAdmin() {
    history.pushState({}, "", "/admin");
    setAdminOpen(true);
  }

  function closeAdmin() {
    history.pushState({}, "", "/");
    setAdminOpen(false);
  }

  if (adminOpen) {
    return (
      <Suspense fallback={<div className="admin-shell" role="status">Loading CMS…</div>}>
        <AdminPage
          hasSupabase={hasSupabase}
          session={portfolio.session}
          email={portfolio.email}
          password={portfolio.password}
          setEmail={portfolio.setEmail}
          setPassword={portfolio.setPassword}
          signIn={portfolio.signIn}
          content={portfolio.draftContent}
          publishedContent={portfolio.content}
          editor={portfolio.editor}
          setEditor={portfolio.setEditor}
          savedDraft={portfolio.savedDraft}
          draftSavedAt={portfolio.draftSavedAt}
          lastPublishedAt={portfolio.lastPublishedAt}
          loading={portfolio.contentLoading}
          contentLoadError={portfolio.contentLoadError}
          saveDraft={portfolio.saveDraft}
          uploadResume={portfolio.uploadResume}
          uploadProjectImage={portfolio.uploadProjectImage}
          uploadProfileAvatar={portfolio.uploadProfileAvatar}
          save={portfolio.saveContent}
          logout={portfolio.logout}
          busy={portfolio.busy}
          message={portfolio.message}
          close={closeAdmin}
        />
      </Suspense>
    );
  }

  return (
    <div className="site-shell">
      <Navbar theme={theme} toggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")} />
      <main>
        <Hero profile={portfolio.content.profile} />
        <About about={portfolio.content.about} stats={portfolio.content.stats} />
        <Skills skills={portfolio.content.skills} />
        <Projects projects={portfolio.content.projects} onOpenProject={setActiveProject} />
        <Experience experience={portfolio.content.experience} />
        <Education
          education={portfolio.content.education}
          certifications={portfolio.content.certifications}
        />
        <Contact profile={portfolio.content.profile} />
      </main>
      <Footer name={portfolio.content.profile.name} openAdmin={openAdmin} />
      <ProjectModal project={activeProject} close={closeProject} />
      <BackToTop />
    </div>
  );
}
