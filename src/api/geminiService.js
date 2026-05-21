import { GoogleGenerativeAI } from '@google/generative-ai';

const REVOKED_KEY = "AIzaSyCiAQfdMgVGDGwHzyYh4I5yGBe0HoNskyY";

const getApiKey = () => {
  const key = localStorage.getItem('VITE_GEMINI_API_KEY') || import.meta.env.VITE_GEMINI_API_KEY || '';
  if (key === REVOKED_KEY || key.includes('YOUR_GEMINI_API_KEY') || key === 'undefined') {
    return '';
  }
  return key;
};

// Fallback Mock AI Engine
export const getMockAIResponse = (userPrompt, role) => {
  const query = userPrompt.toLowerCase();
  
  if (role === 'tutor') {
    if (query.includes('lesson') || query.includes('plan') || query.includes('curriculum')) {
      return `### 📋 IGCSE Lesson Planner (Demo Mode)
      
Here is a structured template to help you plan your next IGCSE session:

1. **Topic & Objectives**: What should students be able to do by the end of the lesson? (e.g., solve simultaneous linear equations).
2. **Starter Activity (10 mins)**: A quick recap quiz or puzzle to engage the class.
3. **Core Concepts (20 mins)**: Step-by-step whiteboard explanations or interactive slides.
4. **Guided Practice (15 mins)**: Worksheets with mixed difficulty levels.
5. **Plenary / Reflection (5 mins)**: Exit ticket question to assess understanding.

*Tip: Use the **Quizzes** section of your dashboard to assign homework that aligns directly with this plan!* 📝`;
    }
    if (query.includes('grade') || query.includes('score') || query.includes('mark')) {
      return `### 📝 Grading & Feedback Guide (Demo Mode)

When grading student portfolios and CAS reflections:
*   **Focus on Reflection**: Look for active learning rather than just log-hours. Did the student describe what they learned?
*   **Constructive Feedback**: Highlight one clear strength and one concrete area for improvement.
*   **Rubric Alignment**: Ensure grades map to the IGCSE/IB assessment criteria.

Need help generating a specific rubric? Just tell me the subject and requirements! 🎓`;
    }
    return `### 👨‍🏫 shineUE Tutor Assistant (Demo Mode)

Hello! I am your professional co-pilot. I can help you with:
- **IGCSE Lesson Planning**: Structuring outlines, starter ideas, and practice problems.
- **Grading Support**: Creating rubrics and draft feedback.
- **CAS Portfolio Reviews**: Suggestions for guiding students.

How can I assist you with your teaching duties today?`;
  }

  // Student Mock Responses
  if (query.includes('math') || query.includes('quadratic') || query.includes('equation') || query.includes('triangle')) {
    return `### 📐 IGCSE Mathematics Homework Helper (Demo Mode)
    
Let's break down quadratic equations!

A quadratic equation is written in the form:
$$ax^2 + bx + c = 0$$

To solve it using the quadratic formula:
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

**Example problem:** Solve $x^2 - 5x + 6 = 0$
- **Step 1:** Identify coefficients: $a = 1, b = -5, c = 6$.
- **Step 2:** Calculate discriminant: $D = b^2 - 4ac = (-5)^2 - 4(1)(6) = 25 - 24 = 1$.
- **Step 3:** Apply formula: 
  $$x = \\frac{-(-5) \\pm \\sqrt{1}}{2(1)} = \\frac{5 \\pm 1}{2}$$
  So, $x = 3$ or $x = 2$.

**Practice Exercise:**
Try solving $x^2 - 4x - 5 = 0$. Let me know your answers and I'll check them for you! 🌟`;
  }
  
  if (query.includes('physic') || query.includes('newton') || query.includes('gravity') || query.includes('force')) {
    return `### ⚡ IGCSE Physics Advisor (Demo Mode)
    
Let's explore **Newton's Second Law of Motion**.

> "The acceleration of an object as produced by a net force is directly proportional to the magnitude of the net force, in the same direction as the net force, and inversely proportional to the mass of the object."

#### 🔑 Key Equation:
$$F = m \\cdot a$$

Where:
*   **$F$** = Net Force (measured in Newtons, $N$)
*   **$m$** = Mass of the object (measured in kilograms, $kg$)
*   **$a$** = Acceleration (measured in meters per second squared, $m/s^2$)

#### 📊 Quick Summary Table:
| Variable | Unit | Definition |
| :--- | :---: | :--- |
| **Force ($F$)** | $N$ | Push or pull action |
| **Mass ($m$)** | $kg$ | Amount of matter in an object |
| **Acceleration ($a$)** | $m/s^2$ | Rate of change of velocity |

Would you like me to guide you through a sample calculations problem? Just ask! 🚀`;
  }

  if (query.includes('biolog') || query.includes('cell') || query.includes('respiration') || query.includes('plant')) {
    return `### 🧬 IGCSE Biology Tutor (Demo Mode)
    
Let's review **Aerobic Respiration**!

Aerobic respiration is the process of breaking down food (glucose) in the presence of oxygen to release chemical energy (ATP).

#### 🧪 Chemical Equation:
$$\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\rightarrow 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{Energy (ATP)}$$

#### 🔑 Key Phases:
1.  **Glycolysis**: Occurs in the cytoplasm. Glucose is split into pyruvate.
2.  **Krebs Cycle**: Occurs in the mitochondria. Produces carbon dioxide and high-energy molecules.
3.  **Electron Transport Chain**: Occurs on the inner mitochondrial membrane. Generates the majority of ATP.

**IGCSE Exam Tip:** Remember that *aerobic* respiration requires oxygen and releases a large amount of energy, whereas *anaerobic* respiration occurs in the absence of oxygen and releases far less energy! Let me know what biology topics you want to go over next! 🍀`;
  }

  if (query.includes('chemistry') || query.includes('reaction') || query.includes('atom') || query.includes('periodic')) {
    return `### 🧪 IGCSE Chemistry Assistant (Demo Mode)

Welcome to your virtual Chemistry lab! Let's explore the structure of **Atoms and the Periodic Table**.

An atom is composed of three subatomic particles:
1. **Protons**: Positive charge ($+1$), mass of $1$, located in the nucleus.
2. **Neutrons**: Neutral charge ($0$), mass of $1$, located in the nucleus.
3. **Electrons**: Negative charge ($-1$), mass of $\\frac{1}{1840}$ (negligible), orbiting in shells.

#### 📊 Subatomic Particles Comparison:
| Particle | Relative Charge | Relative Mass | Location |
| :--- | :---: | :---: | :--- |
| **Proton** | $+1$ | $1$ | Nucleus |
| **Neutron** | $0$ | $1$ | Nucleus |
| **Electron** | $-1$ | $1/1840$ | Electron Shells |

What chemical reactions or formulas can I help you balance today? ⚗️`;
  }

  if (query.includes('ict') || query.includes('computer') || query.includes('network') || query.includes('binary')) {
    return `### 💻 IGCSE ICT & Computer Science Mentor (Demo Mode)

Let's discuss **Networks and Data Security**.

#### 🌐 Network Types:
- **LAN (Local Area Network)**: Covers a small geographical area like a school or home. Fast and secure.
- **WAN (Wide Area Network)**: Covers a large geographical area (e.g., the Internet). Connects multiple LANs.

#### 🔒 Key Security Methods:
- **Encryption**: Scrambling data so it cannot be read without a decryption key.
- **Firewall**: Software or hardware that filters incoming and outgoing network traffic.
- **Strong Passwords**: Combining letters, numbers, and symbols to prevent unauthorized access.

Would you like to practice converting decimal numbers to binary? Let me know! 🖥️`;
  }

  if (query.includes('gp') || query.includes('global') || query.includes('perspective') || query.includes('essay')) {
    return `### 🌍 IGCSE Global Perspectives Advisor (Demo Mode)

Global Perspectives is all about critical thinking and evaluating different viewpoints. Let's review the **Critical Path** for analysis:

1. **Research**: Find credible sources and gather evidence.
2. **Analyze**: Evaluate arguments and identify bias or assumptions.
3. **Perspectives**: Examine national, local, and global viewpoints on the issue.
4. **Reflect**: Think about how this research affects your own personal perspective.

Need feedback on a specific global issue topic? Just paste it here! 🕊️`;
  }

  if (query.includes('mandarin') || query.includes('chinese') || query.includes('pinyin') || query.includes('tone')) {
    return `### 🇨🇳 IGCSE Mandarin Chinese Helper (Demo Mode)

你好 (Nǐ hǎo)! Let's quickly review the **Four Tones** in Pinyin:

1. **First Tone (mā)**: High and level (flat). Like saying "ahhh" at the dentist.
2. **Second Tone (má)**: Rising tone. Like asking a question: "What?"
3. **Third Tone (mǎ)**: Dipping tone (falls then rises). Like saying "Well..." slowly.
4. **Fourth Tone (mà)**: Falling tone. Sharp and angry. Like saying "Stop!"

#### 📝 Useful Greetings:
- **Hello**: 你好 (Nǐ hǎo)
- **Thank you**: 谢谢 (Xièxie)
- **Goodbye**: 再见 (Zàijiàn)

Would you like to practice Chinese sentence structures? Let me know! 🎋`;
  }

  if (query.includes('cas') || query.includes('creativity') || query.includes('activity') || query.includes('service') || query.includes('project') || query.includes('reflection')) {
    return `### 🌟 IB CAS Advisor (Creativity, Activity, Service) (Demo Mode)
    
I can help you design high-quality experiences and write excellent reflections.

#### 💡 Brilliant CAS Experience Ideas:
1.  **Creativity**: Learn a new musical instrument, build a React website (like this one!), or create a digital portfolio of oil paintings.
2.  **Activity**: Train for a half-marathon, practice martial arts, or join the school basketball team.
3.  **Service**: Tutor middle schoolers in IGCSE subjects (adds directly to your hours!), coordinate a recycling campaign, or develop financial spreadsheets for a local charity.

#### 📝 Writing a Premium Reflection (The 3-Step Structure):
*   **What?** (Describe): What did you do? What worked and what didn't?
*   **So What?** (Analyze): How did you feel? What skills did you develop? Which CAS learning outcomes did you hit?
*   **Now What?** (Apply): How will you apply what you learned to future experiences?

Let me know if you want to write a reflection for a specific project! 🎓`;
  }

  return `### ✨ shineUE AI Assistant (Demo Mode)
  
Hello! 👋 I am your academic and CAS companion.

*   If you are a **Middle School Student**, I can tutor you in **IGCSE Math, Physics, ESL, Biology, Chemistry, ICT, GP, or Mandarin Chinese**. Just ask a question about any of these subjects!
*   If you are an **IB Student / Tutor**, I can help you write detailed **CAS reflections**, plan new experiences, or organize your tasks.

*Set your own Gemini API Key in the settings or top bar to switch this chat to live mode!*`;
};

