import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { earlyExperience, profile, quickFacts, school, skillGroups } from "./portfolioData";
import GravityDots from "./components/GravityDots";

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
    <div className="v2-hero-atmosphere" aria-hidden="true">{Array.from({ length: 19 }, (_, i) => <i key={i} style={{ "--particle": i }}/>)}</div>
    <div className="v2-hero-body">
      <motion.div className="v2-hero-copy" style={reducedMotion ? undefined : { y: contentLift, opacity: contentOpacity }}>
        <div className="v2-kicker" data-heading-effect><i/> {profile.name.toUpperCase()}</div>
        <motion.h1 initial={reducedMotion ? false : { opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .7, ease: [.22, 1, .36, 1] }}>Software<br/><em>developer</em><span>.</span></motion.h1>
        <p className="v2-hero-specialty">{profile.specialty}</p>
        <p className="v2-hero-description">{profile.summary}</p>
        <div className="v2-hero-actions">
          <a className="v2-button-solid" href="#work">VIEW PROJECTS ↗</a>
          <a className="v2-button-outline" href="#experience">MY EXPERIENCE ↓</a>
        </div>
      </motion.div>
      {artwork}
    </div>
    <motion.a className="v2-hero-scroll-cue" href="#overview" aria-label="Scroll to explore the portfolio overview" style={reducedMotion ? undefined : { opacity: cueOpacity }}>
      <span>SCROLL TO EXPLORE</span><span className="v2-scroll-cue-track"><i/></span><span aria-hidden="true">↓</span>
    </motion.a>
  </section>;
}

export function RecruiterOverview() {
  return <section id="overview" className="v2-overview" aria-label="Career overview"><div className="v2-container">
    <div className="v2-overview-heading">
      <div><span className="v2-overview-kicker">THE SHORT VERSION</span><h2>At a glance.</h2></div>
      <p>Experience, technologies and selected work — the essentials, all in one place.</p>
    </div>
    <div className="v2-overview-grid">
      {quickFacts.map((fact) => <a className="v2-overview-fact" href={fact.href} key={fact.label}>
        <span className="v2-overview-label">{fact.label} ↗</span>
        <strong>{fact.value}</strong>
        <small>{fact.detail}</small>
      </a>)}
    </div>
    <div className="v2-overview-links">
      <a href={profile.github} target="_blank" rel="noopener noreferrer">GITHUB PROFILE ↗</a>
      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LINKEDIN PROFILE ↗</a>
    </div>
  </div></section>;
}

export function RecruiterExperience() {
  return <section id="experience" className="v2-experience v2-page-section"><div className="v2-container">
    <div className="v2-section-heading">
      <div className="v2-eyebrow"><span>02 / 06</span><i/>PROFESSIONAL EXPERIENCE</div>
      <div className="v2-heading-row"><h2>Experience.</h2><p>Selected engineering internships, with responsibilities and the technologies behind the work.</p></div>
    </div>
    <div className="v2-experience-list">
      {earlyExperience.map((job) => <article className="v2-role v2-role-clarity" key={job.company}>
        <div className="v2-role-date">{job.date}</div>
        <div className="v2-role-main">
          <h3>{job.role}</h3>
          <div className="v2-role-company-inline">{job.company}</div>
          <ul>{job.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
          <div className="v2-role-tech">{job.stack.map((tech) => <span key={tech}>{tech}</span>)}</div>
        </div>
        <span className="v2-role-company">{job.company}</span>
      </article>)}
    </div>
    {school && <div id="education" className="v2-education-line v2-education-clarity">
      <span>EDUCATION · {school.date}</span>
      <div><strong>{school.degree}</strong><small>{school.school}</small></div>
      <span>{school.grade || "Computer Science"}</span>
    </div>}
  </div></section>;
}

export function RecruiterSkills() {
  return <section id="skills" className="v2-skills v2-page-section"><div className="v2-container">
    <div className="v2-section-heading">
      <div className="v2-eyebrow"><span>04 / 06</span><i/> TECHNICAL SKILLS</div>
      <div className="v2-heading-row"><h2>What I work with.</h2><p>A practical view of frontend, backend, data, and creative frontend technologies.</p></div>
    </div>
    <div className="v2-skills-grid">
      {skillGroups.map((group, index) => <article className="v2-skills-group" key={group.title}>
        <div className="v2-skills-top"><span>0{index + 1}</span><h3>{group.title}</h3></div>
        <p>{group.summary}</p>
        <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
      </article>)}
    </div>
    <div className="v2-skills-disclaimer">Technologies used across projects, professional experience and interactive web work.</div>
  </div></section>;
}
