import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import {
  achievementsContent, earlyExperience, experienceContent, heroContent,
  overviewContent, overviewEducation, primaryExperience, profile,
  quickFacts, school, skillGroups, skillsContent,
} from "./portfolioData";
import GravityDots from "./components/GravityDots";

// ── 02 / HERO ──────────────────────────────────────────────────────────────
export function RecruiterHero({ artwork }) {
  const reducedMotion = useReducedMotion();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const contentLift = useTransform(scrollYProgress, [0, 1], [0, -55]);
  const contentOpacity = useTransform(scrollYProgress, [0, .86, 1], [1, 1, .25]);
  const cueOpacity = useTransform(scrollYProgress, [0, .2, .45], [1, 1, 0]);
  return <section ref={heroRef} id="top" className="v2-hero v2-hero-clarity">
    <div className="v2-hero-grid" aria-hidden="true"/>
    <GravityDots/>
    <div className="v2-hero-atmosphere" aria-hidden="true">
      {Array.from({ length: 19 }, (_, i) => <i key={i} style={{ "--particle": i }}/>)}
    </div>
    <div className="v2-hero-body">
      <motion.div className="v2-hero-copy"
        style={reducedMotion ? undefined : { y: contentLift, opacity: contentOpacity }}>
        <div className="v2-kicker" data-heading-effect><i/> {heroContent.kicker}</div>
        <motion.h1 initial={reducedMotion ? false : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: [.22, 1, .36, 1] }}>
          {heroContent.headingLine1}<br/><em>{heroContent.headingLine2}</em><span>.</span>
        </motion.h1>
        <p className="v2-hero-specialty">{heroContent.specialty}</p>
        <p className="v2-hero-description">{heroContent.summary}</p>
        <div className="v2-hero-actions">
          <a className="v2-button-solid" href={heroContent.primaryHref}>{heroContent.primaryCta}</a>
          <a className="v2-button-outline" href={heroContent.secondaryHref}>{heroContent.secondaryCta}</a>
        </div>
      </motion.div>
      {artwork}
    </div>
    <motion.a className="v2-hero-scroll-cue" href={heroContent.scrollHref}
      aria-label="Scroll to explore the portfolio overview"
      style={reducedMotion ? undefined : { opacity: cueOpacity }}>
      <span>{heroContent.scrollCue}</span><span className="v2-scroll-cue-track"><i/></span>
      <span aria-hidden="true">↓</span>
    </motion.a>
  </section>;
}

// ── 03 / AT A GLANCE ────────────────────────────────────────────────────────
export function RecruiterOverview() {
  return <section id="overview" className="v2-overview" aria-label="Career overview">
    <div className="v2-container">
      <div className="v2-overview-heading">
        <div><span className="v2-overview-kicker">{overviewContent.eyebrow}</span>
          <h2>{overviewContent.heading}</h2>
        </div>
        <p>{overviewContent.intro}</p>
      </div>
      <div className="v2-overview-grid">
        {quickFacts.map((fact) => <a className="v2-overview-fact" href={fact.href} key={fact.label}>
          <span className="v2-overview-label">{fact.label} ↗</span>
          <strong>{fact.value}</strong><small>{fact.detail}</small>
        </a>)}
      </div>
      <a className="v2-overview-education" href={overviewEducation.href}>
        <span>{overviewEducation.label} ↗</span>
        <strong>{overviewEducation.summary}</strong>
        <small>{overviewEducation.institution} · {overviewEducation.grade} · {overviewEducation.year}</small>
      </a>
      <div className="v2-overview-links">
        <a href={profile.github} target="_blank" rel="noopener noreferrer">{overviewContent.links.github}</a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">{overviewContent.links.linkedin}</a>
      </div>
    </div>
  </section>;
}