export const geminiService = {
  /**
   * @param {{sender: 'user' | 'assistant' | string, text: string}[]} history
   * @param {string} newMessage
   * @param {string} role
   * @returns {Promise<string>}
   */
  generateChatResponse: async (history, newMessage, role) => {
    const apiKey = getApiKey();
    
    if (!apiKey) {
      console.warn("Gemini API key is not configured or revoked. Falling back to local mock response.");
      await new Promise(r => setTimeout(r, 600));
      return getMockAIResponse(newMessage, role);
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: role === 'tutor' 
          ? "You are an AI assistant designed to help tutors manage their students, plan CAS activities, grade assignments, and structure IGCSE lesson plans."
          : "You are an AI assistant designed to help IB and IGCSE students. You act as a supportive tutor, explaining complex concepts simply, helping with homework, and brainstorming CAS project ideas."
      });

      const validHistory = [];
      let lastRole = null;
      
      for (const msg of history) {
        const currentRole = msg.sender === 'user' ? 'user' : 'model';
        if (validHistory.length === 0 && currentRole === 'model') continue;
        
        if (currentRole !== lastRole) {
          validHistory.push({
            role: currentRole,
            parts: [{ text: msg.text }],
          });
          lastRole = currentRole;
        }
      }

      const chat = model.startChat({
        history: validHistory,
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      });

      const result = await chat.sendMessage(newMessage);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini API Error, falling back to mock response:", error);
      return getMockAIResponse(newMessage, role);
    }
  }
};
