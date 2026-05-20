const fs = require('fs');
const path = require('path');

const generateMath = () => {
  const q = [];
  for(let i=0; i<30; i++) {
    const a = Math.floor(Math.random() * 5) + 2;
    const b = Math.floor(Math.random() * 10) + 1;
    const c = Math.floor(Math.random() * 20) + 5;
    
    if (i < 10) {
      q.push({
        q: "Find the derivative of f(x) = " + a + "x³ - " + b + "x² + " + c + "x.",
        options: [
          (a*3) + "x² - " + (b*2) + "x + " + c,
          (a*3) + "x² - " + b + "x + " + c,
          (a*2) + "x² - " + (b*2) + "x + " + c,
          (a*3) + "x² + " + (b*2) + "x - " + c
        ],
        correct: 0,
        explanation: "Use the power rule: multiply by the exponent and decrease the exponent by 1."
      });
    } else if (i < 20) {
      q.push({
        q: "Solve the quadratic equation: x² - " + (a+b) + "x + " + (a*b) + " = 0",
        options: [
          "x = " + a + ", x = " + b,
          "x = -" + a + ", x = " + b,
          "x = " + a + ", x = -" + b,
          "x = -" + a + ", x = -" + b
        ],
        correct: 0,
        explanation: "Factorizes to (x - " + a + ")(x - " + b + ") = 0."
      });
    } else {
      q.push({
        q: "If a right-angled triangle has sides of length " + a + "x and " + b + "x, what is the length of the hypotenuse in terms of x?",
        options: [
          "x√(" + (a*a + b*b) + ")",
          "x(" + (a+b) + ")",
          "x²(" + (a*a + b*b) + ")",
          "x√(" + (a*a - b*b) + ")"
        ],
        correct: 0,
        explanation: "By Pythagoras theorem, h² = a² + b²."
      });
    }
  }
  return q;
};

const generatePhysics = () => {
  const q = [];
  for(let i=0; i<30; i++) {
    const mass = Math.floor(Math.random() * 10) + 5;
    const vel = Math.floor(Math.random() * 20) + 10;
    const force = Math.floor(Math.random() * 50) + 10;
    
    if (i < 10) {
      q.push({
        q: "Calculate the kinetic energy of a " + mass + "kg object moving at " + vel + "m/s.",
        options: [(0.5 * mass * vel * vel) + " J", (mass * vel * vel) + " J", (0.5 * mass * vel) + " J", (mass * vel) + " J"],
        correct: 0,
        explanation: "KE = 1/2 * m * v²"
      });
    } else if (i < 20) {
      q.push({
        q: "What is the acceleration of a " + mass + "kg object under a net force of " + force + "N?",
        options: [(force/mass).toFixed(2) + " m/s²", (force*mass).toFixed(2) + " m/s²", (mass/force).toFixed(2) + " m/s²", (force/mass + 9.8).toFixed(2) + " m/s²"],
        correct: 0,
        explanation: "Using Newton's Second Law: a = F/m"
      });
    } else {
      q.push({
        q: "Calculate the momentum of a " + mass + "kg cart moving at " + vel + "m/s.",
        options: [(mass * vel) + " kg·m/s", (mass * vel * 2) + " kg·m/s", (mass / vel).toFixed(2) + " kg·m/s", (0.5 * mass * vel) + " kg·m/s"],
        correct: 0,
        explanation: "Momentum p = m * v."
      });
    }
  }
  return q;
};

const generateChemistry = () => {
  const q = [];
  const elements = ['Carbon', 'Oxygen', 'Nitrogen', 'Sodium', 'Chlorine'];
  const masses = [12, 16, 14, 23, 35.5];
  for(let i=0; i<30; i++) {
    const el = Math.floor(Math.random() * elements.length);
    const mass = masses[el];
    const grams = Math.floor(Math.random() * 100) + 10;
    if (i < 10) {
      q.push({
        q: "How many moles are in " + grams + "g of " + elements[el] + " (Molar mass ≈ " + mass + "g/mol)?",
        options: [(grams/mass).toFixed(2) + " mol", (grams*mass).toFixed(2) + " mol", (mass/grams).toFixed(2) + " mol", (grams/(mass*2)).toFixed(2) + " mol"],
        correct: 0,
        explanation: "Moles = Mass (g) / Molar Mass (g/mol)."
      });
    } else if (i < 20) {
      q.push({
        q: "What is the mass of " + (grams/10).toFixed(1) + " moles of " + elements[el] + "?",
        options: [((grams/10)*mass).toFixed(1) + " g", ((grams/10)/mass).toFixed(1) + " g", (mass/(grams/10)).toFixed(1) + " g", ((grams/10)*mass*2).toFixed(1) + " g"],
        correct: 0,
        explanation: "Mass = Moles * Molar Mass."
      });
    } else {
      q.push({
        q: "Identify the group in the periodic table for " + elements[el] + ".",
        options: [
          elements[el] === 'Sodium' ? 'Alkali Metals' : elements[el] === 'Chlorine' ? 'Halogens' : 'Non-metals',
          'Transition Metals',
          'Noble Gases',
          'Alkaline Earth Metals'
        ],
        correct: 0,
        explanation: "Classified based on periodic table trends and valence electrons."
      });
    }
  }
  return q;
};

