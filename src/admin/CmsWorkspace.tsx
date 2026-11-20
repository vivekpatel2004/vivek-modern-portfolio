import { useEffect, useMemo, useState, type ChangeEvent, type DragEvent, type ReactNode } from "react";
import {
  AlertCircle, ArrowDown, ArrowUp, Award, BookOpen, BriefcaseBusiness, CheckCircle2, Code2, Download,
  Eye, FileText, FolderKanban, GraduationCap, ImagePlus, LayoutDashboard, LogOut, Mail,
  Plus, Save, Send, Settings, Sparkles, Trash2, UploadCloud, UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { defaultContent, skillCategoryNames } from "../content";
import type { Experience, PortfolioContent, Project } from "../types";
import TechIcon from "../components/TechIcon";

type CmsSection =
  | "dashboard"
  | "profile"
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "certifications"
  | "resume"
  | "contact"
  | "settings";

type CmsWorkspaceProps = {
  content: PortfolioContent;
  hasSupabase: boolean;
  busy: boolean;
  loading: boolean;
  contentLoadError: string | null;
  message: string;
  isDraftDirty: boolean;
  hasUnpublishedChanges: boolean;
  draftSavedAt: string | null;
  lastPublishedAt: string | null;
  onUpdate: (update: (content: PortfolioContent) => PortfolioContent) => void;
  onSaveDraft: () => boolean;
  onPublish: () => Promise<boolean>;
  onPreview: () => void;
  onLogout: () => void | Promise<void>;
  uploadResume: (file: File) => Promise<string>;
  uploadProjectImage: (file: File, projectName: string) => Promise<string>;
  uploadAvatar: (file: File) => Promise<string>;
};
type Education = PortfolioContent["education"][number];

const sections: { id: CmsSection; label: string; icon: LucideIcon }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "profile", label: "Profile / Hero", icon: UserRound },
  { id: "about", label: "About", icon: BookOpen },
  { id: "skills", label: "Skills", icon: Code2 },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "experience", label: "Experience", icon: BriefcaseBusiness },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "contact", label: "Contact Information", icon: Mail },
  { id: "settings", label: "Settings", icon: Settings },
];