// ── 04 / EXPERIENCE + 05 / EDUCATION ───────────────────────────────────────
function DetailedRole({ job }) {
  const [expanded, setExpanded] = useState(false);
  const count = job.initiallyVisibleBullets || job.bullets.length;
  const hiddenCount = Math.max(0, job.bullets.length - count);
  const visibleBullets = expanded ? job.bullets : job.bullets.slice(0, count);
  return <article className="v2-role v2-role-clarity v2-role-featured">
    <div className="v2-role-date">
      {job.date}
      <span className="v2-role-employment">{job.employmentType} · {job.location}</span>
    </div>
    <div className="v2-role-main">
      <h3>{job.role}</h3>
      <div className="v2-role-company-inline">{job.company}</div>
      <ul>{visibleBullets.map((bullet, index) => <li key={index}>{bullet}</li>)}</ul>
      {hiddenCount > 0 && <button type="button" className="v2-role-expand"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}>
        {expanded ? experienceContent.showLess : experienceContent.showMore}
        {!expanded && <span> ({hiddenCount})</span>}
      </button>}
      <div className="v2-role-tech">{job.stack.map((tech) => <span key={tech}>{tech}</span>)}</div>
    </div>
    <span className="v2-role-company">{job.company}</span>
  </article>;
}

export function RecruiterExperience() {
  return <section id="experience" className="v2-experience v2-page-section">
    <div className="v2-container">
      <div className="v2-section-heading">
        <div className="v2-eyebrow"><span>02 / 06</span><i/>{experienceContent.eyebrow}</div>
        <div className="v2-heading-row">
          <h2>{experienceContent.heading}</h2><p>{experienceContent.intro}</p>
        </div>
      </div>
      <div className="v2-experience-list">
        {primaryExperience.map((job) => <DetailedRole key={job.id} job={job}/>)}
      </div>
      <div className="v2-earlier-heading">{experienceContent.earlyLabel}</div>
      <div className="v2-experience-list v2-earlier-list">
        {earlyExperience.map((job) => <article className="v2-role v2-role-clarity v2-role-earlier" key={job.id}>
          <div className="v2-role-date">{job.date}</div>
          <div className="v2-role-main">
            <h3>{job.role}</h3>
            <div className="v2-role-company-inline">{job.company}</div>
            <p className="v2-earlier-summary">{job.summary}</p>
            <div className="v2-role-tech">{job.stack.map((tech) => <span key={tech}>{tech}</span>)}</div>
          </div>
          <span className="v2-role-company">{job.company}</span>
        </article>)}
      </div>
      <div id="education" className="v2-education-line v2-education-clarity">
        <span>EDUCATION · {school.date}</span>
        <div><strong>{school.degree}</strong><small>{school.school}</small></div>
        <span>{school.grade}</span>
      </div>
      <div className="v2-resume-inline"><a href={profile.resume} target="_blank" rel="noopener noreferrer">VIEW RÉSUMÉ ↗</a></div>
    </div>
  </section>;
}

// ── 13 / ACHIEVEMENTS — overview recognition card links here ──────────────
export function RecruiterAchievements() {
  return <section id="achievements" className="v2-achievements" aria-labelledby="v2-achievements-title">
    <div className="v2-container">
      <div className="v2-achievements-heading">
        <div className="v2-eyebrow"><span>✳</span><i/>{achievementsContent.eyebrow}</div>
        <h2 id="v2-achievements-title">{achievementsContent.heading}</h2>
        <p>{achievementsContent.intro}</p>
      </div>
      <div className="v2-achievements-grid">
        {achievementsContent.entries.map((item, index) => <article className="v2-achievement" key={item.title}>
          <span className="v2-achievement-index">{String(index + 1).padStart(2, "0")}</span>
          <strong>{item.result}</strong><h3>{item.title}</h3><p>{item.detail}</p>
        </article>)}
      </div>
    </div>
  </section>;
}

// ── 07 / SKILLS ────────────────────────────────────────────────────────────
export function RecruiterSkills() {
  return <section id="skills" className="v2-skills v2-page-section">
    <div className="v2-container">
      <div className="v2-section-heading">
        <div className="v2-eyebrow"><span>04 / 06</span><i/>{skillsContent.eyebrow}</div>
        <div className="v2-heading-row"><h2>{skillsContent.heading}</h2><p>{skillsContent.intro}</p></div>
      </div>
      <div className="v2-skills-grid">
        {skillGroups.map((group, index) => <article className="v2-skills-group" key={group.title}>
          <div className="v2-skills-top"><span>0{index + 1}</span><h3>{group.title}</h3></div>
          <p>{group.summary}</p>
          <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>)}
      </div>
      <div className="v2-skills-disclaimer">{skillsContent.disclaimer}</div>
    </div>
  </section>;
}
