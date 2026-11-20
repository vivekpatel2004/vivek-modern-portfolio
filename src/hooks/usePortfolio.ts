import { useEffect, useRef, useState } from "react";
import { defaultContent, normalizePortfolioContent } from "../content";
import { validatePortfolioContent } from "../admin/contentValidation";
import { supabase } from "../lib/supabase";
import type { PortfolioContent } from "../types";

const RESUME_BUCKET = "portfolio-assets";
const ADMIN_DRAFT_KEY = "vivek-portfolio-cms-draft-v1";
const MAX_RESUME_SIZE = 6 * 1024 * 1024;
const MAX_PROJECT_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
const PROJECT_IMAGE_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parsePortfolioJson(value: string): PortfolioContent | null {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed) || !isRecord(parsed.profile)) return null;
    return normalizePortfolioContent(parsed as PortfolioContent);
  } catch {
    return null;
  }
}

export function usePortfolio(adminOpen: boolean) {
  const [content, setContent] = useState<PortfolioContent>(defaultContent);
  const [contentLoading, setContentLoading] = useState(Boolean(supabase));
  const [contentLoadError, setContentLoadError] = useState<string | null>(null);
  const [lastPublishedAt, setLastPublishedAt] = useState<string | null>(null);
  const [session, setSession] = useState(false);
  const [editor, setEditor] = useState("");
  const [savedDraft, setSavedDraft] = useState("");
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    void (async () => {
      try {
        const { data, error } = await supabase.from("portfolio_content").select("content, updated_at").eq("id", 1).maybeSingle();
        if (!active) return;
        if (error) {
          console.error("Could not load portfolio content:", error.message);
          setContentLoadError(error.message);
          setMessage(`Could not load published content: ${error.message}`);
          return;
        }
        setContentLoadError(null);
        if (data?.content) {
          setContent(normalizePortfolioContent(data.content as PortfolioContent));
        }
        if (typeof data?.updated_at === "string") setLastPublishedAt(data.updated_at);
      } catch (error) {
        if (active) {
          console.error("Could not load portfolio content:", error);
          const errorMessage = error instanceof Error ? error.message : "Could not load published content.";
          setContentLoadError(errorMessage);
          setMessage(`Could not load published content: ${errorMessage}`);
        }
      } finally {
        if (active) setContentLoading(false);
      }
    })();

    void (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!active) return;
        if (error) {
          console.error("Could not restore the admin session:", error.message);
          return;
        }
        setSession(Boolean(data.session));
      } catch (error) {
        if (active) console.error("Could not restore the admin session:", error);
      }
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      if (active) setSession(Boolean(next));
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const draftHydrated = useRef(false);
  useEffect(() => {
    if (!adminOpen) {
      draftHydrated.current = false;
      return;
    }
    if (contentLoading || draftHydrated.current) return;
    draftHydrated.current = true;

    const publishedDraft = JSON.stringify(content, null, 2);
    try {
      const localDraft = localStorage.getItem(ADMIN_DRAFT_KEY);
      if (localDraft) {
        const parsed = parsePortfolioJson(localDraft);
        if (!parsed) {
          setMessage("The saved browser draft is invalid. Published content is loaded instead; the saved draft was left untouched.");
          setEditor(publishedDraft);
          setSavedDraft(publishedDraft);
          return;
        }
        const serializedDraft = JSON.stringify(parsed, null, 2);
        setEditor(serializedDraft);
        setSavedDraft(serializedDraft);
        setDraftSavedAt(localStorage.getItem(`${ADMIN_DRAFT_KEY}-saved-at`));
        return;
      }
      setEditor(publishedDraft);
      setSavedDraft(publishedDraft);
      setDraftSavedAt(null);
    } catch (error) {
      setMessage(error instanceof Error ? `Could not restore the browser draft: ${error.message}` : "Could not restore the browser draft.");
      setEditor(publishedDraft);
      setSavedDraft(publishedDraft);
    }
  }, [adminOpen, contentLoading, content]);

  function saveDraft() {
    const parsed = parsePortfolioJson(editor);
    if (!parsed) {
      setMessage("The current draft could not be read. No draft was saved.");
      return false;
    }

    const serializedDraft = JSON.stringify(parsed, null, 2);
    const savedAt = new Date().toISOString();
    try {
      localStorage.setItem(ADMIN_DRAFT_KEY, serializedDraft);
      localStorage.setItem(`${ADMIN_DRAFT_KEY}-saved-at`, savedAt);
      setEditor(serializedDraft);
      setSavedDraft(serializedDraft);
      setDraftSavedAt(savedAt);
      setMessage("Draft saved in this browser. It is not published.");
      return true;
    } catch (error) {
      setMessage(error instanceof Error ? `Could not save the browser draft: ${error.message}` : "Could not save the browser draft.");
      return false;
    }
  }

  async function signIn() {
    if (!supabase) {
      setMessage("Configure Supabase environment variables first. See README.md.");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setMessage("Signed in successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  async function saveContent(): Promise<boolean> {
    if (contentLoadError) {
      setMessage("Cannot publish because published content could not be loaded.");
      return false;
    }
    if (!supabase || !session) {
      setMessage("Sign in to the CMS before publishing changes.");
      return false;
    }

    const parsed = parsePortfolioJson(editor);
    if (!parsed) {
      setMessage("The current draft could not be read. No content was published.");
      return false;
    }
    const validationError = validatePortfolioContent(parsed);
    if (validationError) {
      setMessage(validationError);
      return false;
    }

    setBusy(true);
    setMessage("");
    try {
      const updatedAt = new Date().toISOString();
      const { error } = await supabase.from("portfolio_content").upsert({
        id: 1,
        content: parsed,
        updated_at: updatedAt,
      });
      if (error) throw error;
      setContent(parsed);
      setEditor(JSON.stringify(parsed, null, 2));
      setSavedDraft(JSON.stringify(parsed, null, 2));
      setLastPublishedAt(updatedAt);
      setDraftSavedAt(null);
      try {
        localStorage.removeItem(ADMIN_DRAFT_KEY);
        localStorage.removeItem(`${ADMIN_DRAFT_KEY}-saved-at`);
      } catch (error) {
        setMessage(error instanceof Error
          ? `Published, but could not clear the local draft: ${error.message}`
          : "Published, but could not clear the local draft.");
        return true;
      }
      setMessage("Published! Your portfolio content is updated.");
      return true;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save content.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function uploadResume(file: File): Promise<string> {
    if (!supabase || !session) {
      throw new Error("Sign in to the CMS before uploading a résumé.");
    }

    if (!file.name.toLowerCase().endsWith(".pdf") || (file.type && file.type !== "application/pdf")) {
      throw new Error("Choose a PDF file.");
    }
    if (file.size === 0) {
      throw new Error("The PDF file is empty.");
    }
    if (file.size > MAX_RESUME_SIZE) {
      throw new Error("The PDF must be no larger than 6 MB.");
    }

    setBusy(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!sessionData.session) throw new Error("Your admin session has expired. Sign in again.");

      const path = `resumes/${crypto.randomUUID()}.pdf`;
      const { data, error } = await supabase.storage.from(RESUME_BUCKET).upload(path, file, {
        cacheControl: "3600",
        contentType: "application/pdf",
        upsert: false,
      });
      if (error) throw error;

      return supabase.storage.from(RESUME_BUCKET).getPublicUrl(data.path, { download: true }).data.publicUrl;
    } finally {
      setBusy(false);
    }
  }

  async function uploadProjectImage(file: File, projectName: string): Promise<string> {
    if (!supabase || !session) {
      throw new Error("Sign in to the CMS before uploading project images.");
    }

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    const contentType = PROJECT_IMAGE_TYPES[extension];
    if (!contentType || (file.type && file.type !== contentType)) {
      throw new Error("Choose a JPG, JPEG, PNG, or WebP image.");
    }
    if (file.size === 0) {
      throw new Error("The image file is empty.");
    }
    if (file.size > MAX_PROJECT_IMAGE_SIZE) {
      throw new Error("Each project image must be no larger than 5 MB.");
    }

    setBusy(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!sessionData.session) throw new Error("Your admin session has expired. Sign in again.");

      const slug = projectName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "project";
      const path = `projects/${slug}-${crypto.randomUUID()}.${extension}`;
      const { data, error } = await supabase.storage.from(RESUME_BUCKET).upload(path, file, {
        cacheControl: "3600",
        contentType,
        upsert: false,
      });
      if (error) throw error;

      return supabase.storage.from(RESUME_BUCKET).getPublicUrl(data.path).data.publicUrl;
    } finally {
      setBusy(false);
    }
  }

  async function uploadProfileAvatar(file: File): Promise<string> {
    if (!supabase || !session) {
      throw new Error("Sign in to the CMS before uploading a profile image.");
    }

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    const contentType = PROJECT_IMAGE_TYPES[extension];
    if (!contentType || (file.type && file.type !== contentType)) {
      throw new Error("Choose a JPG, JPEG, PNG, or WebP image.");
    }
    if (file.size === 0) {
      throw new Error("The image file is empty.");
    }
    if (file.size > MAX_AVATAR_SIZE) {
      throw new Error("The profile image must be no larger than 5 MB.");
    }

    setBusy(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!sessionData.session) throw new Error("Your admin session has expired. Sign in again.");

      const path = `profile/${crypto.randomUUID()}.${extension}`;
      const { data, error } = await supabase.storage.from(RESUME_BUCKET).upload(path, file, {
        cacheControl: "3600",
        contentType,
        upsert: false,
      });
      if (error) {
        if (error.message.toLowerCase().includes("row-level security")) {
          throw new Error("Storage denied this upload. Apply the approved admin-only INSERT policy for portfolio-assets/profile/ and try again.");
        }
        throw error;
      }

      return supabase.storage.from(RESUME_BUCKET).getPublicUrl(data.path).data.publicUrl;
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not sign out.");
    }
  }

  const draftContent = parsePortfolioJson(editor) ?? content;

  return {
    content,
    draftContent,
    contentLoading,
    contentLoadError,
    lastPublishedAt,
    session,
    editor,
    setEditor,
    savedDraft,
    draftSavedAt,
    email,
    setEmail,
    password,
    setPassword,
    message,
    busy,
    signIn,
    saveDraft,
    saveContent,
    uploadResume,
    uploadProjectImage,
    uploadProfileAvatar,
    logout,
  };
}
