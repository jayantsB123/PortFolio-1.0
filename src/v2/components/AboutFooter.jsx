import { profile } from "../portfolioData";

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


export { About, Footer };
