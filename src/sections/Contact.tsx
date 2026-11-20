import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight, Check, Copy, Github, Linkedin, Mail, Send } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { supabase } from "../lib/supabase";
import type { PortfolioContent } from "../types";

type ContactProps = {
  profile: PortfolioContent["profile"];
};

export default function Contact({ profile }: ContactProps) {
  const [contact, setContact] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setStatus("Sending...");
    try {
      const details = {
        name: contact.name.trim(),
        email: contact.email.trim(),
        message: contact.message.trim(),
      };

      if (!supabase) {
        window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(`Portfolio enquiry from ${details.name}`)}&body=${encodeURIComponent(`${details.message}\n\nReply to: ${details.email}`)}`;
        setStatus("Opening your email app…");
        return;
      }

      const { error } = await supabase.functions.invoke("send-contact", { body: details });
      if (error) throw error;
      setStatus("Message sent successfully. Thank you!");
      setContact({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Message could not be sent. Please email me directly.");
    } finally {
      setSending(false);
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopyStatus("Email address copied.");
      setCopied(true);
    } catch {
      setCopyStatus("Could not copy. Select the email address to copy it.");
      setCopied(false);
    }
  }

  return (
    <section id="contact" className="section container contact-section">
      <SectionHeading index="06" title="Let's build something" subtitle="Have an opportunity, an idea or just want to connect? My inbox is open." />
      <div className="contact-grid">
        <div className="contact-copy">
          <span className="contact-icon"><Mail size={24} aria-hidden="true" /></span>
          <h3>Let's start a conversation.</h3>
          <p>I'm interested in software development, Python backend and AI application opportunities.</p>
          <div className="contact-email">
            <a className="email-link" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={16} aria-hidden="true" /></a>
            <button className="copy-email" type="button" onClick={copyEmail} aria-label={`Copy ${profile.email} to clipboard`}>
              {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          {copyStatus && <p className="copy-status" role="status">{copyStatus}</p>}
          <div className="contact-social">
            <a href={profile.github} target="_blank" rel="noreferrer"><Github aria-hidden="true" /> GitHub</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin aria-hidden="true" /> LinkedIn</a>
          </div>
        </div>
        <form className="contact-form" onSubmit={submitContact}>
          <label>Your name
            <input required maxLength={120} autoComplete="name" value={contact.name} onChange={(event) => setContact({ ...contact, name: event.target.value })} placeholder="Your name" />
          </label>
          <label>Email address
            <input required maxLength={254} type="email" autoComplete="email" value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} placeholder="you@example.com" />
          </label>
          <label>Message
            <textarea required minLength={5} maxLength={5000} rows={4} value={contact.message} onChange={(event) => setContact({ ...contact, message: event.target.value })} placeholder="Tell me a little about it…" />
          </label>
          <button className="button button-primary" type="submit" disabled={sending}>
            <Send size={16} aria-hidden="true" /> {sending ? "Sending…" : "Send message"} <ArrowUpRight size={16} aria-hidden="true" />
          </button>
          {status && <p className="form-status" role="status" aria-live="polite">{status}</p>}
        </form>
      </div>
    </section>
  );
}
