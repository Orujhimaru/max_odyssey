export interface MathTopics {
  [key: string]: string[]
}

export interface VerbalTopics {
  [key: string]: string[]
}

export const mathTopics: MathTopics = {
  Algebra: [
    'Linear Equations (1)',
    'Linear Functions',
    'Linear Equations (2)',
    'Systems of 2 in 2',
    'Linear Inequalities',
  ],
  'Advanced Math': [
    'Equivalent Expressions',
    'Nonlinear Equations',
    'Nonlinear Functions',
  ],
  'Problem-Solving and Data Analysis': [
    'Ratios & Rates',
    'Percentages',
    'Measures of Spread',
    'Models and Scatterplots',
    'Probability',
    'Sample Statistics',
    'Studies and Experiments',
  ],
  'Geometry and Trigonometry': [
    'Area & Volume',
    'Angles & Triangles',
    'Trigonometry',
    'Circles',
  ],
}

export const verbalTopics: VerbalTopics = {
  'Craft and Structure': [
    'Words in Context',
    'Text Structure and Purpose',
    'Cross-Text Connections',
  ],
  'Information and Ideas': [
    'Central Ideas and Details',
    'Command of Evidence',
    'Inferences',
  ],
  'Standard English Conventions': ['Boundaries', 'Form, Structure, and Sense'],
  'Expression of Ideas': ['Rhetorical Synthesis', 'Transitions'],
}





