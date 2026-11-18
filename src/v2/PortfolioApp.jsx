import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { profile } from "./portfolioData";
import ProjectExplorer, { ProjectVisual } from "./ProjectExplorer";
import { About, Footer } from "./components/AboutFooter";
import "./portfolio.css";
import ArchitectureInterlude from "./ArchitectureInterlude";
import { RecruiterHero, RecruiterOverview, RecruiterExperience, RecruiterSkills } from "./RecruiterContent";

// Imported separately so WebGL is never required for reading the page.
const PortfolioScene = lazy(() => import("./PortfolioScene"));

function Glyph({ children, className = "" }) {
  return <span className={"glyph " + className} aria-hidden="true">{children}</span>;
}

function SiteHeader() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (event) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  const links = [
    ["Overview", "#overview"],
    ["Experience", "#experience"],
    ["Projects", "#work"],
    ["Skills", "#skills"],
    ["About", "#about"],
    ["Contact", "#contact"]
  ];
  return <header className="v2-header">
    <a className="v2-logo" href="#top" aria-label="Jayant — back to top">
      <span className="v2-logo-mark">j<span>.</span></span>
      <span className="v2-logo-text">JAYANT <span>/ SOFTWARE ENGINEER</span></span>
    </a>
    <nav id="v2-main-nav" className={open ? "v2-nav is-open" : "v2-nav"} aria-label="Main navigation">
      {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
    </nav>
    <a className="v2-top-cta" target="_blank" rel="noopener noreferrer" href={profile.linkedin}>CONTACT / LINKEDIN <Glyph>↗</Glyph></a>
    <button type="button" className="v2-menu-button" aria-expanded={open} aria-controls="v2-main-nav" onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"}>
      {open ? "✕" : "☰"}
    </button>
  </header>;
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

function Progress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return <motion.div className="v2-progress" style={{ scaleX }} aria-hidden="true"/>;
}

export default function PortfolioApp() {
  const [project, setProject] = useState(null);
  return <div className="v2-root">
    <a className="v2-skip" href="#overview">Skip to career overview</a>
    <Progress/>
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
  </div>;
}
