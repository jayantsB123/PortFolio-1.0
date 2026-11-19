import { useEffect, useState } from "react";

const sectionIds = ["overview", "experience", "work", "skills", "about", "contact"];

// One passive scroll listener keeps both navigation layouts in sync.
// The observer isn't tied to animation and the selected link remains usable
// with reduced motion enabled.
export function useActiveSection() {
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const readingLine = window.innerHeight * 0.36;
      let current = null;

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= readingLine) {
          current = id;
        }
      }

      if (window.scrollY < window.innerHeight * 0.3) current = null;
      setActiveSection((previous) => previous === current ? previous : current);
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return activeSection;
}
