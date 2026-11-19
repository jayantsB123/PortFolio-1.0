import { useState } from "react";
import { useReducedMotion, motion } from "framer-motion";
import { categories, profile, selectedProjects } from "./portfolioData";
import { countByCategory, filterProjects, projectAccessibleName } from "./projectView";

/**
 * A list/gallery explorer inspired by the reference video's hover previews.
 * The complete project summary stays visible in both modes; previews are
 * decorative enhancements and are never the only source of information.
 */
export function ProjectVisual({ project }) {
  return <div className={"v2-project-visual visual-" + project.tone}>
    <div className="v2-visual-label">{project.category} / {project.index}</div>
    <div className="v2-preview-frame">
      {project.source?.image
        ? <img alt={"Screenshot of " + project.name} src={project.source.image} loading="lazy" decoding="async" />
        : <span>{project.name}</span>}
    </div>
    <div className="v2-preview-foot"><span>ENGINEERING / IN PRACTICE</span><span aria-hidden="true">✳</span></div>
  </div>;
}

export default function ProjectExplorer({ openProject }) {
  const [category, setCategory] = useState("ALL");
  const [view, setView] = useState("list");
  const [activePreview, setActivePreview] = useState(null);
  const reducedMotion = useReducedMotion();
  const shown = filterProjects(selectedProjects, category);
  return <section id="work" className="v2-work v2-page-section" aria-labelledby="v2-work-heading">
    <div className="v2-container">
      <div className="v2-section-heading">
        <div className="v2-eyebrow"><span>03 / 06</span><i/> SELECTED PROJECTS</div>
        <div className="v2-heading-row">
          <h2 id="v2-work-heading">Projects & implementation.</h2>
          <p>Selected full-stack, UI and algorithm projects. Scan the stack, explore the implementation or open a case study.</p>
        </div>
      </div>
      <div className="v2-work-bar v2-explorer-toolbar">
        <span>SELECTED PROJECTS / 2023—2024</span>
        <div className="v2-explorer-controls">
          <div role="group" aria-label="Filter projects" className="v2-filters">
            {categories.map((item) => <button type="button" key={item} aria-pressed={category === item}
              className={category === item ? "is-active" : ""} onClick={() => setCategory(item)}>
              {item.charAt(0) + item.slice(1).toLowerCase()}
              <sup>{String(countByCategory(selectedProjects, item)).padStart(2,"0")}</sup>
            </button>)}
          </div>
          <div role="group" aria-label="Project layout" className="v2-layout-switch">
            <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")} title="List view">
              <span aria-hidden="true">☷</span> LIST
            </button>
            <button type="button" aria-pressed={view === "gallery"} onClick={() => setView("gallery")} title="Gallery view">
              <span aria-hidden="true">▦</span> GALLERY
            </button>
          </div>
        </div>
      </div>
      <div className="v2-explorer-count" aria-live="polite">{shown.length} {shown.length === 1 ? "project" : "projects"} shown · {view} view</div>
      {view === "list"
        ? <div className="v2-project-list" aria-label="Project list">
          {shown.map((project) =>
            <motion.article className="v2-project-list-row" key={project.slug} layout={!reducedMotion}
              onMouseEnter={() => setActivePreview(project.slug)}
              onMouseLeave={() => setActivePreview(null)}
              onFocusCapture={() => setActivePreview(project.slug)}
              onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setActivePreview(null); }}
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .25 }}>
              <span className="v2-project-row-index">{project.index}</span>
              <div className="v2-project-row-main">
                <div className="v2-project-row-meta">{project.type} / {project.year}</div>
                <button type="button" className="v2-project-row-name" data-cursor-label="VIEW" onClick={() => openProject(project)}
                  aria-label={"Read case study: " + projectAccessibleName(project)}>{project.name}<span aria-hidden="true">↗</span></button>
                <p>{project.overview}</p>
                <div className="v2-project-tags" aria-label="Technologies used">
                  {project.technologies.map((tech) => <span key={tech}>{tech}</span>)}
                </div>
              </div>
              <div className="v2-project-list-actions">
                <button type="button" onClick={() => openProject(project)}>CASE STUDY ↗</button>
                {project.repoUrl
                  ? <a href={project.repoUrl} data-cursor-label="CODE" target="_blank" rel="noopener noreferrer">SOURCE ↗</a>
                  : <span>SOURCE UNAVAILABLE</span>}
              </div>
              <div className="v2-project-list-preview" aria-hidden="true">
                {activePreview === project.slug && <ProjectVisual project={project}/>}
              </div>
            </motion.article>)}
        </div>
        : <div className="v2-project-grid">
          {shown.map((project) => <article className="v2-project-card" key={project.slug}>
            <button type="button" className="v2-project-button" data-cursor-label="VIEW" aria-label={"Read case study: " + projectAccessibleName(project)}
              onClick={() => openProject(project)}>
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
            <div className="v2-project-actions">
              <button type="button" onClick={() => openProject(project)}>CASE STUDY ↗</button>
              {project.repoUrl
                ? <a href={project.repoUrl} data-cursor-label="CODE" target="_blank" rel="noopener noreferrer">SOURCE ↗</a>
                : <span>SOURCE UNAVAILABLE</span>}
            </div>
          </article>)}
        </div>}
      <div className="v2-work-after">
        <span>DESIGNED, BUILT AND DOCUMENTED.</span>
        <a href={profile.github} target="_blank" rel="noopener noreferrer">MORE ON GITHUB <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  </section>;
}
