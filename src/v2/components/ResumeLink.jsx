import { profile, resumeContent } from "../portfolioData";
import "./ResumeLink.css";

/**
 * A single semantic link to the owner's résumé, presented in three contexts.
 * Hero: a small and unmistakable shortcut beneath the main CTAs.
 * Feature: a technical document-pass card in the At a glance section.
 * Inline: a smaller companion link at the end of the experience section.
 *
 * Intentional UX: never forces a PDF into an iframe and never puts a modal
 * between a recruiter and the original document. Google Drive opens in
 * a new tab, with a visible warning and an accessible name.
 */
function DocumentMark({ large = false }) {
  return <svg className={"v2-resume-icon" + (large ? " is-large" : "")}
    viewBox="0 0 52 58" fill="none" aria-hidden="true">
    <path d="M11 5H31L42 16V51C42 53 40 55 38 55H11C8.8 55 7 53 7 50V10C7 7.2 8.8 5 11 5Z"
      stroke="currentColor" strokeWidth="1.6"/>
    <path d="M30.5 5V16.5H42" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M15 27H34M15 34H34M15 41H28" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round"/>
    <path d="M15 19H23" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
  </svg>;
}

function trackPointer(event) {
  if (event.pointerType && event.pointerType !== "mouse") return;
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  target.style.setProperty("--resume-x", (event.clientX - rect.left) + "px");
  target.style.setProperty("--resume-y", (event.clientY - rect.top) + "px");
}

/** All résumé locations share the same URL and accessibility contract. */
export default function ResumeLink({ variant = "hero" }) {
  const href = profile.resume;
  const label = resumeContent.accessibleLabel;

  if (variant === "feature") {
    return <a className="v2-resume-pass" href={href} target="_blank"
      rel="noopener noreferrer" aria-label={label}
      data-cursor-label="OPEN"
      onPointerMove={trackPointer}>
      <span className="v2-resume-pass-index">{resumeContent.eyebrow}</span>
      <span className="v2-resume-pass-body">
        <span className="v2-resume-document" aria-hidden="true">
          <span className="v2-resume-document-back"/>
          <DocumentMark large/>
        </span>
        <span className="v2-resume-pass-copy">
          <span className="v2-resume-pass-meta">{resumeContent.meta}</span>
          <strong>{resumeContent.title}</strong>
          <span className="v2-resume-pass-description">{resumeContent.description}</span>
        </span>
        <span className="v2-resume-pass-action" aria-hidden="true">
          <span>{resumeContent.action}</span><span className="v2-resume-action-arrow">↗</span>
        </span>
      </span>
      <span className="v2-resume-pass-foot">
        <span className="v2-resume-pass-corner" aria-hidden="true">+</span>
        <span>{resumeContent.destination}</span>
        <span className="v2-resume-pass-corner" aria-hidden="true">+</span>
      </span>
    </a>;
  }

  return <a className={"v2-resume-shortcut " + (variant === "inline" ? "is-inline" : "is-hero")}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    data-cursor-label="CV"
  >
    <span className="v2-resume-shortcut-icon"><DocumentMark/></span>
    <span className="v2-resume-shortcut-copy">
      <strong>{variant === "inline" ? resumeContent.inlineLabel : resumeContent.heroLabel}</strong>
      <small>{resumeContent.destination}</small>
    </span>
    <span className="v2-resume-shortcut-arrow" aria-hidden="true">↗</span>
  </a>;
}
