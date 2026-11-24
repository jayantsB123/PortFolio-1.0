import { useEffect, useRef } from "react";
import { navigationContent, profile } from "./portfolioData";
import CursorBackgrounds from "./components/CursorBackgrounds";
import InteractiveDepthCard from "./components/InteractiveDepthCard";
import { menuEffectsConfig } from "./config/setenv";
import "./menuEffects.css";

const routes = navigationContent.routes;

/**
 * Full-screen navigation inspired by the reference video's visual treatment.
 * It remains a straightforward list of links and supports Escape, focus
 * trapping, focus restoration and click-outside dismissal.
 */
export default function QuickNav({ open, onClose, activeSection }) {
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
  const showEffects = menuEffectsConfig.enabled;
  return <div className="v2-quicknav-backdrop" onMouseDown={(event) => {
    if (event.target === event.currentTarget) onClose();
  }}>
    <div className={"v2-quicknav" + (showEffects ? " v2-quicknav-effects" : "") + (showEffects && menuEffectsConfig.entrance ? " v2-quicknav-cinematic" : "")} data-scramble={showEffects && menuEffectsConfig.scramble ? "true" : undefined} ref={panelRef} role="dialog" aria-modal="true" aria-label="Explore portfolio">
      {showEffects && menuEffectsConfig.background && <CursorBackgrounds scope="menu"/>}
      <div className="v2-quicknav-top">
        <span><i aria-hidden="true"/> EXPLORE / PORTFOLIO</span>
        <button type="button" ref={closeRef} onClick={onClose} aria-label="Close navigation" data-cursor-label="CLOSE">CLOSE <span aria-hidden="true">✕</span></button>
      </div>
      <div className="v2-quicknav-content">
        <div className="v2-quicknav-intro">
          <span>{navigationContent.introLabel}</span>
          <p>{navigationContent.introPrompt}</p>
        </div>
        <nav aria-label="Full-screen navigation">
          {routes.map(([number, label, href, description]) => <InteractiveDepthCard as="a" enabled={showEffects && menuEffectsConfig.depth} freezeOnSelector="strong" href={href} key={href} data-cursor-label="GO" onClick={onClose} className={"v2-quicknav-link" + (activeSection === href.slice(1) ? " is-current" : "")} aria-current={activeSection === href.slice(1) ? "location" : undefined}>
            <span className="v2-quicknav-number" data-depth-magnet>{number}</span>
            <strong>{label}</strong>
            <span className="v2-quicknav-description">{description}</span>
            <span className="v2-quicknav-arrow" data-depth-magnet aria-hidden="true">↗</span>
          </InteractiveDepthCard>)}
        </nav>
      </div>
      <div className="v2-quicknav-footer">
        <span>{navigationContent.footerSlogan}</span>
        <a href={profile.github} target="_blank" rel="noopener noreferrer" data-cursor-label="OPEN">GITHUB ↗</a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" data-cursor-label="OPEN">LINKEDIN ↗</a>
      </div>
    </div>
  </div>;
}
