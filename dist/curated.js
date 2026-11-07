const yale = 'https://oyc.yale.edu';
const cs = 'https://cs50.harvard.edu/python';
const lt = 'https://www.languagetransfer.org';
const ou = 'https://www.open.edu/openlearn';
const lesson = (title, source, practice, video, takeaways) => ({ title, source, practice, video, takeaways });
const course = (id, title, provider, subject, format, source, summary, extras = {}) => ({
  id, title, provider, subject, format, source, summary, access: 'source', review: 'curated', ...extras
});

export const curated = [
  course('yale-psychology', 'Introduction to Psychology', 'Yale University', 'Psychology', 'Video', yale + '/introduction-psychology/psyc-110', 'Explore how psychologists study the mind, the brain, and human behavior.', {
    level: 'Beginner', language: 'English', art: 'mind', captions: true, access: 'guided', prerequisites: 'No formal psychology background is needed for this guide.',
    outcome: 'Describe different approaches to studying behavior and explain how a scientific theory can be evaluated.',
    lessons: [
      lesson('A map of the mind', yale + '/psychology/psyc-110/lecture-1', 'Pick a behavior you observed today. Write one question about it that a developmental psychologist could investigate and one that a social psychologist might ask.', 'P3FKHH2RzjI', 'Different branches of psychology ask different questions about the same behavior. Try to identify a concrete observation behind each question.'),
      lesson('Foundations: This is your brain', yale + '/psychology/psyc-110/lecture-2', 'Explain to a friend why looking at the brain can help explain behavior. Give an example of what a brain-level account might leave open.', 'vg01Q1BI4WM'),
      lesson('Freud and the unconscious', yale + '/psychology/psyc-110/lecture-3', 'Choose a claim from the lecture. Describe a result that would count against it. If you cannot think of one, explain what makes the claim difficult to test.', '7emS3ye3cVU')
    ]
  }),
  course('soil-and-crops', 'Organic Farming for Sustainable Agricultural Production', 'IIT Kharagpur · NPTEL', 'Agriculture', 'Video', 'https://onlinecourses.nptel.ac.in/noc20_ag05/preview', 'Learn the principles behind organic production and use guided field observations to connect them to your own soil and crops.', {
    level: 'Beginner', art: 'land', access: 'guided', outcome: 'Make a simple observation plan for soil and connect it to organic production practices.',
    prerequisites: 'Bring a notebook. Access to two patches of soil helps with the field activity.',
    lessons: [
      lesson('Start with the principles', 'https://onlinecourses.nptel.ac.in/noc20_ag05/preview', 'List three ways a farming practice might improve one outcome while making another harder to achieve. Think about labor, soil health, cost, or crop yield.', null, 'Begin with the official course outline. For each practice, ask what problem it addresses and in what conditions it might work.'),
      lesson('Observe soil and water', 'https://www.accessagriculture.org/video-series', 'Choose two small soil patches. Apply the same amount of water to each and note the time it takes to disappear from the surface. Record differences in cover and texture before drawing a conclusion.'),
      lesson('Make a compost plan', 'https://www.accessagriculture.org/compost-rice-straw', 'Identify one locally available plant material and one way to observe whether a compost pile is changing over time. Write down which details you would verify with a local extension service.')
    ]
  }),
  course('language-spanish', 'Complete Spanish', 'Language Transfer', 'Languages', 'Audio', lt + '/courses', 'Work through spoken examples and practice building phrases aloud, with time to think before hearing the response.', {
    level: 'Beginner', language: 'English', targetLanguage: 'Spanish', art: 'language', access: 'guided',
    outcome: 'Build and say simple Spanish phrases from patterns you can explain.',
    prerequisites: 'Find a quiet place where you can answer out loud.',
    lessons: [
      lesson('Listen, pause, and respond', lt + '/courses', 'Open the first Complete Spanish track. Pause before the learner answers and say your version out loud. Record one pattern that helped you answer.'),
      lesson('Build a phrase from a pattern', lt + '/courses', 'Continue with the next two tracks. Try the same pattern with a new example. Say it aloud and note where you hesitated.'),
      lesson('Recall without the recording', lt + '/courses', 'Before the next track, recall three phrases without looking at your notes. Compare what you remember with your earlier examples.')
    ]
  }),
  course('harvard-python', 'CS50’s Introduction to Programming with Python', 'Harvard University', 'Computing', 'Video', cs + '/', 'Learn to write, test, and debug Python through lectures and practical problem sets.', {
    level: 'Beginner', language: 'English', art: 'code', access: 'guided',
    outcome: 'Write a small program that takes input, makes a decision, and repeats work.',
    prerequisites: 'No prior programming experience is required. Use the course’s setup instructions for the exercises.',
    lessons: [
      lesson('Functions and variables', cs + '/weeks/0/', 'Write a program that asks for your name, removes leading and trailing spaces, and prints a greeting.', 'JP7ITIXGpHk'),
      lesson('Conditionals', cs + '/weeks/1/', 'Extend your program to print a different message when the input is empty.', '_b6NgY_pMdw'),
      lesson('Loops', cs + '/weeks/2/', 'Ask for three names in a loop. Test your program with normal input and at least one blank entry.', '-7xg8pGcP6w')
    ]
  }),
  course('language-swahili', 'Introduction to Swahili', 'Language Transfer', 'Languages', 'Audio', lt + '/courses#swahili', 'Try the provider’s introductory audio sequence. Pause, think, and say each response out loud.', { level: 'Beginner', language: 'English', targetLanguage: 'Swahili', art: 'language' }),
  course('openlearn-french', 'Getting started with French 1', 'OpenLearn · The Open University', 'Languages', 'Mixed', ou + '/languages/getting-started-french-1/content-section-overview', 'Practice greetings, introductions, and basic French pronunciation.', { level: 'Beginner', language: 'English', targetLanguage: 'French', duration: 6, art: 'language' }),
  course('yale-philosophy', 'Death', 'Yale University', 'Humanities', 'Video', yale + '/death/phil-176', 'Examine philosophical arguments about identity, mortality, and how we should live.', { art: 'mind', language: 'English', captions: true }),
  course('yale-music', 'Listening to Music', 'Yale University', 'Design & arts', 'Video', yale + '/music/musi-112/lecture-1', 'Build a vocabulary for listening closely to musical structure, rhythm, and melody.', { level: 'Beginner', language: 'English' }),
  course('yale-economics', 'Financial Markets', 'Yale University', 'Business', 'Video', yale + '/economics/econ-252', 'Explore how financial institutions work and how they respond to risk.', { language: 'English' }),
  course('yale-politics', 'Introduction to Political Philosophy', 'Yale University', 'Society & law', 'Video', yale + '/political-science/plsc-114', 'Compare influential ideas about justice, citizenship, and political authority.', { level: 'Beginner', language: 'English' }),
  course('yale-history', 'The Civil War and Reconstruction Era, 1845–1877', 'Yale University', 'History', 'Video', yale + '/history/hist-119', 'Study the causes, experiences, and aftermath of the United States Civil War.', { language: 'English' }),
  course('yale-health', 'Epidemics in Western Society Since 1600', 'Yale University', 'Health', 'Video', yale + '/history/hist-234', 'Trace how epidemics have shaped institutions, public health, and social life.', { language: 'English' }),
  course('mit-linear-algebra', 'Linear Algebra', 'MIT OpenCourseWare', 'Mathematics', 'Mixed', 'https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/', 'Study matrices, vector spaces, and eigenvalues with lectures and problem-solving sessions.', { language: 'English' }),
  course('mit-classical-mechanics', 'Classical Mechanics', 'MIT OpenCourseWare', 'Science', 'Mixed', 'https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/', 'Work through the mechanics of motion, energy, and momentum.', { language: 'English' }),
  course('mit-circuits', 'Circuits and Electronics', 'MIT OpenCourseWare', 'Engineering', 'Mixed', 'https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/', 'Learn circuit analysis and practice applying it to electronic systems.', { language: 'English' }),
  course('openlearn-ecosystems', 'Introduction to Ecosystems', 'OpenLearn · The Open University', 'Environment', 'Mixed', ou + '/science-maths-technology/introduction-ecosystems', 'Explore relationships among organisms and their environments.', { level: 'Beginner', language: 'English' }),
  course('delft-water', 'Integrated Water Management', 'TU Delft OpenCourseWare', 'Environment', 'Mixed', 'https://ocw.tudelft.nl/courses/integrated-water-management/', 'Study water resources and compare management choices across case studies.', { level: 'Advanced', language: 'English' }),
  course('delft-urban', 'Urban Drainage and Watermanagement', 'TU Delft OpenCourseWare', 'Design & arts', 'Mixed', 'https://ocw.tudelft.nl/courses/urban-drainage-and-watermanagement/', 'Connect urban planning decisions with water infrastructure and sustainable design.', { level: 'Advanced', language: 'English', duration: 112 }),
  course('fao-soils', 'Climate-smart soil and land management', 'FAO elearning Academy', 'Agriculture', 'Mixed', 'https://elearning.fao.org/course/view.php?id=435', 'Explore how soil and land management can support agriculture under changing climate conditions.', { art:'land', language:'English' }),
  course('openlearn-learning', 'Succeed with learning', 'OpenLearn · The Open University', 'Study skills', 'Mixed', ou + '/education-development/succeed-learning/', 'Reflect on what helps you learn and build a practical approach to independent study.', { level:'Beginner', language:'English' })
];

