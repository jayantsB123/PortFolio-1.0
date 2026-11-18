import { useEffect, useRef } from "react";
import { profile } from "./portfolioData";

const routes = [
  ["01", "Overview", "#overview", "The quick introduction"],
  ["02", "Experience", "#experience", "Roles and responsibilities"],
  ["03", "Projects", "#work", "Selected engineering work"],
  ["04", "Skills", "#skills", "Technical toolkit"],
  ["05", "About", "#about", "Beyond the code"],
  ["06", "Contact", "#contact", "Get in touch"],
];

/**
 * Full-screen navigation inspired by the reference video's visual treatment.
 * It remains a straightforward list of links and supports Escape, focus
 * trapping, focus restoration and click-outside dismissal.
 */
export default function QuickNav({ open, onClose }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    const previousFocus = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => closeRef.current?.focus());

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const controls = Array.from(panelRef.current.querySelectorAll("button:not([disabled]),a[href]"));
      if (!controls.length) return;
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = oldOverflow;
      previousFocus?.focus?.();
    };
  }, [open]);

  if (!open) return null;
  return <div className="v2-quicknav-backdrop" onMouseDown={(event) => {
    if (event.target === event.currentTarget) onClose();
  }}>
    <div className="v2-quicknav" ref={panelRef} role="dialog" aria-modal="true" aria-label="Explore portfolio">
      <div className="v2-quicknav-top">
        <span><i aria-hidden="true"/> EXPLORE / PORTFOLIO</span>
        <button type="button" ref={closeRef} onClick={onClose} aria-label="Close navigation">CLOSE <span aria-hidden="true">✕</span></button>
      </div>
      <div className="v2-quicknav-content">
        <div className="v2-quicknav-intro">
          <span>JAYANT / SOFTWARE DEVELOPER</span>
          <p>Find what you're looking for.</p>
        </div>
        <nav aria-label="Full-screen navigation">
          {routes.map(([number, label, href, description]) => <a href={href} key={href} onClick={onClose}>
            <span className="v2-quicknav-number">{number}</span>
            <strong>{label}</strong>
            <span className="v2-quicknav-description">{description}</span>
            <span className="v2-quicknav-arrow" aria-hidden="true">↗</span>
          </a>)}
        </nav>
      </div>
      <div className="v2-quicknav-footer">
        <span>BUILD THOUGHTFULLY. SHIP CONFIDENTLY.</span>
        <a href={profile.github} target="_blank" rel="noopener noreferrer">GITHUB ↗</a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LINKEDIN ↗</a>
      </div>
    </div>
  </div>;
}
