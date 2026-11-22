# Portfolio content map — November 2026

This update implements the owner's finalized 20 November 2026 content.
Single editorial source of truth: src/v2/portfolioData.js.

All employment, awards, volume figures and bank references were supplied by
the owner as public-facing statements and are not independently verified.

| Content section | Source export | Website component / anchor |
| --- | --- | --- |
| Identity, social links, résumé | profile | Hero, overview, footer, navigation, metadata |
| Hero headline, CTAs, summary | heroContent | RecruiterHero / #top |
| Overview and career facts | overviewContent, quickFacts, overviewEducation | RecruiterOverview / #overview |
| Sarvatra roles and older internships | experienceContent, primaryExperience, earlyExperience | RecruiterExperience / #experience |
| Degree, dates, CGPA | school | Education row / #education |
| Four featured case studies | projectContent, selectedProjects, categories | ProjectExplorer / #work |
| Three supporting builds | supportingProjects | Compact rows in ProjectExplorer |
| Skills | skillsContent, skillGroups | RecruiterSkills / #skills |
| About copy | aboutContent | AboutFooter / #about |
| Engineering philosophy | philosophyContent | ArchitectureInterlude |
| Contact and footer | contactContent | AboutFooter / #contact |
| Six-route navigation | navigationContent | PortfolioApp and QuickNav |
| Four loader captions | loaderContent | PortfolioLoader |
| Six recognitions | achievementsContent | RecruiterAchievements / #achievements |

## Editing the content

Edit the corresponding labeled section in src/v2/portfolioData.js.
Each project has a category, year, overview, challenge, approach, technologies,
source link or null, and highlights. The workplace projects use abstract
artwork rather than student-era screenshots.

The experience section displays four SDE impact bullets first; the remaining
six can be expanded with a keyboard-accessible button. The overview's
recognition card leads to the achievements section.

The visual configuration and animations are unchanged. Gravity Dots intensity,
radius, loader styles and timing remain configured separately in
src/v2/config/setenv.js and the local .env file.

## Publication scope

No email, telephone number, private address or workplace source code is exposed.
The résumé link supplied by the owner is accessible under education.
The legacy student projects are not featured; their source files remain
archived in the repository.

## QA

Verify the React build, existing navigation, list and gallery project filters,
accessibility, the six achievements, five professional roles, four featured
case studies, three supporting projects and long mobile hero copy.