function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const next = [...items];
  const target = index + direction;
  if (target < 0 || target >= next.length) return next;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function formatDate(value: string | null) {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not available" : date.toLocaleString();
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  min,
  max,
  step,
  help,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "url" | "number";
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  help?: string;
  disabled?: boolean;
}) {
  return (
    <label className="cms-field">
      <span>{label}</span>
      <input
        className="cms-input"
        type={type}
        value={value}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
      {help && <small>{help}</small>}
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="cms-field cms-field-wide">
      <span>{label}</span>
      <textarea
        className="cms-textarea"
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="cms-field">
      <span>{label}</span>
      <select className="cms-input cms-select" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="cms-checkbox">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function StringListEditor({
  label,
  items,
  onChange,
  multiline = false,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <section className="cms-repeat-list" aria-label={label}>
      <div className="cms-repeat-heading">
        <h3>{label}</h3>
        <button className="cms-small-action" type="button" onClick={() => onChange([...items, ""])}>
          <Plus size={14} aria-hidden="true" /> Add
        </button>
      </div>
      {items.length === 0 && <p className="cms-muted">No entries yet.</p>}
      {items.map((item, index) => (
        <div className="cms-repeat-row" key={`${label}-${index}`}>
          {multiline ? (
            <textarea
              className="cms-textarea"
              rows={2}
              aria-label={`${label} ${index + 1}`}
              placeholder={placeholder}
              value={item}
              onChange={(event) => onChange(items.map((entry, itemIndex) => itemIndex === index ? event.target.value : entry))}
            />
          ) : (
            <input
              className="cms-input"
              aria-label={`${label} ${index + 1}`}
              placeholder={placeholder}
              value={item}
              onChange={(event) => onChange(items.map((entry, itemIndex) => itemIndex === index ? event.target.value : entry))}
            />
          )}
          <div className="cms-row-actions">
            <button type="button" aria-label={`Move ${label} ${index + 1} up`} disabled={index === 0} onClick={() => onChange(moveItem(items, index, -1))}><ArrowUp size={14} /></button>
            <button type="button" aria-label={`Move ${label} ${index + 1} down`} disabled={index === items.length - 1} onClick={() => onChange(moveItem(items, index, 1))}><ArrowDown size={14} /></button>
            <button type="button" className="cms-danger-action" aria-label={`Remove ${label} ${index + 1}`} onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={14} /></button>
          </div>
        </div>
      ))}
    </section>
  );
}

function ImageUploadField({
  label,
  value,
  alt,
  variant,
  help,
  hasSupabase,
  busy,
  upload,
  onChange,
}: {
  label: string;
  value: string;
  alt: string;
  variant: "avatar" | "project";
  help: string;
  hasSupabase: boolean;
  busy: boolean;
  upload: (file: File) => Promise<string>;
  onChange: (value: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");
  const [previewError, setPreviewError] = useState(false);
  const [localPreview, setLocalPreview] = useState("");
  const preview = localPreview || value;

  useEffect(() => {
    if (!file) {
      setLocalPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setLocalPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function chooseFile(nextFile: File | undefined) {
    if (!nextFile) return;
    const extension = nextFile.name.split(".").pop()?.toLowerCase();
    if (!["jpg", "jpeg", "png", "webp"].includes(extension ?? "")) {
      setStatus("Choose a JPG, PNG, or WebP image.");
      return;
    }
    if (nextFile.size === 0 || nextFile.size > 5 * 1024 * 1024) {
      setStatus("Choose a non-empty image no larger than 5 MB.");
      return;
    }
    setFile(nextFile);
    setPreviewError(false);
    setStatus("");
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    chooseFile(event.dataTransfer.files[0]);
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setStatus("");
    try {
      const url = await upload(file);
      onChange(url);
      setFile(null);
      setStatus("Upload complete. Save as a draft or publish when ready.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "The image could not be uploaded.");
    } finally {
      setUploading(false);
    }
  }

  function removeFromDraft() {
    if (!window.confirm("Remove this image URL from the draft? The Storage file will not be deleted.")) return;
    onChange("");
    setFile(null);
    setStatus("Image URL removed from the draft; the Storage file was not deleted.");
  }

  return (
    <div className={`cms-media cms-media-${variant}`}>
      <div className="cms-media-preview">
        {preview && !previewError ? (
          <img src={preview} alt={alt} onError={() => setPreviewError(true)} />
        ) : (
          <div className="cms-media-empty"><ImagePlus size={18} aria-hidden="true" /><span>{preview ? "Preview unavailable" : "No image set"}</span></div>
        )}
      </div>
      <div className="cms-media-controls">
        <strong>{label}</strong>
        <label
          className="cms-dropzone"
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            disabled={busy || uploading || !hasSupabase}
            onChange={(event: ChangeEvent<HTMLInputElement>) => chooseFile(event.currentTarget.files?.[0])}
          />
          <UploadCloud size={17} aria-hidden="true" />
          <span>{file ? file.name : "Choose or drop an image"}</span>
          <small>{help}</small>
        </label>
        <div className="cms-media-actions">
          <button className="button button-ghost button-compact" type="button" disabled={!file || busy || uploading || !hasSupabase} onClick={() => void handleUpload()}>
            {uploading ? "Uploading…" : file ? "Upload to draft" : "Select an image"}
          </button>
          {value && <button className="cms-text-action" type="button" disabled={busy || uploading} onClick={removeFromDraft}>Remove from draft</button>}
        </div>
        {uploading && <div className="cms-progress" role="progressbar" aria-label="Image upload in progress"><span /></div>}
        {status && <p className="cms-inline-status" role="status">{status}</p>}
        {!hasSupabase && <p className="cms-inline-status cms-error">Configure Supabase to upload images.</p>}
      </div>
    </div>
  );
}

function ResumeEditor({
  value,
  onChange,
  upload,
  busy,
  hasSupabase,
  lastPublishedAt,
}: {
  value: string;
  onChange: (value: string) => void;
  upload: (file: File) => Promise<string>;
  busy: boolean;
  hasSupabase: boolean;
  lastPublishedAt: string | null;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setStatus("");
    try {
      const url = await upload(file);
      onChange(url);
      setFile(null);
      setStatus("Resume uploaded to the draft. Publish to update the public download.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "The resume could not be uploaded.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="cms-panel">
      <div className="cms-panel-heading">
        <div><h2>Resume file</h2><p>Upload a PDF or set a URL. Uploading does not publish automatically.</p></div>
      </div>
      <div className="cms-resume-card">
        <FileText size={22} aria-hidden="true" />
        <div><strong>{value ? "Resume configured" : "No resume configured"}</strong><small>PDF · maximum 6 MB</small></div>
        {value && <a href={value} target="_blank" rel="noreferrer" aria-label="Open current resume"><Download size={16} /></a>}
      </div>
      <p className="cms-muted">Last published: {formatDate(lastPublishedAt)}</p>
      <label className="cms-dropzone cms-pdf-dropzone">
        <input
          type="file"
          accept=".pdf,application/pdf"
          disabled={busy || uploading || !hasSupabase}
          onChange={(event) => setFile(event.currentTarget.files?.[0] ?? null)}
        />
        <UploadCloud size={18} aria-hidden="true" />
        <span>{file ? file.name : "Choose a PDF to upload"}</span>
        <small>PDF only · maximum 6 MB</small>
      </label>
      <button className="button button-ghost button-compact" type="button" disabled={!file || busy || uploading || !hasSupabase} onClick={() => void handleUpload()}>
        {uploading ? "Uploading…" : "Upload to draft"}
      </button>
      {uploading && <div className="cms-progress" role="progressbar" aria-label="Resume upload in progress"><span /></div>}
      <InputField label="Resume URL" value={value} onChange={onChange} type="url" placeholder="https://…" />
      {status && <p className="cms-inline-status" role="status">{status}</p>}
      {!hasSupabase && <p className="cms-inline-status cms-error">Configure Supabase to upload a resume.</p>}
    </div>
  );
}

function StringFieldGrid({ children }: { children: ReactNode }) {
  return <div className="cms-field-grid">{children}</div>;
}

function SectionTitle({ eyebrow, title, description, actions }: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="cms-section-title">
      <div><span className="section-index">{eyebrow}</span><h2>{title}</h2><p>{description}</p></div>
      {actions && <div className="cms-section-actions">{actions}</div>}
    </div>
  );
}

function ReorderActions({ index, count, onMove, onDelete }: {
  index: number;
  count: number;
  onMove: (direction: -1 | 1) => void;
  onDelete: () => void;
}) {
  return (
    <div className="cms-card-actions">
      <button type="button" aria-label="Move entry up" disabled={index === 0} onClick={() => onMove(-1)}><ArrowUp size={15} /></button>
      <button type="button" aria-label="Move entry down" disabled={index === count - 1} onClick={() => onMove(1)}><ArrowDown size={15} /></button>
      <button className="cms-danger-action" type="button" aria-label="Delete entry" onClick={onDelete}><Trash2 size={15} /></button>
    </div>
  );
}

export default function CmsWorkspace(props: CmsWorkspaceProps) {
  const [activeSection, setActiveSection] = useState<CmsSection>("dashboard");
  const [activeSkillCategory, setActiveSkillCategory] = useState("");
  const [categoryNameDraft, setCategoryNameDraft] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySkill, setNewCategorySkill] = useState("");

  const skillCategories = useMemo(
    () => [...new Set(props.content.skills.map((skill) => skill.category))],
    [props.content.skills],
  );

  useEffect(() => {
    if (skillCategories.length > 0 && !skillCategories.includes(activeSkillCategory)) {
      setActiveSkillCategory(skillCategories[0]);
    }
  }, [activeSkillCategory, skillCategories]);

  useEffect(() => {
    setCategoryNameDraft(activeSkillCategory);
  }, [activeSkillCategory]);

  useEffect(() => {
    if (!props.isDraftDirty) return;
    const preventLeaving = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", preventLeaving);
    return () => window.removeEventListener("beforeunload", preventLeaving);
  }, [props.isDraftDirty]);

  function updateContent(update: (content: PortfolioContent) => PortfolioContent) {
    props.onUpdate(update);
  }

  function changeProfile<K extends keyof PortfolioContent["profile"]>(key: K, value: PortfolioContent["profile"][K]) {
    updateContent((content) => ({ ...content, profile: { ...content.profile, [key]: value } }));
  }

  function addProject() {
    const project: Project = {
      name: "",
      eyebrow: "",
      description: "",
      details: [],
      stack: [],
      demo: "",
      github: "",
      image: "",
      featured: false,
    };
    updateContent((content) => ({ ...content, projects: [...content.projects, project] }));
    setActiveSection("projects");
  }

  function addSkill() {
    const category = activeSkillCategory || skillCategories[0] || skillCategoryNames[0];
    updateContent((content) => ({
      ...content,
      skills: [...content.skills, { name: "", category, icon: "" }],
    }));
    setActiveSection("skills");
  }

  async function publish() {
    if (!window.confirm("Publish these changes to the public portfolio?")) return;
    await props.onPublish();
  }

  function goTo(section: CmsSection) {
    if (section !== activeSection && props.isDraftDirty && !window.confirm("You have unsaved edits. Leave this page without saving the draft?")) return;
    setActiveSection(section);
  }

  function preview() {
    if (props.isDraftDirty && !window.confirm("Your edits have not been saved as a draft. Open the public website anyway?")) return;
    props.onPreview();
  }

  function logout() {
    if (props.isDraftDirty && !window.confirm("Your edits have not been saved as a draft. Sign out anyway?")) return;
    void props.onLogout();
  }

  function updateProject(index: number, update: (project: Project) => Project) {
    updateContent((content) => ({
      ...content,
      projects: content.projects.map((project, itemIndex) => itemIndex === index ? update(project) : project),
    }));
  }

  function updateExperience(index: number, update: (item: Experience) => Experience) {
    updateContent((content) => ({
      ...content,
      experience: content.experience.map((item, itemIndex) => itemIndex === index ? update(item) : item),
    }));
  }

  function updateEducation(index: number, update: (item: Education) => Education) {
    updateContent((content) => ({
      ...content,
      education: content.education.map((item, itemIndex) => itemIndex === index ? update(item) : item),
    }));
  }

  function renderDashboard() {
    const metrics = [
      { label: "Projects", value: props.content.projects.length, icon: FolderKanban },
      { label: "Skills", value: props.content.skills.length, icon: Code2 },
      { label: "Experience entries", value: props.content.experience.length, icon: BriefcaseBusiness },
      { label: "Education entries", value: props.content.education.length, icon: GraduationCap },
    ];
    return (
      <>
        <SectionTitle eyebrow="OVERVIEW" title="Portfolio dashboard" description="A live summary of the published content and your current draft." />
        <div className="cms-metrics">
          {metrics.map((metric) => <article className="cms-metric" key={metric.label}><span><metric.icon size={17} /></span><small>{metric.label}</small><strong>{metric.value}</strong></article>)}
          <article className="cms-metric"><span><FileText size={17} /></span><small>Resume</small><strong className="cms-metric-text">{props.content.profile.resume ? "Configured" : "Not set"}</strong></article>
          <article className="cms-metric"><span><CheckCircle2 size={17} /></span><small>Last published</small><strong className="cms-metric-text">{props.lastPublishedAt ? new Date(props.lastPublishedAt).toLocaleDateString() : "Unavailable"}</strong></article>
        </div>
        <section className="cms-panel">
          <div className="cms-panel-heading"><div><h2>Quick actions</h2><p>Jump directly to a content area or add a new entry.</p></div></div>
          <div className="cms-quick-actions">
            <button className="cms-quick-action" type="button" onClick={() => setActiveSection("profile")}><UserRound size={17} /> Edit profile</button>
            <button className="cms-quick-action" type="button" onClick={addProject}><Plus size={17} /> Add project</button>
            <button className="cms-quick-action" type="button" onClick={addSkill}><Plus size={17} /> Add skill</button>
            <button className="cms-quick-action" type="button" onClick={() => setActiveSection("resume")}><UploadCloud size={17} /> Upload resume</button>
            <button className="cms-quick-action" type="button" onClick={preview}><Eye size={17} /> Preview website</button>
          </div>
        </section>
        <div className="cms-dashboard-note">
          <Sparkles size={18} aria-hidden="true" />
          <p>Draft changes are separate from the published website. Save a browser draft or publish explicitly when you are ready.</p>
        </div>
      </>
    );
  }

  function renderProfile() {
    return (
      <>
        <SectionTitle eyebrow="PROFILE / HERO" title="Profile and hero" description="Edit the content shown at the top of your public portfolio." />
        <section className="cms-panel">
          <StringFieldGrid>
            <InputField label="Full name" value={props.content.profile.name} onChange={(value) => changeProfile("name", value)} />
            <InputField label="Professional role" value={props.content.profile.role} onChange={(value) => changeProfile("role", value)} />
            <InputField label="Location" value={props.content.profile.location} onChange={(value) => changeProfile("location", value)} />
            <InputField label="Availability message" value={props.content.profile.availability} onChange={(value) => changeProfile("availability", value)} />
            <TextAreaField label="Short introduction" value={props.content.profile.intro} onChange={(value) => changeProfile("intro", value)} rows={4} />
          </StringFieldGrid>
        </section>
        <section className="cms-panel">
          <div className="cms-panel-heading"><div><h2>Profile avatar</h2><p>Choose and upload an image; the public avatar changes only after publishing.</p></div></div>
          <ImageUploadField
            label="Avatar image"
            value={props.content.profile.avatar}
            alt="Profile avatar preview"
            variant="avatar"
            help="JPG, PNG, or WebP · maximum 5 MB"
            hasSupabase={props.hasSupabase}
            busy={props.busy}
            upload={props.uploadAvatar}
            onChange={(value) => changeProfile("avatar", value)}
          />
        </section>
      </>
    );
  }

  function renderAbout() {
    return (
      <>
        <SectionTitle eyebrow="ABOUT" title="About content" description="Manage the published introduction as repeatable paragraphs." />
        <section className="cms-panel">
          <p className="cms-schema-note">The existing content format stores About as a paragraph list. Its heading and a separate career-objective field are template-only and are not added to the data model.</p>
          <StringListEditor
            label="About paragraphs"
            items={props.content.about}
            multiline
            placeholder="Write a paragraph about your experience or interests."
            onChange={(about) => updateContent((content) => ({ ...content, about }))}
          />
        </section>
        <section className="cms-panel">
          <div className="cms-panel-heading"><div><h2>About statistics</h2><p>These are the existing public summary values.</p></div></div>
          {(props.content.stats ?? []).map((stat, index) => (
            <div className="cms-record-card cms-stat-row" key={`stat-${index}`}>
              <InputField label="Label" value={stat.label} onChange={(label) => updateContent((content) => ({ ...content, stats: content.stats.map((item, itemIndex) => itemIndex === index ? { ...item, label } : item) }))} />
              <InputField label="Value" value={stat.value} onChange={(value) => updateContent((content) => ({ ...content, stats: content.stats.map((item, itemIndex) => itemIndex === index ? { ...item, value } : item) }))} />
              <ReorderActions
                index={index}
                count={props.content.stats.length}
                onMove={(direction) => updateContent((content) => ({ ...content, stats: moveItem(content.stats, index, direction) }))}
                onDelete={() => updateContent((content) => ({ ...content, stats: content.stats.filter((_, itemIndex) => itemIndex !== index) }))}
              />
            </div>
          ))}
          <button className="cms-small-action" type="button" onClick={() => updateContent((content) => ({ ...content, stats: [...content.stats, { label: "", value: "" }] }))}><Plus size={14} /> Add statistic</button>
        </section>
      </>
    );
  }

  function renderSkills() {
    const activeSkills = props.content.skills
      .map((skill, index) => ({ skill, index }))
      .filter(({ skill }) => skill.category === activeSkillCategory);
    const iconOptions = [...new Set([
      ...defaultContent.skills.map((skill) => skill.icon),
      ...props.content.skills.map((skill) => skill.icon).filter(Boolean),
    ])];

    function reorderCategory(direction: -1 | 1) {
      const currentIndex = skillCategories.indexOf(activeSkillCategory);
      const nextOrder = moveItem(skillCategories, currentIndex, direction);
      const groupedSkills = nextOrder.flatMap((category) => props.content.skills.filter((skill) => skill.category === category));
      updateContent((content) => ({ ...content, skills: groupedSkills }));
    }

    return (
      <>
        <SectionTitle
          eyebrow="SKILLS"
          title="Skill catalog"
          description="Manage one category at a time. Existing skill metadata is kept when individual fields change."
          actions={<button className="button button-primary button-compact" type="button" onClick={addSkill}><Plus size={15} /> Add skill</button>}
        />
        <section className="cms-panel">
          <div className="cms-skill-toolbar">
            <label className="cms-field cms-category-select"><span>Category</span><select className="cms-input cms-select" value={activeSkillCategory} onChange={(event) => setActiveSkillCategory(event.target.value)}>{skillCategories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
            {activeSkillCategory && (
              <>
                <label className="cms-field cms-category-name"><span>Rename category</span><input className="cms-input" value={categoryNameDraft} onChange={(event) => setCategoryNameDraft(event.target.value)} /></label>
                <button className="button button-ghost button-compact" type="button" disabled={!categoryNameDraft.trim() || categoryNameDraft.trim() === activeSkillCategory || skillCategories.includes(categoryNameDraft.trim())} onClick={() => {
                  const renamed = categoryNameDraft.trim();
                  updateContent((content) => ({ ...content, skills: content.skills.map((skill) => skill.category === activeSkillCategory ? { ...skill, category: renamed } : skill) }));
                  setActiveSkillCategory(renamed);
                }}>Rename</button>
                <div className="cms-card-actions">
                  <button type="button" aria-label="Move category up" disabled={skillCategories.indexOf(activeSkillCategory) === 0} onClick={() => reorderCategory(-1)}><ArrowUp size={15} /></button>
                  <button type="button" aria-label="Move category down" disabled={skillCategories.indexOf(activeSkillCategory) === skillCategories.length - 1} onClick={() => reorderCategory(1)}><ArrowDown size={15} /></button>
                  <button className="cms-danger-action" type="button" aria-label="Delete category" onClick={() => {
                    if (!window.confirm(`Delete "${activeSkillCategory}" and all of its skills from the draft?`)) return;
                    const remaining = props.content.skills.filter((skill) => skill.category !== activeSkillCategory);
                    updateContent((content) => ({ ...content, skills: remaining }));
                    setActiveSkillCategory(remaining[0]?.category ?? "");
                  }}><Trash2 size={15} /></button>
                </div>
              </>
            )}
          </div>
          {activeSkillCategory && (
            <div className="cms-skill-list">
              {activeSkills.map(({ skill, index }) => (
                <article className="cms-skill-card" key={`${skill.category}-${skill.name}-${index}`}>
                  <div className="cms-skill-preview"><TechIcon name={skill.icon} /><Code2 className="cms-skill-fallback" /></div>
                  <div className="cms-skill-fields">
                    <InputField label="Skill name" value={skill.name} onChange={(name) => updateContent((content) => ({ ...content, skills: content.skills.map((item, itemIndex) => itemIndex === index ? { ...item, name } : item) }))} />
                    <SelectField label="Icon" value={skill.icon} options={iconOptions.includes(skill.icon) ? iconOptions : [skill.icon, ...iconOptions]} onChange={(icon) => updateContent((content) => ({ ...content, skills: content.skills.map((item, itemIndex) => itemIndex === index ? { ...item, icon } : item) }))} />
                    <SelectField label="Category" value={skill.category} options={skillCategories} onChange={(category) => updateContent((content) => ({ ...content, skills: content.skills.map((item, itemIndex) => itemIndex === index ? { ...item, category } : item) }))} />
                    <InputField label="Familiarity (optional)" type="number" min={0} max={100} value={skill.percent === undefined ? "" : String(skill.percent)} onChange={(value) => updateContent((content) => ({ ...content, skills: content.skills.map((item, itemIndex) => {
                      if (itemIndex !== index) return item;
                      if (!value.trim()) {
                        const nextSkill = { ...item };
                        delete nextSkill.percent;
                        return nextSkill;
                      }
                      return { ...item, percent: Number(value) };
                    }) }))} />
                    <InputField label="Level (optional)" value={skill.level ?? ""} onChange={(level) => updateContent((content) => ({ ...content, skills: content.skills.map((item, itemIndex) => {
                      if (itemIndex !== index) return item;
                      if (!level) {
                        const nextSkill = { ...item };
                        delete nextSkill.level;
                        return nextSkill;
                      }
                      return { ...item, level };
                    }) }))} />
                  </div>
                  <ReorderActions
                    index={activeSkills.findIndex((entry) => entry.index === index)}
                    count={activeSkills.length}
                    onMove={(direction) => {
                      const activeIndex = activeSkills.findIndex((entry) => entry.index === index);
                      const reordered = moveItem(activeSkills.map((entry) => entry.skill), activeIndex, direction);
                      let nextIndex = 0;
                      updateContent((content) => ({
                        ...content,
                        skills: content.skills.map((item) => item.category === activeSkillCategory ? reordered[nextIndex++] : item),
                      }));
                    }}
                    onDelete={() => {
                      if (!window.confirm(`Remove "${skill.name || "this skill"}" from the draft?`)) return;
                      updateContent((content) => ({ ...content, skills: content.skills.filter((_, itemIndex) => itemIndex !== index) }));
                    }}
                  />
                </article>
              ))}
              {activeSkills.length === 0 && <p className="cms-muted">No skills in this category.</p>}
            </div>
          )}
          <div className="cms-add-category">
            {addingCategory ? (
              <>
                <InputField label="New category name" value={newCategoryName} onChange={setNewCategoryName} />
                <InputField label="First skill name" value={newCategorySkill} onChange={setNewCategorySkill} />
                <button className="button button-primary button-compact" type="button" disabled={!newCategoryName.trim() || !newCategorySkill.trim() || skillCategories.includes(newCategoryName.trim())} onClick={() => {
                  const category = newCategoryName.trim();
                  const name = newCategorySkill.trim();
                  updateContent((content) => ({ ...content, skills: [...content.skills, { name, category, icon: name }] }));
                  setActiveSkillCategory(category);
                  setCategoryNameDraft(category);
                  setNewCategoryName("");
                  setNewCategorySkill("");
                  setAddingCategory(false);
                }}><Plus size={15} /> Create category</button>
                <button className="cms-text-action" type="button" onClick={() => setAddingCategory(false)}>Cancel</button>
              </>
            ) : (
              <button className="cms-small-action" type="button" onClick={() => setAddingCategory(true)}><Plus size={14} /> Add category</button>
            )}
            <small>A category is stored on its skills, so create it with its first skill. Only supported brand icons are listed.</small>
          </div>
        </section>
      </>
    );
  }

  function renderProjects() {
    return (
      <>
        <SectionTitle
          eyebrow="PROJECTS"
          title="Project portfolio"
          description="Manage project details, technologies, links and thumbnails. Changes remain draft until published."
          actions={<button className="button button-primary button-compact" type="button" onClick={addProject}><Plus size={15} /> Add project</button>}
        />
        <div className="cms-record-list">
          {props.content.projects.map((project, index) => (
            <article className="cms-record-card" key={`${project.name}-${index}`}>
              <div className="cms-record-heading"><div><span className="cms-record-index">PROJECT {String(index + 1).padStart(2, "0")}</span><h3>{project.name || "New project"}</h3></div><ReorderActions index={index} count={props.content.projects.length} onMove={(direction) => updateContent((content) => ({ ...content, projects: moveItem(content.projects, index, direction) }))} onDelete={() => {
                if (!window.confirm(`Remove "${project.name || "this project"}" from the draft? Its Storage image will not be deleted.`)) return;
                updateContent((content) => ({ ...content, projects: content.projects.filter((_, itemIndex) => itemIndex !== index) }));
              }} /></div>
              <StringFieldGrid>
                <InputField label="Project title" value={project.name} onChange={(name) => updateProject(index, (item) => ({ ...item, name }))} />
                <InputField label="Category / eyebrow" value={project.eyebrow} onChange={(eyebrow) => updateProject(index, (item) => ({ ...item, eyebrow }))} />
                <TextAreaField label="Short description" value={project.description} onChange={(description) => updateProject(index, (item) => ({ ...item, description }))} rows={3} />
                <StringListEditor label="Case study details" items={project.details} multiline onChange={(details) => updateProject(index, (item) => ({ ...item, details }))} />
                <StringListEditor label="Technology tags" items={project.stack} onChange={(stack) => updateProject(index, (item) => ({ ...item, stack }))} placeholder="Technology name" />
                <InputField label="Live demo URL" value={project.demo} type="url" onChange={(demo) => updateProject(index, (item) => ({ ...item, demo }))} />
                <InputField label="GitHub URL" value={project.github} type="url" onChange={(github) => updateProject(index, (item) => ({ ...item, github }))} />
                <CheckboxField label="Featured project" checked={project.featured} onChange={(featured) => updateProject(index, (item) => ({ ...item, featured }))} />
              </StringFieldGrid>
              <ImageUploadField
                label="Project image"
                value={project.image}
                alt={`${project.name || "Project"} thumbnail`}
                variant="project"
                help="JPG, PNG, or WebP · maximum 5 MB"
                hasSupabase={props.hasSupabase}
                busy={props.busy}
                upload={(file) => props.uploadProjectImage(file, project.name || "project")}
                onChange={(image) => updateProject(index, (item) => ({ ...item, image }))}
              />
              <p className="cms-schema-note">Case-study URLs are not part of the existing project data format; the existing details action opens the built-in project modal.</p>
            </article>
          ))}
          {props.content.projects.length === 0 && <div className="cms-empty-state">No projects yet. Add a project to start a draft entry.</div>}
        </div>
      </>
    );
  }

  function renderExperience() {
    return (
      <>
        <SectionTitle
          eyebrow="EXPERIENCE"
          title="Professional experience"
          description="Edit roles and responsibilities using the fields supported by the current portfolio content."
          actions={<button className="button button-primary button-compact" type="button" onClick={() => updateContent((content) => ({ ...content, experience: [...content.experience, { role: "", company: "", period: "", location: "", points: [] }] }))}><Plus size={15} /> Add experience</button>}
        />
        <div className="cms-record-list">
          {props.content.experience.map((item, index) => (
            <article className="cms-record-card" key={`${item.company}-${index}`}>
              <div className="cms-record-heading"><div><span className="cms-record-index">ROLE {String(index + 1).padStart(2, "0")}</span><h3>{item.role || "New role"}</h3></div><ReorderActions index={index} count={props.content.experience.length} onMove={(direction) => updateContent((content) => ({ ...content, experience: moveItem(content.experience, index, direction) }))} onDelete={() => {
                if (!window.confirm(`Remove the ${item.role || "experience"} entry from the draft?`)) return;
                updateContent((content) => ({ ...content, experience: content.experience.filter((_, itemIndex) => itemIndex !== index) }));
              }} /></div>
              <StringFieldGrid>
                <InputField label="Job title" value={item.role} onChange={(role) => updateExperience(index, (entry) => ({ ...entry, role }))} />
                <InputField label="Company" value={item.company} onChange={(company) => updateExperience(index, (entry) => ({ ...entry, company }))} />
                <InputField label="Employment period" value={item.period} onChange={(period) => updateExperience(index, (entry) => ({ ...entry, period }))} placeholder="e.g. Jun 2025 – Jan 2026" />
                <InputField label="Location" value={item.location} onChange={(location) => updateExperience(index, (entry) => ({ ...entry, location }))} />
                <StringListEditor label="Responsibilities" items={item.points} multiline onChange={(points) => updateExperience(index, (entry) => ({ ...entry, points }))} />
              </StringFieldGrid>
              <p className="cms-schema-note">Employment type, separate start/end dates and technology tags are not represented in the existing Experience data format.</p>
            </article>
          ))}
          {props.content.experience.length === 0 && <div className="cms-empty-state">No experience entries yet.</div>}
        </div>
      </>
    );
  }

  function renderEducation() {
    return (
      <>
        <SectionTitle
          eyebrow="EDUCATION"
          title="Education history"
          description="All education details are repeatable and remain in the existing content format."
          actions={<button className="button button-primary button-compact" type="button" onClick={() => updateContent((content) => ({ ...content, education: [...content.education, { degree: "", field: "", school: "", board: "", location: "", period: "", detail: "", description: "" }] }))}><Plus size={15} /> Add education</button>}
        />
        <div className="cms-record-list">
          {props.content.education.map((item, index) => (
            <article className="cms-record-card" key={`${item.school}-${index}`}>
              <div className="cms-record-heading"><div><span className="cms-record-index">EDUCATION {String(index + 1).padStart(2, "0")}</span><h3>{item.degree || "New qualification"}</h3></div><ReorderActions index={index} count={props.content.education.length} onMove={(direction) => updateContent((content) => ({ ...content, education: moveItem(content.education, index, direction) }))} onDelete={() => {
                if (!window.confirm(`Remove "${item.degree || "this education entry"}" from the draft?`)) return;
                updateContent((content) => ({ ...content, education: content.education.filter((_, itemIndex) => itemIndex !== index) }));
              }} /></div>
              <StringFieldGrid>
                <InputField label="Degree / qualification" value={item.degree} onChange={(degree) => updateEducation(index, (entry) => ({ ...entry, degree }))} />
                <InputField label="Field of study" value={item.field ?? ""} onChange={(field) => updateEducation(index, (entry) => ({ ...entry, field }))} />
                <InputField label="School / university" value={item.school} onChange={(school) => updateEducation(index, (entry) => ({ ...entry, school }))} />
                <InputField label="Board / university type" value={item.board ?? ""} onChange={(board) => updateEducation(index, (entry) => ({ ...entry, board }))} />
                <InputField label="Location" value={item.location ?? ""} onChange={(location) => updateEducation(index, (entry) => ({ ...entry, location }))} />
                <InputField label="Study period" value={item.period} onChange={(period) => updateEducation(index, (entry) => ({ ...entry, period }))} />
                <InputField label="CGPA / percentage" value={item.detail} onChange={(detail) => updateEducation(index, (entry) => ({ ...entry, detail }))} />
                <TextAreaField label="Description" value={item.description ?? ""} onChange={(description) => updateEducation(index, (entry) => ({ ...entry, description }))} rows={3} />
              </StringFieldGrid>
            </article>
          ))}
          {props.content.education.length === 0 && <div className="cms-empty-state">No education entries yet.</div>}
        </div>
      </>
    );
  }

  function renderCertifications() {
    return (
      <>
        <SectionTitle
          eyebrow="CERTIFICATIONS"
          title="Certifications"
          description="Manage certificates and credentials currently supported by the portfolio."
          actions={<button className="button button-primary button-compact" type="button" onClick={() => updateContent((content) => ({ ...content, certifications: [...content.certifications, { name: "", issuer: "", date: "", url: "" }] }))}><Plus size={15} /> Add certification</button>}
        />
        <div className="cms-record-list">
          {props.content.certifications.map((item, index) => (
            <article className="cms-record-card" key={`${item.name}-${index}`}>
              <div className="cms-record-heading"><div><span className="cms-record-index">CERTIFICATE {String(index + 1).padStart(2, "0")}</span><h3>{item.name || "New certification"}</h3></div><ReorderActions index={index} count={props.content.certifications.length} onMove={(direction) => updateContent((content) => ({ ...content, certifications: moveItem(content.certifications, index, direction) }))} onDelete={() => {
                if (!window.confirm(`Remove "${item.name || "this certification"}" from the draft?`)) return;
                updateContent((content) => ({ ...content, certifications: content.certifications.filter((_, itemIndex) => itemIndex !== index) }));
              }} /></div>
              <StringFieldGrid>
                <InputField label="Certification name" value={item.name} onChange={(name) => updateContent((content) => ({ ...content, certifications: content.certifications.map((entry, itemIndex) => itemIndex === index ? { ...entry, name } : entry) }))} />
                <InputField label="Issuing organization" value={item.issuer} onChange={(issuer) => updateContent((content) => ({ ...content, certifications: content.certifications.map((entry, itemIndex) => itemIndex === index ? { ...entry, issuer } : entry) }))} />
                <InputField label="Issue date" value={item.date} onChange={(date) => updateContent((content) => ({ ...content, certifications: content.certifications.map((entry, itemIndex) => itemIndex === index ? { ...entry, date } : entry) }))} />
                <InputField label="Credential URL" value={item.url} type="url" onChange={(url) => updateContent((content) => ({ ...content, certifications: content.certifications.map((entry, itemIndex) => itemIndex === index ? { ...entry, url } : entry) }))} />
              </StringFieldGrid>
              <p className="cms-schema-note">Credential ID and description are not part of the existing certification data format.</p>
            </article>
          ))}
          {props.content.certifications.length === 0 && <div className="cms-empty-state">No certifications yet.</div>}
        </div>
      </>
    );
  }

  function renderContact() {
    return (
      <>
        <SectionTitle eyebrow="CONTACT INFORMATION" title="Public contact details" description="These fields update the existing profile links used around the public site." />
        <section className="cms-panel">
          <StringFieldGrid>
            <InputField label="Contact email" value={props.content.profile.email} type="email" onChange={(value) => changeProfile("email", value)} />
            <InputField label="Location" value={props.content.profile.location} onChange={(value) => changeProfile("location", value)} />
            <InputField label="GitHub URL" value={props.content.profile.github} type="url" onChange={(value) => changeProfile("github", value)} />
            <InputField label="LinkedIn URL" value={props.content.profile.linkedin} type="url" onChange={(value) => changeProfile("linkedin", value)} />
          </StringFieldGrid>
          <p className="cms-schema-note">Contact form submission and the existing Resend Edge Function are not changed.</p>
        </section>
      </>
    );
  }

  function renderSettings() {
    return (
      <>
        <SectionTitle eyebrow="SETTINGS" title="Workspace settings" description="Publishing remains on the existing Supabase content row; no backend configuration is changed here." />
        <section className="cms-panel">
          <div className="cms-settings-row"><span><CheckCircle2 size={18} /> Authentication</span><strong>Existing Supabase session</strong></div>
          <div className="cms-settings-row"><span><Save size={18} /> Draft storage</span><strong>This browser only</strong></div>
          <div className="cms-settings-row"><span><Send size={18} /> Published content</span><strong>Existing portfolio_content row</strong></div>
          <p className="cms-schema-note">The current content model has no general settings record. Sections and public layout settings are not added to the database.</p>
        </section>
      </>
    );
  }

  function renderResume() {
    return (
      <>
        <SectionTitle eyebrow="RESUME" title="Resume management" description="Keep the existing public Hero download working by publishing a valid resume URL." />
        <section className="cms-panel">
          <ResumeEditor
            value={props.content.profile.resume}
            onChange={(resume) => changeProfile("resume", resume)}
            upload={props.uploadResume}
            busy={props.busy}
            hasSupabase={props.hasSupabase}
            lastPublishedAt={props.lastPublishedAt}
          />
        </section>
      </>
    );
  }

  function renderSection() {
    if (props.loading) {
      return <div className="cms-loading"><span className="cms-spinner" /> Loading published portfolio content…</div>;
    }
    if (props.contentLoadError) {
      return (
        <div className="cms-notice cms-load-error" role="alert">
          <AlertCircle size={17} />
          <span>Published content could not be loaded. Editing, uploads, and publishing are blocked to protect existing content. {props.contentLoadError}</span>
        </div>
      );
    }
    switch (activeSection) {
      case "dashboard": return renderDashboard();
      case "profile": return renderProfile();
      case "about": return renderAbout();
      case "skills": return renderSkills();
      case "projects": return renderProjects();
      case "experience": return renderExperience();
      case "education": return renderEducation();
      case "certifications": return renderCertifications();
      case "resume": return renderResume();
      case "contact": return renderContact();
      case "settings": return renderSettings();
      default: return renderDashboard();
    }
  }

  return (
    <div className="cms-shell">
      <aside className="cms-sidebar">
        <a className="cms-brand" href="/"><span className="brand-mark">V</span><span>portfolio<span className="brand-dot">.</span>cms</span></a>
        <div className="cms-sidebar-label">WORKSPACE</div>
        <nav className="cms-nav" aria-label="CMS sections">
          {sections.map(({ id, label, icon: Icon }) => (
            <button className={activeSection === id ? "cms-nav-item active" : "cms-nav-item"} type="button" key={id} onClick={() => goTo(id)}>
              <Icon size={17} aria-hidden="true" /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="cms-sidebar-footer">
          <button className="cms-nav-item" type="button" onClick={preview}><Eye size={17} /><span>Preview website</span></button>
          <button className="cms-nav-item" type="button" onClick={logout}><LogOut size={17} /><span>Sign out</span></button>
        </div>
      </aside>
      <main className="cms-main">
        <header className="cms-topbar">
          <div className="cms-mobile-brand"><span className="brand-mark">V</span><span>portfolio<span className="brand-dot">.</span>cms</span></div>
          <div className="cms-topbar-status">
            <span className={props.isDraftDirty ? "cms-status-dot unsaved" : "cms-status-dot"} />
            {props.isDraftDirty ? "Unsaved edits" : props.hasUnpublishedChanges ? "Draft not published" : "All changes published"}
          </div>
          <div className="cms-topbar-actions">
            <button className="button button-ghost button-compact" type="button" onClick={preview}><Eye size={15} /> Preview</button>
            <button className="button button-ghost button-compact" type="button" disabled={props.busy || Boolean(props.contentLoadError) || !props.isDraftDirty} onClick={props.onSaveDraft}><Save size={15} /> Save draft</button>
            <button className="button button-primary button-compact" type="button" disabled={props.busy || Boolean(props.contentLoadError) || !props.hasUnpublishedChanges} onClick={() => void publish()}><Send size={15} /> {props.busy ? "Publishing…" : "Publish changes"}</button>
          </div>
        </header>
        <div className="cms-mobile-nav">
          <label className="visually-hidden" htmlFor="cms-section-select">CMS section</label>
          <select id="cms-section-select" className="cms-input cms-select" value={activeSection} onChange={(event) => goTo(event.target.value as CmsSection)}>
            {sections.map((section) => <option key={section.id} value={section.id}>{section.label}</option>)}
          </select>
        </div>
        <div className="cms-main-content">
          <div className="cms-active-header">
            <span className="cms-auth-chip"><CheckCircle2 size={14} /> Authenticated</span>
            {props.draftSavedAt && <span className="cms-draft-time">Draft saved {formatDate(props.draftSavedAt)}</span>}
          </div>
          {props.message && <div className="cms-notice" role="status"><CheckCircle2 size={17} />{props.message}</div>}
          {renderSection()}
        </div>
      </main>
    </div>
  );
}
