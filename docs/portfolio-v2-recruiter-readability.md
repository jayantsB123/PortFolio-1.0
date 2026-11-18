# V2.1: Recruiter readability and content hierarchy

## What was wrong
The V2 portfolio had an attractive design, but its information architecture made a technical hiring reviewer work too hard:
- Hero used a metaphorical headline without clearly stating the candidate's role or specialism.
- Career experience appeared **after** the project gallery, generic skills, and a long scroll-linked animation chapter.
- Expertise cards described abstract qualities, not a categorized technical stack.
- Project cards mainly used evocative captions. To find the implementation, reviewers had to open a modal.
- Contacts and the real historical résumé link were easy to miss.

## What changed
1. Hero now starts with name, **Software Developer**, frontend/full-stack focus, plain-language value statement and direct actions.
2. **At a glance** section makes four key facts available without scrolling through large graphics: technical focus, internship experience, projects and education.
3. Engineering internships now appear **before** projects. Each lists the role, organization, dates, concise responsibilities and technologies. These are historical from 2023–2024, not false current employment claims.
4. Projects now show category, what was built and tech badges without opening a modal. Both the case study and verified GitHub source are visible actions.
5. Skills now explicitly group frontend, backend/API, data/tools, and creative frontend competencies instead of relying on metaphor.
6. Experimental architecture scroll chapter moved to **after** essential résumé information. Visual identity, colors, 3D artwork, motion, and case-study dialog are retained.
7. Search metadata includes software developer and technical domains.

## Content accuracy and next hiring-focused improvements
- Original project and internship material was verified from the repository's own constants data, but the original text does not establish **current** job title, employer, 2025–2026 work experience or recent projects.
- Historical quantified gains weren't carried across without supporting evidence.
- Original TypeSpeed source link returns GitHub 404; it isn't presented as a working source.
- The original public résumé URL may be outdated. Replace it with a current PDF or verified public document before finalizing a prominent résumé CTA.
- Upgrade each case study with **your actual contribution**, architecture diagram, live demo, measurable result, tech decisions and lessons learned. Never invent metrics.
- For target roles (frontend, product engineering, full-stack SDE), edit the 1-line specialization and reorder projects based on the role.
- Suggested quick HR test: in 15 seconds, can someone find role, specialization, location, work experience and primary skills? In 60 seconds, can they identify a relevant project and click its source? Ask 2–3 people to review these tasks.

## Technical follow-ups
- CI: npm build on GitHub Actions, plus manual smoke test.
- Performance & accessibility: measure WebGL on real devices, run keyboard/reduced-motion tests, axe and Lighthouse before deployment.
- Refactor remaining legacy helpers and old unused code after V2.1 acceptance.
- Update contact details and current résumé before making the page public for applications.

## Scope
This branch changes recruiter-facing content only. It does not change the production deployment or default branch and is offered as a draft pull request for review.
