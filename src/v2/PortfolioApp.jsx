import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import ProjectExplorer, { ProjectVisual } from "./ProjectExplorer";
import { About, Footer } from "./components/AboutFooter";
import QuickNav from "./QuickNav";
import InteractiveCursor from "./components/InteractiveCursor";
import MotionDirector from "./components/MotionDirector";
import ScrambleHeadings from "./components/ScrambleHeadings";
import PortfolioLoader from "./components/PortfolioLoader";
import { useActiveSection } from "./hooks/useActiveSection";
import "./portfolio.css";
import "./interactionOverlays.css";
import "./heroLayout.css";
import ArchitectureInterlude from "./ArchitectureInterlude";
import { RecruiterHero, RecruiterOverview, RecruiterExperience, RecruiterSkills } from "./RecruiterContent";

// Imported separately so WebGL is never required for reading the page.
const PortfolioScene = lazy(() => import("./PortfolioScene"));

function Glyph({ children, className = "" }) {
  return <span className={"glyph " + className} aria-hidden="true">{children}</span>;
}

function SiteHeader() {
  const [open, setOpen] = useState(false);
  const activeSection = useActiveSection();
  const { scrollYProgress } = useScroll();
  const railProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 28 });
  const reduceMotion = useReducedMotion();
  const links = [
    ["01", "Overview", "#overview", "⌁"],
    ["02", "Experience", "#experience", "▤"],
    ["03", "Projects", "#work", "⌘"],
    ["04", "Skills", "#skills", "✳"],
    ["05", "About", "#about", "◈"],
    ["06", "Contact", "#contact", "↗"],
  ];
  return <>

    <AnimatePresence>
      {activeSection && <motion.nav key="side-rail" className="v2-side-rail" aria-label="Section navigation"
        initial={reduceMotion ? false : { opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -30 }}
        transition={{ duration: reduceMotion ? 0 : .42, ease: [.22,1,.36,1] }}>
        <a className="v2-rail-brand" href="#top" title="Back to top">j<span>.</span></a>
        <div className="v2-rail-track" aria-hidden="true"><motion.span style={{ scaleY: railProgress }}/></div>
        <div className="v2-rail-links">
          {links.map(([number, label, href, glyph]) => <a key={href} href={href}
            aria-label={label} title={label} data-cursor-label="GO"
            className={activeSection === href.slice(1) ? "is-current" : undefined}
            aria-current={activeSection === href.slice(1) ? "location" : undefined}>
            <span className="v2-rail-icon" aria-hidden="true">{glyph}</span>
            <span className="v2-rail-label">{label}</span>
            <span className="v2-rail-number" aria-hidden="true">{number}</span>
          </a>)}
        </div>
        <button type="button" className="v2-rail-explore" onClick={() => setOpen(true)}
          aria-label="Open full section navigation" title="Explore all sections" data-cursor-label="MENU">☷</button>
      </motion.nav>}
    </AnimatePresence>
    <QuickNav open={open} onClose={() => setOpen(false)} activeSection={activeSection}/>
  </>;
}

function OrbitalFallback({ expanded }) {
  return <div className={expanded ? "v2-orbital-fallback is-open" : "v2-orbital-fallback"} aria-hidden="true">
    <span/><span/><span/><b/>
  </div>;
}

