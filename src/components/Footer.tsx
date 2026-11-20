import { LockKeyhole } from "lucide-react";

type FooterProps = {
  name: string;
  openAdmin: () => void;
};

export default function Footer({ name, openAdmin }: FooterProps) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <a className="brand" href="#home">
          <span className="brand-mark">V</span>
          <span>vivek<span className="brand-dot">.</span></span>
        </a>
        <span>Designed &amp; built with curiosity. © {new Date().getFullYear()} {name}</span>
        <button className="admin-link" onClick={openAdmin}>Admin <LockKeyhole size={13} aria-hidden="true" /></button>
      </div>
    </footer>
  );
}