export const paths = [
  { id:'mind', icon:'brain', title:'Understand the mind', description:'Start with behavior, then explore the questions we ask about ourselves.', items:['yale-psychology','yale-philosophy'], project:'Pick one behavior and write two competing explanations. Describe what evidence would help you choose between them.' },
  { id:'soil', icon:'sprout', title:'Grow from the ground up', description:'Connect soil observations, ecosystems, and water management.', items:['soil-and-crops','openlearn-ecosystems','fao-soils','delft-water'], project:'Keep a field notebook for two weeks. Compare two sites, note what changed, and explain what you would measure next.' },
  { id:'language', icon:'language', title:'Start speaking a language', description:'Choose Spanish, Swahili, or French and build a daily speaking routine.', items:['language-spanish','language-swahili','openlearn-french'], choose:true, project:'Record a short self-introduction in your chosen language and try it again one week later without reading.' },
  { id:'computing', icon:'code', title:'Think like a programmer', description:'Write your first programs and build a foundation for technical study.', items:['harvard-python','mit-linear-algebra'], project:'Write a program that takes a small list of numbers and prints a summary.' },
  { id:'civic', icon:'book', title:'How societies work', description:'Read political ideas alongside economic and historical examples.', items:['yale-politics','yale-economics','yale-history'], project:'Explain one policy choice from multiple perspectives and identify the trade-offs.' },
  { id:'science', icon:'spark', title:'Make sense of motion', description:'Use mathematics and experiments to explain physical systems.', items:['mit-linear-algebra','mit-classical-mechanics','mit-circuits'], project:'Pick a physical system and make a prediction you can test with a simple experiment.' }
];

export const lectures = [{
  id:'time-and-mortality', title:'How should we live knowing life ends?', provider:'Yale University · Shelly Kagan',
  subject:'Humanities', art:'mind', format:'Video', access:'guided', review:'curated', lecture:true,
  summary:'Consider whether knowing our time is limited changes what deserves our attention.',
  source:yale + '/philosophy/phil-176/lecture-23', parent:'yale-philosophy',
  lessons:[lesson('How to live given the certainty of death', yale + '/philosophy/phil-176/lecture-23', 'Write down one priority you would keep and one you would reconsider if you took the argument seriously. Which premise matters most to your answer?', 'O8Hu465KL1w')]
}];
