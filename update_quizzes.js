const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'StudentDashboard.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

const additionalQuestions = {
  math: `,
      {
        q: 'Solve the simultaneous equations: 2x + y = 7 and x - y = 2',
        options: ['x=3, y=1', 'x=4, y=2', 'x=2, y=3', 'x=3, y=2'],
        correct: 0,
        explanation: 'Add the equations: (2x+y) + (x-y) = 7 + 2 => 3x = 9 => x=3. Substitute x=3 into x-y=2 => 3-y=2 => y=1.'
      },
      {
        q: 'What is the derivative of f(x) = 3x² + 5x - 2?',
        options: ['6x + 5', '3x + 5', '6x² + 5', '6x - 2'],
        correct: 0,
        explanation: 'Using the power rule: d/dx(3x²) = 6x, and d/dx(5x) = 5. The constant -2 becomes 0.'
      }
    ]
  },`,
  physics: `,
      {
        q: 'Calculate the kinetic energy of a 2kg mass moving at 3m/s.',
        options: ['3 J', '6 J', '9 J', '18 J'],
        correct: 2,
        explanation: 'KE = 1/2 * m * v². KE = 0.5 * 2 * (3²) = 1 * 9 = 9 Joules.'
      },
      {
        q: 'According to Newton\\'s second law, what is the force required to accelerate a 5kg mass at 2m/s²?',
        options: ['2.5 N', '5 N', '7 N', '10 N'],
        correct: 3,
        explanation: 'F = m * a. Therefore, F = 5kg * 2m/s² = 10 Newtons.'
      }
    ]
  },`,
  english: `,
      {
        q: 'Change into passive voice: "The chef cooked a delicious meal."',
        options: [
          'A delicious meal was cooked by the chef.',
          'A delicious meal is cooked by the chef.',
          'The chef was cooking a delicious meal.',
          'A delicious meal has been cooked by the chef.'
        ],
        correct: 0,
        explanation: 'In simple past tense, the passive voice is formed using "was/were + past participle".'
      },
      {
        q: 'Which conditional sentence is correct?',
        options: [
          'If it will rain, I will stay home.',
          'If it rains, I would stay home.',
          'If it rained, I will stay home.',
          'If it rains, I will stay home.'
        ],
        correct: 3,
        explanation: 'The First Conditional uses "If + Present Simple, will + base verb".'
      }
    ]
  },`,
  biology: `,
      {
        q: 'What is the function of amylase in the human digestive system?',
        options: ['To break down proteins', 'To break down fats', 'To break down starch', 'To absorb water'],
        correct: 2,
        explanation: 'Amylase is an enzyme found in saliva and the pancreas that catalyzes the breakdown of starch into sugars.'
      },
      {
        q: 'In genetics, what term describes having two identical alleles for a particular gene?',
        options: ['Heterozygous', 'Homozygous', 'Dominant', 'Recessive'],
        correct: 1,
        explanation: 'Homozygous means an organism has two identical copies (alleles) of a specific gene.'
      }
    ]
  },`,
  chemistry: `,
      {
        q: 'What type of bonding involves the sharing of electron pairs between atoms?',
        options: ['Ionic bonding', 'Covalent bonding', 'Metallic bonding', 'Hydrogen bonding'],
        correct: 1,
        explanation: 'Covalent bonding occurs when non-metal atoms share electrons to achieve a full outer shell.'
      },
      {
        q: 'How many moles are in 36 grams of water (H₂O)? (Molar mass of H₂O ≈ 18 g/mol)',
        options: ['1 mole', '2 moles', '3 moles', '0.5 moles'],
        correct: 1,
        explanation: 'Moles = Mass / Molar Mass. 36g / 18g/mol = 2 moles of water.'
      }
    ]
  },`,
  ict: `,
      {
        q: 'What is phishing?',
        options: [
          'A type of computer virus',
          'Upgrading network hardware',
          'Deceiving individuals to reveal personal information',
          'Encrypting a hard drive'
        ],
        correct: 2,
        explanation: 'Phishing is a social engineering attack used to steal user data, including login credentials and credit card numbers.'
      },
      {
        q: 'What type of software is an operating system (OS)?',
        options: ['Application software', 'System software', 'Utility software', 'Malware'],
        correct: 1,
        explanation: 'System software acts as an interface between the hardware and user applications (e.g., Windows, macOS).'
      }
    ]
  },`,
  gp: `,
      {
        q: 'What is a "Value Judgment"?',
        options: [
          'A verified scientific fact',
          'An assessment of something as good or bad in terms of one\\'s standards',
          'A legal ruling by a judge',
          'A statistical estimation'
        ],
        correct: 1,
        explanation: 'A value judgment is an opinion based on a person\\'s values and beliefs regarding what is right or wrong.'
      },
      {
        q: 'What is the main purpose of corroborating sources?',
        options: [
          'To make the essay longer',
          'To plagiarize information safely',
          'To verify information by finding the same facts in multiple independent sources',
          'To summarize the conclusion'
        ],
        correct: 2,
        explanation: 'Corroboration strengthens an argument by showing that multiple reliable sources agree on the same facts.'
      }
    ]
  },`,
  mandarin: `,
      {
        q: 'Translate: "I am a student."',
        options: ['我是老师 (Wǒ shì lǎoshī)', '我是学生 (Wǒ shì xuésheng)', '我爱学校 (Wǒ ài xuéxiào)', '我有书 (Wǒ yǒu shū)'],
        correct: 1,
        explanation: '我 (I) 是 (am) 学生 (student). 老师 is teacher, 学校 is school.'
      },
      {
        q: 'What tone is the character "好" (hǎo) in "你好" (nǐ hǎo)?',
        options: ['First Tone', 'Second Tone', 'Third Tone', 'Fourth Tone'],
        correct: 2,
        explanation: 'The pinyin is "hǎo", which uses the third (dipping) tone. Note: In speech, two consecutive third tones cause the first one to change to a second tone (tone sandhi).'
      }
    ]
  }`
};

// Simple replacement for the closing tag of each subject's array
Object.keys(additionalQuestions).forEach(subject => {
  const targetRegex = new RegExp(\`    \\]\\n  \\},\\n  \${subject === 'math' ? 'physics' : subject === 'physics' ? 'english' : subject === 'english' ? 'biology' : subject === 'biology' ? 'chemistry' : subject === 'chemistry' ? 'ict' : subject === 'ict' ? 'gp' : subject === 'gp' ? 'mandarin' : 'ERROR'}\`, 'g');
  
  if (subject === 'mandarin') {
    content = content.replace(/    \]\n  \}\n\};\n/g, additionalQuestions[subject] + '\\n};\\n');
  } else {
    // Find the next subject key to anchor our replacement correctly
    const nextSubjectKeys = {
      math: 'physics',
      physics: 'english',
      english: 'biology',
      biology: 'chemistry',
      chemistry: 'ict',
      ict: 'gp',
      gp: 'mandarin'
    };
    const nextSubj = nextSubjectKeys[subject];
    content = content.replace(
      new RegExp(\`    \\]\\n  \\},\\n  \${nextSubj}: \\{\`, 'g'),
      additionalQuestions[subject] + \`,\\n  \${nextSubj}: {\`
    );
  }
});

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Quizzes updated successfully!');
