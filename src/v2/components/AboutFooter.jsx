import { aboutContent, contactContent, profile } from "../portfolioData";

function Glyph({ children }) {
  return <span className="glyph" aria-hidden="true">{children}</span>;
}

// ── 08 / ABOUT ──────────────────────────────────────────────────────────────
function About() {
  return <section id="about" className="v2-about">
    <div className="v2-container v2-about-layout">
      <div className="v2-about-aside">
        <span>05 / 06 — {aboutContent.asideEyebrow}</span>
        <div className="v2-about-art">
          <span>✳</span>
          <small>{aboutContent.artworkCaption[0]}<br/>{aboutContent.artworkCaption[1]}</small>
        </div>
      </div>
      <div className="v2-about-main">
        <div className="v2-about-kicker">{aboutContent.eyebrow}</div>
        <h2>{aboutContent.headingLine1}<br/><em>{aboutContent.headingLine2}</em></h2>
        {aboutContent.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <div className="v2-about-bottom">
          <span>{profile.location.toUpperCase()}</span><span>{aboutContent.descriptor}</span>
        </div>
      </div>
    </div>
  </section>;
}

// ── 10 / CONTACT ────────────────────────────────────────────────────────────
function Footer() {
  return <footer id="contact" className="v2-footer">
    <div className="v2-container">
      <div className="v2-footer-top">
        <span>06 / 06 — {contactContent.eyebrow}</span>
        <span>{contactContent.rightLabel}</span>
      </div>
      <h2>{contactContent.headingLine1}<br/><em>{contactContent.headingLine2}</em></h2>
      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
        className="v2-contact-link">
        {contactContent.cta} <Glyph>↗</Glyph>
      </a>
      <div className="v2-footer-bottom">
        <a className="v2-footer-mark" href="#top" aria-label="j. Back to top">j.</a>
        <span>© {new Date().getFullYear()} {profile.name.toUpperCase()}</span>
        <div>
          <a target="_blank" rel="noopener noreferrer" href={profile.github}>{contactContent.footerLinks.github}</a>
          <a target="_blank" rel="noopener noreferrer" href={profile.linkedin}>{contactContent.footerLinks.linkedin}</a>
          <a href="#top">{contactContent.footerLinks.backToTop}</a>
        </div>
      </div>
    </div>
  </footer>;
}

export { About, Footer };