const generateBiology = () => {
  const bank = [
    {q: "Describe the function of the mitochondria.", options: ["ATP Production", "Protein Synthesis", "DNA Storage", "Lipid Synthesis"], correct: 0, explanation: "Powerhouse of the cell."},
    {q: "Which blood vessel carries oxygenated blood from the lungs?", options: ["Pulmonary Vein", "Pulmonary Artery", "Aorta", "Vena Cava"], correct: 0, explanation: "Veins to the heart, pulmonary vein carries oxygenated blood."},
    {q: "What is the end product of mitosis?", options: ["2 diploid identical cells", "4 haploid unique cells", "2 haploid cells", "4 diploid cells"], correct: 0, explanation: "Mitosis creates clones for growth/repair."},
    {q: "Enzymes are made primarily of which macromolecule?", options: ["Proteins", "Lipids", "Carbohydrates", "Nucleic Acids"], correct: 0, explanation: "Enzymes are biological protein catalysts."},
    {q: "What process converts glucose to pyruvate?", options: ["Glycolysis", "Krebs Cycle", "Electron Transport", "Fermentation"], correct: 0, explanation: "First step of cellular respiration occurs in cytoplasm."}
  ];
  let res = [];
  for(let i=0; i<30; i++) {
    let base = bank[i % bank.length];
    res.push({ ...base, q: "(Variant " + (i+1) + ") " + base.q });
  }
  return res;
};

const generateEnglish = () => {
  const bank = [
    {q: "Identify the literary device: 'The wind whispered through the trees.'", options: ["Personification", "Simile", "Metaphor", "Hyperbole"], correct: 0, explanation: "Giving human qualities to non-human things."},
    {q: "What is the effect of using passive voice in a report?", options: ["Objectivity and detachment", "Emotional engagement", "Directly blaming someone", "Creating suspense"], correct: 0, explanation: "Passive voice removes the subject to focus on the action, creating an objective tone."},
    {q: "Choose the correct spelling:", options: ["Accommodation", "Accomodation", "Acommodation", "Acomodation"], correct: 0, explanation: "Two 'c's and two 'm's."},
    {q: "Which sentence uses a semicolon correctly?", options: ["I like dogs; they are loyal.", "I like dogs; because they are loyal.", "Dogs are loyal; but cats are independent.", "My favorite animals are; dogs, cats, and birds."], correct: 0, explanation: "Semicolons link two closely related independent clauses."},
    {q: "What does 'to read between the lines' mean?", options: ["To infer a hidden meaning", "To read very carefully", "To skip every other line", "To read aloud"], correct: 0, explanation: "An idiom meaning to look for implied meaning."}
  ];
  let res = [];
  for(let i=0; i<30; i++) {
    let base = bank[i % bank.length];
    res.push({ ...base, q: "(Variant " + (i+1) + ") " + base.q });
  }
  return res;
};

