import { ArrowUpRight, LockKeyhole } from "lucide-react";
import CmsWorkspace from "./CmsWorkspace";
import type { PortfolioContent } from "../types";

export type AdminPageProps = {
  hasSupabase: boolean;
  session: boolean;
  email: string;
  password: string;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  signIn: () => void;
  content: PortfolioContent;
  publishedContent: PortfolioContent;
  editor: string;
  setEditor: (value: string) => void;
  savedDraft: string;
  draftSavedAt: string | null;
  lastPublishedAt: string | null;
  loading: boolean;
  contentLoadError: string | null;
  saveDraft: () => boolean;
  uploadResume: (file: File) => Promise<string>;
  uploadProjectImage: (file: File, projectName: string) => Promise<string>;
  uploadProfileAvatar: (file: File) => Promise<string>;
  save: () => Promise<boolean>;
  logout: () => void | Promise<void>;
  busy: boolean;
  message: string;
  close: () => void;
};

export default function AdminPage(props: AdminPageProps) {
  if (props.session) {
    const publishedDraft = JSON.stringify(props.publishedContent, null, 2);
    const isDraftDirty = Boolean(props.editor) && props.editor !== props.savedDraft;
    const hasUnpublishedChanges = Boolean(props.editor) && props.editor !== publishedDraft;

    return (
      <CmsWorkspace
        content={props.content}
        hasSupabase={props.hasSupabase}
        busy={props.busy}
        loading={props.loading}
        contentLoadError={props.contentLoadError}
        message={props.message}
        isDraftDirty={isDraftDirty}
        hasUnpublishedChanges={hasUnpublishedChanges}
        draftSavedAt={props.draftSavedAt}
        lastPublishedAt={props.lastPublishedAt}
        onUpdate={(update) => props.setEditor(JSON.stringify(update(props.content), null, 2))}
        onSaveDraft={props.saveDraft}
        onPublish={props.save}
        onPreview={props.close}
        onLogout={props.logout}
        uploadResume={props.uploadResume}
        uploadProjectImage={props.uploadProjectImage}
        uploadAvatar={props.uploadProfileAvatar}
      />
    );
  }

  return (
    <div className="admin-shell">
      <div className="admin-top">
        <a className="brand" href="/"><span className="brand-mark">V</span><span>portfolio<span className="brand-dot">.</span>cms</span></a>
        <button className="button button-ghost" onClick={props.close}>View website</button>
      </div>
      <div className="admin-content">
        <div className="admin-title">
          <span className="section-index">CONTENT MANAGEMENT</span>
          <h1>Portfolio CMS</h1>
          <p>Sign in to manage your portfolio through visual forms.</p>
        </div>
        <form className="admin-login" onSubmit={(event) => { event.preventDefault(); props.signIn(); }}>
          <div className="admin-login-icon"><LockKeyhole aria-hidden="true" /></div>
          <h2>Admin sign in</h2>
          <p>Use your existing Supabase admin account.</p>
          <label>Email<input required type="email" autoComplete="username" value={props.email} onChange={(event) => props.setEmail(event.target.value)} placeholder="admin@example.com" /></label>
          <label>Password<input required type="password" autoComplete="current-password" value={props.password} onChange={(event) => props.setPassword(event.target.value)} placeholder="Your password" /></label>
          <button className="button button-primary full-button" type="submit" disabled={props.busy}>
            {props.busy ? "Signing in…" : "Sign in"} <ArrowUpRight size={16} aria-hidden="true" />
          </button>
          {!props.hasSupabase && <p className="form-status warning">Supabase is not configured. Follow the setup instructions in README.md.</p>}
          {props.message && <p className="form-status warning" role="alert">{props.message}</p>}
        </form>
      </div>
    </div>
  );
}
