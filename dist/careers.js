export const careers = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    icon: 'code',
    accent: '#2563eb',
    role: 'Build and ship software',
    months: '6–12',
    summary: 'From first lines of code to shipped, tested systems. A focused track that builds the computer-science core employers screen for, then turns it into a portfolio of real projects.',
    skills: ['Python & C++', 'Data structures & algorithms', 'Databases & SQL', 'Operating systems', 'Testing & debugging', 'Git & code review'],
    outcomes: ['Write clean, tested code in at least one language', 'Design schemas and query databases confidently', 'Ship a full project end-to-end', 'Pass technical screening interviews'],
    stages: [
      { title: 'Foundations', goal: 'Think like a programmer and write your first real code.', steps: [
        { course: 'nptel-106104074' },
        { course: 'nptel-106106145' },
        { project: 'Build three small console programs and publish them on GitHub.' }
      ] },
      { title: 'Core computer science', goal: 'The theory every technical interview returns to.', steps: [
        { course: 'nptel-106102064' },
        { course: 'nptel-106104135' },
        { course: 'nptel-106102132' }
      ] },
      { title: 'Build & ship', goal: 'Turn knowledge into working, maintained software.', steps: [
        { course: 'nptel-106105182' },
        { course: 'nptel-106101163' },
        { youtube: { title: 'Guided full-build practice', channel: 'freeCodeCamp', url: 'https://www.youtube.com/@freecodecamp' } },
        { project: 'Ship a full-stack capstone with tests and a README.' }
      ] },
      { title: 'Job-ready', goal: 'Package yourself for hiring pipelines.', steps: [
        { course: 'nptel-106105153' },
        { project: 'Contribute a merged pull request to an open-source repo.' },
        { project: 'Complete three mock technical interviews.' }
      ] }
    ],
    checklist: ['Portfolio with three shipped projects', 'Résumé tailored to software roles', 'Mock technical interviews completed', 'Applied to junior roles, internships or freelance gigs']
  },
  {
    id: 'graphic-designer',
    title: 'Graphic Designer',
    icon: 'palette',
    accent: '#db2777',
    role: 'Communicate visually',
    months: '4–8',
    summary: 'Visual foundations, digital media and brand craft, sequenced into a portfolio that wins clients and studio roles. Theory is paired with deliberate practice pieces.',
    skills: ['Composition & layout', 'Colour & typography', 'Raster & vector tools', 'Brand identity', 'Digital media production', 'Client briefing'],
    outcomes: ['Design clear, balanced layouts', 'Build a coherent brand identity', 'Produce print- and screen-ready assets', 'Present a six-piece portfolio'],
    stages: [
      { title: 'Visual foundations', goal: 'Train your eye before your tools.', steps: [
        { course: 'nptel-107106583' },
        { course: 'nptel-105105156' },
        { project: 'Redesign three everyday posters and explain each choice.' }
      ] },
      { title: 'Digital media', goal: 'Move from paper to pixels with control.', steps: [
        { course: 'nptel-124107002' },
        { course: 'nptel-106102065' },
        { youtube: { title: 'Photoshop & retouching practice', channel: 'PiXimperfect', url: 'https://www.youtube.com/@PiXimperfect' } }
      ] },
      { title: 'Interface & brand', goal: 'Design systems, not one-offs.', steps: [
        { course: 'nptel-124107008' },
        { course: 'nptel-110106124' },
        { project: 'Create a full brand identity kit for a local business.' }
      ] },
      { title: 'Portfolio', goal: 'Show work that gets you hired.', steps: [
        { course: 'nptel-109106001' },
        { project: 'Publish a six-piece portfolio with case notes.' },
        { project: 'Rehearse a client brief from kickoff to delivery.' }
      ] }
    ],
    checklist: ['Six-piece portfolio published', 'Brand identity case study', 'Client brief rehearsal done', 'Applied to studios or freelance marketplaces']
  },
  {
    id: 'cad-technician',
    title: 'AutoCAD / CAD Technician',
    icon: 'draft',
    accent: '#d97706',
    role: 'Draft and model precisely',
    months: '4–8',
    summary: 'Engineering drawing through computer-aided design and manufacturing, ending in a complete, professional drawing set. The track mirrors how drafting roles are actually assessed.',
    skills: ['Orthographic projection', 'AutoCAD drafting', '3D modelling', 'GD&T basics', 'Materials & manufacturing', 'Drawing sets & BOMs'],
    outcomes: ['Read and produce standard engineering drawings', 'Model parts and assemblies in CAD', 'Produce a complete drawing set', 'Pass a practical drafting test'],
    stages: [
      { title: 'Drafting fundamentals', goal: 'Speak the language of drawings.', steps: [
        { course: 'nptel-112104172' },
        { course: 'nptel-112105294' },
        { project: 'Hand-draft five orthographic parts with dimensions.' }
      ] },
      { title: 'CAD modelling', goal: 'Move from pencil to precise digital models.', steps: [
        { course: 'nptel-112102101' },
        { course: 'nptel-112104031' },
        { youtube: { title: 'AutoCAD command practice', channel: 'SourceCAD', url: 'https://www.youtube.com/@SourceCAD' } }
      ] },
      { title: 'Applied design', goal: 'Design for real materials and manufacturing.', steps: [
        { course: 'nptel-112104002' },
        { project: 'Model a ten-part assembly with fits and tolerances.' }
      ] },
      { title: 'Job-ready', goal: 'Deliver work a workshop can build from.', steps: [
        { project: 'Produce a full drawing set: plans, sections and BOM.' },
        { project: 'Assemble a freelance drafting sample portfolio.' }
      ] }
    ],
    checklist: ['Complete drawing set produced', 'Ten-part assembly modelled', 'Drafting sample portfolio', 'Applied to drafting / CAD roles']
  },
  {
    id: 'robotics-engineer',
    title: 'Robotics Engineer',
    icon: 'robot',
    accent: '#65a30d',
    role: 'Make machines move',
    months: '8–14',
    summary: 'Mechanics, control and embedded systems joined into working robots. Each stage ends in hardware you build and document, because robotics hiring is proof-of-build.',
    skills: ['Kinematics & dynamics', 'Control systems', 'Embedded C / ARM', 'Sensors & actuation', 'Microcontrollers', 'Robot perception basics'],
    outcomes: ['Model and control a robot’s motion', 'Program microcontrollers and interface sensors', 'Build and document a working robot', 'Present a robotics capstone'],
    stages: [
      { title: 'Foundations', goal: 'Understand how robots sense and move.', steps: [
        { course: 'nptel-107106090' },
        { course: 'nptel-108105102' },
        { project: 'Wire a sensor-and-actuator kit and log its readings.' }
      ] },
      { title: 'Control & embedded', goal: 'Close the loop between code and motion.', steps: [
        { course: 'nptel-108103863' },
        { course: 'nptel-106105159' },
        { youtube: { title: 'Hands-on Arduino & robotics labs', channel: 'Paul McWhorter', url: 'https://www.youtube.com/@paulmcwhorter' } }
      ] },
      { title: 'Sensing & actuation', goal: 'Give the robot perception and purpose.', steps: [
        { course: 'nptel-108105376' },
        { course: 'nptel-106107001' },
        { project: 'Build a line-following or obstacle-avoiding robot.' }
      ] },
      { title: 'Job-ready', goal: 'Document proof you can build.', steps: [
        { project: 'Write up a capstone with schematics, code and video.' },
        { project: 'Publish a robotics portfolio and demo reel.' }
      ] }
    ],
    checklist: ['Working robot built', 'Capstone documented with code & video', 'Portfolio / demo reel published', 'Applied to robotics or embedded roles']
  },
  {
    id: 'digital-marketer',
    title: 'Digital Marketer',
    icon: 'megaphone',
    accent: '#dc2626',
    role: 'Grow audiences & revenue',
    months: '4–8',
    summary: 'Marketing fundamentals through digital channels, analytics and brand, closed with a real campaign and a metrics-backed case study. Built for agency and in-house roles.',
    skills: ['Marketing strategy', 'Consumer behaviour', 'SEO & content', 'Paid & social campaigns', 'Marketing analytics', 'Brand & advertising'],
    outcomes: ['Plan a funnel for a real product', 'Run and measure a live campaign', 'Read analytics and report ROI', 'Pitch a brand strategy'],
    stages: [
      { title: 'Marketing core', goal: 'Understand markets and the people in them.', steps: [
        { course: 'nptel-110104068' },
        { course: 'nptel-110105054' },
        { project: 'Audit a local brand’s funnel and note three fixes.' }
      ] },
      { title: 'Digital channels', goal: 'Work the channels that drive growth.', steps: [
        { course: 'nptel-110105920' },
        { course: 'nptel-110106002' },
        { project: 'Run a small real campaign and record results.' }
      ] },
      { title: 'Analytics & brand', goal: 'Measure, then build lasting brands.', steps: [
        { course: 'nptel-110105142' },
        { course: 'nptel-110104167' },
        { course: 'nptel-110105625' }
      ] },
      { title: 'Job-ready', goal: 'Show impact, not just activity.', steps: [
        { project: 'Write a case-study report with real metrics.' },
        { project: 'Build a pitch deck for a prospective client.' }
      ] }
    ],
    checklist: ['Live campaign run & measured', 'Metrics-backed case study', 'Client pitch deck', 'Applied to agency / in-house roles']
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    icon: 'chart',
    accent: '#0d9488',
    role: 'Turn data into decisions',
    months: '6–10',
    summary: 'Programming, statistics and machine learning aimed at one job: answering real questions with data and communicating the answer clearly.',
    skills: ['Python & R', 'Exploratory analysis', 'Statistics', 'Machine learning basics', 'Dashboards & visualisation', 'Stakeholder communication'],
    outcomes: ['Clean and explore messy datasets', 'Choose and defend statistical methods', 'Build a dashboard from real data', 'Present findings to non-technical audiences'],
    stages: [
      { title: 'Foundations', goal: 'Get comfortable manipulating data.', steps: [
        { course: 'nptel-106106145' },
        { course: 'nptel-106104846' },
        { project: 'Clean a public dataset and document every step.' }
      ] },
      { title: 'Statistics & ML', goal: 'Reason rigorously about patterns.', steps: [
        { course: 'nptel-105105001' },
        { course: 'nptel-106105152' },
        { project: 'Write an exploratory analysis report with charts.' }
      ] },
      { title: 'Scale & communicate', goal: 'Handle bigger data and tell its story.', steps: [
        { course: 'nptel-106106179' },
        { course: 'nptel-106105186' },
        { project: 'Build a dashboard from a real, live dataset.' }
      ] },
      { title: 'Job-ready', goal: 'Prove you can deliver insight.', steps: [
        { project: 'Publish a three-analysis portfolio.' },
        { project: 'Present findings to a non-technical audience.' }
      ] }
    ],
    checklist: ['Three-analysis portfolio', 'Live-data dashboard', 'Non-technical presentation done', 'Applied to analyst roles']
  },
  {
    id: 'web-developer',
    title: 'Web Developer',
    icon: 'globe',
    accent: '#7c3aed',
    role: 'Build for the browser',
    months: '5–9',
    summary: 'How the web works, then front- and back-end craft, ending in deployed full-stack work. A practical route into junior web and frontend roles.',
    skills: ['HTML / CSS / JS', 'How the internet works', 'APIs & databases', 'UI design', 'Deployment', 'Version control'],
    outcomes: ['Hand-code responsive, accessible pages', 'Build and consume CRUD APIs', 'Ship and deploy a full-stack app', 'Maintain a live portfolio site'],
    stages: [
      { title: 'Web foundations', goal: 'Understand the platform you build on.', steps: [
        { course: 'nptel-106105084' },
        { course: 'nptel-106104074' },
        { project: 'Hand-code a responsive, accessible landing page.' }
      ] },
      { title: 'Backend & data', goal: 'Store, serve and secure information.', steps: [
        { course: 'nptel-106104135' },
        { course: 'nptel-106105183' },
        { project: 'Build a CRUD API with a real database.' }
      ] },
      { title: 'Frontend craft', goal: 'Make it feel as good as it works.', steps: [
        { course: 'nptel-124107008' },
        { course: 'nptel-106105182' },
        { youtube: { title: 'Modern web project practice', channel: 'freeCodeCamp', url: 'https://www.youtube.com/@freecodecamp' } },
        { project: 'Ship a full-stack app with auth and tests.' }
      ] },
      { title: 'Job-ready', goal: 'Be discoverable and credible.', steps: [
        { project: 'Deploy a personal portfolio site.' },
        { project: 'Land a merged open-source contribution.' }
      ] }
    ],
    checklist: ['Portfolio site deployed', 'Full-stack app shipped', 'Open-source contribution merged', 'Applied to junior web roles']
  },
  {
    id: 'ux-designer',
    title: 'UX / UI Designer',
    icon: 'pen',
    accent: '#e11d48',
    role: 'Design products people use',
    months: '5–9',
    summary: 'Design thinking and human-computer interaction turned into tested interfaces and case studies. The track emphasises process, because UX hiring buys process.',
    skills: ['User research', 'Design thinking', 'Wireframing & prototyping', 'Usability testing', 'UI design', 'Case-study storytelling'],
    outcomes: ['Run interviews and synthesise insights', 'Wireframe and prototype real flows', 'Usability-test and iterate a design', 'Present three process-driven case studies'],
    stages: [
      { title: 'Design thinking', goal: 'Start from people, not pixels.', steps: [
        { course: 'nptel-110106124' },
        { course: 'nptel-109104109' },
        { project: 'Run five user interviews and synthesise themes.' }
      ] },
      { title: 'Human-computer interaction', goal: 'Ground designs in how people actually behave.', steps: [
        { course: 'nptel-106103237' },
        { course: 'nptel-106103220' },
        { project: 'Wireframe a real end-to-end user flow.' }
      ] },
      { title: 'UI & testing', goal: 'Polish, then prove it works.', steps: [
        { course: 'nptel-124107008' },
        { course: 'nptel-107107580' },
        { project: 'Usability-test a prototype with five users and iterate.' }
      ] },
      { title: 'Portfolio', goal: 'Tell the story of your process.', steps: [
        { project: 'Write three case studies showing research to result.' },
        { project: 'Publish a portfolio site and get a critique.' }
      ] }
    ],
    checklist: ['Three process case studies', 'Usability test run & iterated', 'Portfolio site published', 'Applied to UX / product design roles']
  }
];

export const careerById = id => careers.find(career => career.id === id);
export const stepKey = (stage, step) => stage + '.' + step;
export const careerStepCount = career => career.stages.reduce((total, stage) => total + stage.steps.length, 0);
export const careerCourseCount = career => career.stages.reduce((total, stage) => total + stage.steps.filter(step => step.course).length, 0);