const generateICT = () => {
  const bank = [
    {q: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language"], correct: 0, explanation: "Standard markup language for documents designed to be displayed in a web browser."},
    {q: "Which protocol is used for secure communication over a computer network?", options: ["HTTPS", "HTTP", "FTP", "SMTP"], correct: 0, explanation: "HTTPS encrypts the session with a digital certificate."},
    {q: "What is a characteristic of RAM?", options: ["Volatile memory", "Non-volatile memory", "Read-only", "Permanent storage"], correct: 0, explanation: "RAM loses its data when power is turned off."},
    {q: "In databases, what is a Primary Key?", options: ["A unique identifier for a record", "The first field in a table", "A password to access the database", "A linked field from another table"], correct: 0, explanation: "Uniquely identifies each record in a table."},
    {q: "What is phishing?", options: ["Social engineering to steal data", "A type of firewall", "A network topology", "A hardware component"], correct: 0, explanation: "Fraudulent practice of sending emails purporting to be from reputable companies."}
  ];
  let res = [];
  for(let i=0; i<30; i++) {
    let base = bank[i % bank.length];
    res.push({ ...base, q: "(Variant " + (i+1) + ") " + base.q });
  }
  return res;
};

const generateGP = () => {
  const bank = [
    {q: "What is a 'Primary Source'?", options: ["First-hand account", "Textbook", "Review article", "Encyclopedia"], correct: 0, explanation: "Original materials that have not been altered or distorted."},
    {q: "What does 'Bias' mean in research?", options: ["Prejudice in favor or against one thing", "Accurate data", "A type of graph", "A research method"], correct: 0, explanation: "A disproportionate weight in favor of or against an idea or thing."},
    {q: "Which is a global consequence of deforestation?", options: ["Loss of biodiversity", "Increased local employment", "Urbanization", "Reduced carbon dioxide"], correct: 0, explanation: "Destroys habitats, leading to species extinction."},
    {q: "What is a 'Value Judgement'?", options: ["An opinion based on personal beliefs", "A verified fact", "A statistical measure", "A legal decision"], correct: 0, explanation: "An assessment of something as good or bad in terms of one's standards or priorities."},
    {q: "Define 'Sustainable Development'.", options: ["Meeting present needs without compromising future generations", "Rapid economic growth", "Using all resources quickly", "Building more cities"], correct: 0, explanation: "Development that balances economic, social, and environmental needs."}
  ];
  let res = [];
  for(let i=0; i<30; i++) {
    let base = bank[i % bank.length];
    res.push({ ...base, q: "(Variant " + (i+1) + ") " + base.q });
  }
  return res;
};

const generateMandarin = () => {
  const bank = [
    {q: "Translate: 'I am going to the library to read books.'", options: ["我去图书馆看书", "我在家看书", "他去学校看书", "我们去买书"], correct: 0, explanation: "我 (I) 去 (go) 图书馆 (library) 看书 (read books)."},
    {q: "What is the pinyin for '谢谢'?", options: ["xiè xie", "zài jiàn", "nǐ hǎo", "bù kè qì"], correct: 0, explanation: "谢谢 means 'thank you'."},
    {q: "Which measure word is used for flat objects like tables or paper?", options: ["张 (zhāng)", "个 (gè)", "本 (běn)", "把 (bǎ)"], correct: 0, explanation: "张 is used for flat things (e.g., 一张桌子)."},
    {q: "What does the particle '了' (le) indicate?", options: ["Completed action/Change of state", "Future tense", "Question", "Possession"], correct: 0, explanation: "Used to indicate that an action has been completed."},
    {q: "Identify the tone of '妈' (mā) in '妈妈'.", options: ["First tone", "Second tone", "Third tone", "Fourth tone"], correct: 0, explanation: "Flat, high-pitched tone."}
  ];
  let res = [];
  for(let i=0; i<30; i++) {
    let base = bank[i % bank.length];
    res.push({ ...base, q: "(Variant " + (i+1) + ") " + base.q });
  }
  return res;
};

const quizzesData = {
  math: { subjectName: 'Mathematics', badge: 'Math Whiz', color: 'from-purple-500 to-indigo-500', questions: generateMath() },
  physics: { subjectName: 'Physics', badge: 'Physics Master', color: 'from-blue-500 to-cyan-500', questions: generatePhysics() },
  english: { subjectName: 'English (ESL)', badge: 'English Scholar', color: 'from-green-500 to-emerald-500', questions: generateEnglish() },
  biology: { subjectName: 'Biology', badge: 'Bio Explorer', color: 'from-emerald-500 to-teal-500', questions: generateBiology() },
  chemistry: { subjectName: 'Chemistry', badge: 'Chem Alchemist', color: 'from-red-500 to-rose-500', questions: generateChemistry() },
  ict: { subjectName: 'ICT', badge: 'Tech Innovator', color: 'from-cyan-500 to-blue-500', questions: generateICT() },
  gp: { subjectName: 'Global Perspectives', badge: 'Global Citizen', color: 'from-amber-500 to-orange-500', questions: generateGP() },
  mandarin: { subjectName: 'Mandarin Chinese', badge: 'Tonal Linguist', color: 'from-rose-500 to-pink-500', questions: generateMandarin() }
};

const output = "export const QUIZZES = " + JSON.stringify(quizzesData, null, 2) + ";";
fs.writeFileSync(path.join(__dirname, 'src', 'data', 'quizzes.js'), output, 'utf-8');
console.log('Quizzes file generated successfully with 240 questions!');