function EngineArtwork() {
  const [expanded, setExpanded] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(false);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const reducedMotion = useReducedMotion();
  const ref = useRef(null);

  useEffect(() => {
    let supported = false;
    try {
      const canvas = document.createElement("canvas");
      supported = Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    } catch {
      supported = false;
    }
    setHasWebGL(supported);
    if (!supported || reducedMotion || !ref.current) return undefined;
    const observer = new IntersectionObserver((entries) => {
      const inView = Boolean(entries[0]?.isIntersecting);
      setActive(inView);
      if (inView) setVisible(true);
    }, { rootMargin: "100px" });
    observer.observe(ref.current);
    const handleVisibility = () => setActive(!document.hidden && Boolean(ref.current?.getBoundingClientRect().bottom > 0 && ref.current?.getBoundingClientRect().top < innerHeight));
    document.addEventListener("visibilitychange", handleVisibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", handleVisibility); };
  }, [reducedMotion]);

  return <div className="v2-engine" ref={ref}>
    <div className="v2-engine-orbit" aria-hidden="true"/>
    <div className="v2-engine-cross cross-one" aria-hidden="true">+</div>
    <div className="v2-engine-cross cross-two" aria-hidden="true">+</div>
    <div className="v2-engine-visual">
      {hasWebGL && visible && !reducedMotion
        ? <Suspense fallback={<OrbitalFallback expanded={expanded}/>}>
          <PortfolioScene expanded={expanded} active={active}/>
        </Suspense>
        : <OrbitalFallback expanded={expanded}/>}
    </div>
    <button type="button" className="v2-engine-control" aria-pressed={expanded} onClick={() => setExpanded(!expanded)}>
      {expanded ? "RECONSTRUCT" : "DECONSTRUCT"} <Glyph>↗</Glyph>
    </button>
    <span className="v2-engine-legend"><i/> COMPLEXITY ENGINE / 001</span>
  </div>;
}

function Hero() { return <RecruiterHero artwork={<EngineArtwork/>} />; }

function ProjectDialog({ project, close }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const onCloseRef = useRef(close);
  onCloseRef.current = close;
  useEffect(() => {
    const before = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const handleKey = (event) => {
      if (event.key === "Escape") onCloseRef.current();
      if (event.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll('button:not([disabled]),a[href]'));
      if (!nodes.length) return;
      if (event.shiftKey && document.activeElement === nodes[0]) { event.preventDefault(); nodes[nodes.length-1].focus(); }
      if (!event.shiftKey && document.activeElement === nodes[nodes.length-1]) { event.preventDefault(); nodes[0].focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", handleKey);
      before?.focus?.();
    };
  }, []);
  return <div className="v2-modal-overlay" onMouseDown={(e) => { if (e.currentTarget === e.target) close(); }}>
    <aside className="v2-modal" ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="v2-project-title">
      <div className="v2-modal-top"><span>{project.index} / ENGINEERING CASE STUDY</span><button type="button" ref={closeRef} onClick={close} aria-label="Close case study">✕</button></div>
      <div className="v2-modal-content">
        <div className="v2-modal-kicker">{project.type.toUpperCase()} — {project.year}</div>
        <h2 id="v2-project-title">{project.name}</h2>
        <p className="v2-modal-lead">{project.overview}</p>
        <ProjectVisual project={project}/>
        <div className="v2-modal-columns">
          <div><h3>THE CHALLENGE</h3><p>{project.problem}</p></div>
          <div><h3>THE APPROACH</h3><p>{project.solution}</p></div>
          <div><h3>WHAT I BUILT</h3><ul>{project.highlights.map((h) => <li key={h}>{h}</li>)}</ul></div>
          <div><h3>BUILT WITH</h3><p>{project.technologies.join(" / ")}</p></div>
        </div>
        <div className="v2-modal-actions">{project.repoUrl ? <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">VIEW SOURCE ↗</a> : <span>SOURCE LINK TO BE CONFIRMED</span>}<button type="button" onClick={close}>BACK TO WORK ←</button></div>
      </div>
    </aside>
  </div>;
}

export default function PortfolioApp() {
  const [project, setProject] = useState(null);
  return <div className="v2-root">
    <InteractiveCursor/>
    <MotionDirector/>
    <ScrambleHeadings/>
    <a className="v2-skip" href="#overview">Skip to career overview</a>
    <SiteHeader/>
    <main>
      <Hero/>
      <RecruiterOverview/>
      <RecruiterExperience/>
      <ProjectExplorer openProject={setProject}/>
      <RecruiterSkills/>
      <About/>
      <ArchitectureInterlude/>
    </main>
    <Footer/>
    {project && <ProjectDialog project={project} close={() => setProject(null)}/>}
    <PortfolioLoader/>
  </div>;
}
