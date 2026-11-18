import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { categories, earlyExperience, profile, school, selectedProjects } from "./portfolioData";
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
      if (entries[0] && entries[0].isIntersecting) setVisible(true);
    }, { rootMargin: "100px" });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return <div className="v2-engine" ref={ref}>
    <div className="v2-engine-orbit" aria-hidden="true"/>
    <div className="v2-engine-cross cross-one" aria-hidden="true">+</div>
    <div className="v2-engine-cross cross-two" aria-hidden="true">+</div>
    <div className="v2-engine-visual">
      {hasWebGL && visible && !reducedMotion
        ? <Suspense fallback={<OrbitalFallback expanded={expanded}/>}>
          <PortfolioScene expanded={expanded}/>
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

function SectionHeading({ number, eyebrow, heading, subheading }) {
  return <div className="v2-section-heading">
    <div className="v2-eyebrow"><span>{number} / 06</span><i/>{eyebrow}</div>
    <div className="v2-heading-row"><h2>{heading}</h2>{subheading && <p>{subheading}</p>}</div>
  </div>;
}

function ProjectVisual({ project }) {
  return <div className={"v2-project-visual visual-" + project.tone}>
    <div className="v2-visual-label">{project.category} / {project.index}</div>
    <div className="v2-preview-frame">
      {project.source && project.source.image
        ? <img alt={"Screenshot of " + project.name} src={project.source.image} loading="lazy" decoding="async" />
        : <span>{project.name}</span>}
    </div>
    <div className="v2-preview-foot"><span>ENGINEERING / IN PRACTICE</span><Glyph>✳</Glyph></div>
  </div>;
}

function Work({ openProject }) {
  const [filter, setFilter] = useState("ALL");
  const shown = selectedProjects.filter((project) => filter === "ALL" || project.category === filter);
  return <section id="work" className="v2-work v2-page-section">
    <div className="v2-container">
      <SectionHeading number="03" eyebrow="SELECTED PROJECTS" heading="Projects & implementation."
        subheading="Selected full-stack, UI and algorithm projects. Scan the stack, explore the implementation or open a case study."/>
      <div className="v2-work-bar">
        <span>SELECTED PROJECTS / 2023—2024</span>
        <div role="group" aria-label="Filter projects" className="v2-filters">
          {categories.map((category) => <button type="button" key={category} aria-pressed={filter === category}
            className={filter === category ? "is-active" : ""} onClick={() => setFilter(category)}>
            {category.charAt(0) + category.slice(1).toLowerCase()}
            <sup>{String(category === "ALL" ? selectedProjects.length : selectedProjects.filter((project) => project.category === category).length).padStart(2,"0")}</sup>
          </button>)}
        </div>
      </div>
      <div className="v2-project-grid">
        {shown.map((project) => <article className="v2-project-card" key={project.slug}>
          <button type="button" className="v2-project-button" aria-label={"Read case study: " + project.name} onClick={() => openProject(project)}>
            <ProjectVisual project={project}/>
            <div className="v2-project-info">
              <div>
                <div className="v2-project-eyebrow">{project.type} · {project.year}</div>
                <h3>{project.name}</h3>
                <p>{project.overview}</p>
                <div className="v2-project-tags">{project.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div>
              </div>
              <span className="v2-project-arrow" aria-hidden="true">↗</span>
            </div>
          </button>
          <div className="v2-project-actions"><button type="button" onClick={() => openProject(project)}>CASE STUDY ↗</button>{project.repoUrl ? <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">SOURCE ↗</a> : <span>SOURCE UNAVAILABLE</span>}</div>
        </article>)}
      </div>
      <div className="v2-work-after"><span>THE BEST PART IS THE PROBLEM SOLVING.</span><a href={profile.github} target="_blank" rel="noopener noreferrer">MORE ON GITHUB <Glyph>↗</Glyph></a></div>
    </div>
  </section>;
}


function About() {
  return <section id="about" className="v2-about"><div className="v2-container v2-about-layout">
    <div className="v2-about-aside">
      <span>05 / 06 — THE PERSON BEHIND THE WORK</span>
      <div className="v2-about-art"><span>✳</span><small>ALWAYS<br/>IN THE MAKING.</small></div>
    </div>
    <div className="v2-about-main">
      <div className="v2-about-kicker">NOT JUST PIXELS & PULL REQUESTS</div>
      <h2>Curiosity is<br/>my <em>default</em><span>.</span></h2>
      <p>I started building for the web because I liked seeing ideas become real. What keeps me here is the engineering underneath: finding better ways to make complex things clear, reliable, and useful.</p>
      <p>From frontend interactions to backend systems, I care about how software behaves as much as how it looks.</p>
      <div className="v2-about-bottom"><span>{profile.location.toUpperCase()}</span><span>ENGINEER / BUILDER / CURIOUS HUMAN</span></div>
    </div>
  </div></section>;
}

function Footer() {
  return <footer id="contact" className="v2-footer"><div className="v2-container">
    <div className="v2-footer-top"><span>06 / 06 — CONNECT</span><span>GOT SOMETHING GOOD IN MIND?</span></div>
    <h2>Have a role<br/>or <em>project?</em></h2>
    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="v2-contact-link">CONNECT ON LINKEDIN <Glyph>↗</Glyph></a>
    <div className="v2-footer-bottom"><a className="v2-footer-mark" href="#top" aria-label="Back to top">j.</a>
      <span>© {new Date().getFullYear()} {profile.name.toUpperCase()}</span>
      <div><a target="_blank" rel="noopener noreferrer" href={profile.github}>GITHUB ↗</a><a target="_blank" rel="noopener noreferrer" href={profile.linkedin}>LINKEDIN ↗</a><a href="#top">BACK TO TOP ↑</a></div>
    </div>
  </div></footer>;
}

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
      <Work openProject={setProject}/>
      <RecruiterSkills/>
      <About/>
      <ArchitectureInterlude/>
    </main>
    <Footer/>
    {project && <ProjectDialog project={project} close={() => setProject(null)}/>}
  </div>;
}
