
const getStorageItem = (key, defaultVal = []) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const setStorageItem = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error("Storage write failed", e);
  }
};

// Helper function to create notifications
const createNotification = (tutor_email, message, type = 'booking', data = {}) => {
  const notifications = getStorageItem('broski_notifications', []);
  const notification = {
    id: Math.random().toString(),
    tutor_email,
    message,
    type,
    read: false,
    created_date: new Date().toISOString(),
    data
  };
  notifications.push(notification);
  setStorageItem('broski_notifications', notifications);
  return notification;
};
const createPersistence = (storageKey) => {
  return {
    list: async () => {
      return getStorageItem(storageKey);
    },
    filter: async (filters = {}, sort, limit) => {
      let items = getStorageItem(storageKey);
      if (filters) {
        items = items.filter(item => {
          return Object.entries(filters).every(([key, value]) => {
            if (value === undefined || value === null) return true;
            return item[key] === value;
          });
        });
      }
      return items;
    },
    create: async (data) => {
      const items = getStorageItem(storageKey);
      const newItem = { id: Math.random().toString(), created_date: new Date().toISOString(), ...data };
      items.push(newItem);
      setStorageItem(storageKey, items);
      // Create notification for tutor when a booking is created
      if (storageKey === 'broski_bookings' && data.tutor_email) {
        createNotification(
          data.tutor_email,
          `${data.student_name} has booked a tutoring session for ${data.subject}`,
          'booking',
          { booking_id: newItem.id, student_email: data.student_email, subject: data.subject }
        );
      }
      return newItem;
    },
    update: async (id, data) => {
      const items = getStorageItem(storageKey);
      const idx = items.findIndex(item => item.id === id);
      if (idx !== -1) {
        items[idx] = { ...items[idx], ...data };
        setStorageItem(storageKey, items);
        // Create notification when booking status changes
        if (storageKey === 'broski_bookings' && data.status) {
          const booking = items[idx];
          const statusMessages = {
            'approved': `Your tutoring session for ${booking.subject} has been approved`,
            'rejected': `Your tutoring session for ${booking.subject} has been rejected`,
            'completed': `Your tutoring session for ${booking.subject} has been completed`
          };
          
          if (statusMessages[data.status] && booking.student_email) {
            createNotification(
              booking.student_email,
              statusMessages[data.status],
              'booking_status',
              { booking_id: id, status: data.status }
            );
          }
        }
        return items[idx];
      }
      return { id, ...data };
    },
    delete: async (id) => {
      let items = getStorageItem(storageKey);
      items = items.filter(item => item.id !== id);
      setStorageItem(storageKey, items);
      return { id };
    }
  };
};

// Initialize beautiful demo data if empty
let storedProjects = getStorageItem('broski_projects', []);
if (storedProjects.length === 0 || !storedProjects.some(p => p.id === 'p_finance')) {
  localStorage.setItem('broski_projects', JSON.stringify([
    {
      id: 'p_finance',
      student_email: 'tutor@example.com',
      title: 'Project Finance',
      description: 'A long-term project to simplify the school\'s finance tracking, balance sheets, and charity sponsorship ledgers.',
      category: 'service',
      status: 'in_progress',
      hours_logged: 25.5,
      target_hours: 60,
      start_date: '2026-05-10',
      end_date: '2026-06-20',
      reflections: 'We have successfully completed the initial budget analysis and funding proposal as well as our digital ledger setup. Tutors are currently leading a donation drive.',
      milestones: [
        {id: 'm1', title: 'Initial budget analysis & funding proposal', due: '2026-05-10', status: 'completed'},
        {id: 'm2', title: 'Digital ledger setup & accounts configuration', due: '2026-05-12', status: 'completed'},
        {id: 'm3', title: 'Tutor donation drive & collection', due: '2026-05-18', status: 'in_progress'},
        {id: 'm4', title: 'Charity partnerships integration', due: '2026-05-25', status: 'planned'},
        {id: 'm5', title: 'Balance sheet generation & trial run', due: '2026-06-10', status: 'planned'},
        {id: 'm6', title: 'Supervisor final review & signoff', due: '2026-06-15', status: 'planned'}
      ]
    },
    { id: 'p1', student_email: 'tutor@example.com', title: 'Шинэ Үе ногоон төгөл', description: 'Сургуулийнхаа цэцэрлэгт мод тарьж нийгмийн тустай үйлс хийх төсөл.', category: 'service', status: 'in_progress', hours_logged: 15, target_hours: 50, start_date: '2026-05-01', end_date: '2026-06-30', reflections: 'Төсөл маань амжилттай үргэлжилж байгаа. Мод тарихаас гадна зүлэгжүүлэлт хийж байна.' },
    { id: 'p2', student_email: 'tutor@example.com', title: 'Вэбсайт хөгжүүлэлт', description: 'Сургуулийн мэдээллийн вэбсайт бэлтгэж, мэдээ мэдээллийг нийтлэх.', category: 'creativity', status: 'completed', hours_logged: 40, target_hours: 40, start_date: '2026-04-10', end_date: '2026-05-15', reflections: 'Маш сонирхолтой бүтээлч ажил байлаа.' },
    { id: 'p3', student_email: 'tutor@example.com', title: 'Сагсан бөмбөгийн тэмцээн', description: 'Сургуулийн анги хоорондын тэмцээнд оролцож спортоор хичээллэх.', category: 'activity', status: 'in_progress', hours_logged: 12, target_hours: 30, start_date: '2026-05-10', end_date: '2026-05-25', reflections: 'Идэвхтэй дасгал хөдөлгөөн хийж байна.' },
    { id: 'p4', student_email: 'tutor@example.com', title: 'Сургалтын аппликейшн бүтээх', description: 'Хүүхдүүдэд тоо бодож сурахад нь зориулсан интерактив тоглоом хөгжүүлэх.', category: 'creativity', status: 'in_progress', hours_logged: 30, target_hours: 50, start_date: '2026-05-01', end_date: '2026-06-15', reflections: 'Код бичих явцдаа их зүйл суралцаж байна.' },
    { id: 'p5', student_email: 'tutor@example.com', title: 'Асрамжийн газарт туслах', description: 'Асрамжийн газрын хүүхдүүдэд ном уншиж өгөх болон Англи хэл заах.', category: 'service', status: 'completed', hours_logged: 50, target_hours: 50, start_date: '2026-03-01', end_date: '2026-04-30', reflections: 'Хүүхдүүдэд туслах маш сайхан мэдрэмж байсан.' }
  ]));
}

if (!localStorage.getItem('broski_bookings')) {
  localStorage.setItem('broski_bookings', JSON.stringify([
    { id: 'b1', student_email: 'student@example.com', student_name: 'Сурагч Дорж', tutor_email: 'tutor@example.com', subject: 'Математикийн давтлага', status: 'pending', date: '2026-05-20', time_slot: '14:00 - 15:00', notes: 'Тэгшитгэл бодох болон интегралын тухай давтах хүсэлтэй байна.', created_date: new Date().toISOString() },
    { id: 'b2', student_email: 'student2@example.com', student_name: 'Сурагч Сарнай', tutor_email: 'tutor@example.com', subject: 'Физикийн хичээл', status: 'approved', date: '2026-05-21', time_slot: '16:00 - 17:00', notes: 'Ньютоны хуулиудын дадлага даалгавар бодно.', created_date: new Date().toISOString() }
  ]));
}

if (!localStorage.getItem('broski_users')) {
  localStorage.setItem('broski_users', JSON.stringify([
    { email: 'student@example.com', full_name: 'Сурагч Дорж', role: 'student', password: 'student123' },
    { email: 'student2@example.com', full_name: 'Сурагч Сарнай', role: 'student', password: 'student123' },
    { email: 'tutor@example.com', full_name: 'Tutor Зориг', role: 'tutor', password: 'tutor123' }
  ]));
}

// Initialize demo notifications
if (!localStorage.getItem('broski_notifications')) {
  localStorage.setItem('broski_notifications', JSON.stringify([
    { id: 'n1', tutor_email: 'tutor@example.com', message: 'Сурагч Дорж математикийн давтлагыг зааж өгөхийг хүсэлтэй байна', type: 'booking', read: false, created_date: new Date(Date.now() - 86400000).toISOString(), data: { booking_id: 'b1' } }
  ]));
}

export const api = {
  auth: {
    loginViaEmailPassword: async (email, password, role = 'student') => {
      console.log('Mock login:', email, 'Role:', role);
      
      // Save user to users persistence if not present
      const users = getStorageItem('broski_users');
      let registered = users.find(u => u.email === email);
      if (!registered) {
        registered = { email, full_name: email.split('@')[0], role };
        users.push(registered);
        setStorageItem('broski_users', users);
      }
      
      const user = { id: Math.random().toString(), email, role, full_name: registered.full_name };
      localStorage.setItem('mock_user', JSON.stringify(user));
      return { user };
    },
    register: async (email, password, name, role) => {
      console.log('Mock register:', email, role);
      
      const users = getStorageItem('broski_users');
      const registered = { email, full_name: name, role, password };
      users.push(registered);
      setStorageItem('broski_users', users);
      
      const user = { id: Math.random().toString(), email, full_name: name, role };
      localStorage.setItem('mock_user', JSON.stringify(user));
      return { user };
    },
    me: async () => {
      const stored = localStorage.getItem('mock_user');
      if (stored) return JSON.parse(stored);
      return null;
    },
    logout: async () => {
      console.log('Mock logout');
      localStorage.removeItem('mock_user');
    },
    resetPasswordRequest: async (email) => {
      console.log('Mock reset password:', email);
    },
    loginWithProvider: (provider, redirectUrl) => {
      console.log('Mock login with provider:', provider);
      const user = { id: '1', email: 'student@example.com', role: 'student', full_name: 'Сурагч Дорж' };
      localStorage.setItem('mock_user', JSON.stringify(user));
      window.location.href = redirectUrl || '/student';
    },
    redirectToLogin: (redirectUrl) => {
      window.location.href = '/login';
    }
  },
  entities: {
    Project: createPersistence('broski_projects'),
    Booking: {
      ...createPersistence('broski_bookings'),
      // Override create to handle tutor assignment
      create: async (data) => {
        const items = getStorageItem('broski_bookings');
        const newItem = { id: Math.random().toString(), created_date: new Date().toISOString(), ...data };
        items.push(newItem);
        setStorageItem('broski_bookings', items);
        
        // Create notification for tutor
        if (data.tutor_email) {
          createNotification(
            data.tutor_email,
            `${data.student_name || 'A student'} has booked a tutoring session for ${data.subject}`,
            'booking',
            { booking_id: newItem.id, student_email: data.student_email, subject: data.subject }
          );
        }
        
        return newItem;
      }
    },
    CalendarEvent: createPersistence('broski_calendar_events'),
    Message: createPersistence('broski_messages'),
    Notification: createPersistence('broski_notifications'),
    User: createPersistence('broski_users')
  },
  chatbot: {
    sendMessage: async ({ prompt }) => {
      const getMockAIResponse = (userPrompt) => {
        const query = userPrompt.toLowerCase();
        
        if (query.includes('math') || query.includes('quadratic') || query.includes('equation') || query.includes('triangle')) {
          return `### 📐 IGCSE Mathematics Homework Helper
          
Hello! I see you are working on a **Mathematics** problem. Let's break down quadratic equations!

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
          return `### ⚡ IGCSE Physics Advisor
          
Hi there! Physics can be extremely fun when you understand the fundamental principles. Let's explore **Newton's Second Law of Motion**.

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
          return `### 🧬 IGCSE Biology Tutor
          
Hello! Biology is the study of life, and cellular processes are its foundation. Let's review **Aerobic Respiration**!

Aerobic respiration is the process of breaking down food (glucose) in the presence of oxygen to release chemical energy (ATP).

#### 🧪 Chemical Equation:
$$\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\rightarrow 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{Energy (ATP)}$$

#### 🔑 Key Phases:
1.  **Glycolysis**: Occurs in the cytoplasm. Glucose is split into pyruvate.
2.  **Krebs Cycle**: Occurs in the mitochondria. Produces carbon dioxide and high-energy molecules.
3.  **Electron Transport Chain**: Occurs on the inner mitochondrial membrane. Generates the majority of ATP.

**IGCSE Exam Tip:** Remember that *aerobic* respiration requires oxygen and releases a large amount of energy, whereas *anaerobic* respiration occurs in the absence of oxygen and produces lactate (in humans) or ethanol & $CO_2$ (in yeast) with much less energy! Let me know what biology topics you want to go over next! 🍀`;
        }

        if (query.includes('chemistry') || query.includes('reaction') || query.includes('atom') || query.includes('periodic')) {
          return `### 🧪 IGCSE Chemistry Assistant

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

**Exam Tip:** The *Atomic Number* is the number of protons. The *Mass Number* is the sum of protons and neutrons. Isotopes are atoms of the same element with the same number of protons but different numbers of neutrons.

What chemical reactions or formulas can I help you balance today? ⚗️`;
        }

        if (query.includes('ict') || query.includes('computer') || query.includes('network') || query.includes('binary')) {
          return `### 💻 IGCSE ICT & Computer Science Mentor

Hello! Information and Communication Technology (ICT) is a critical part of our modern digital world. Let's discuss **Networks and Data Security**.

#### 🌐 Network Types:
- **LAN (Local Area Network)**: Covers a small geographical area like a school or home. Fast and secure.
- **WAN (Wide Area Network)**: Covers a large geographical area (e.g., the Internet). Connects multiple LANs.

#### 🔒 Key Security Methods:
- **Encryption**: Scrambling data so it cannot be read without a decryption key.
- **Firewall**: Software or hardware that filters incoming and outgoing network traffic.
- **Strong Passwords**: Combining letters, numbers, and symbols to prevent unauthorized access.

Would you like to practice converting decimal numbers to binary, or review database concepts? Let me know! 🖥️`;
        }

        if (query.includes('gp') || query.includes('global') || query.includes('perspective') || query.includes('essay')) {
          return `### 🌍 IGCSE Global Perspectives Advisor

Hi! Global Perspectives is all about critical thinking and evaluating different viewpoints. Let's review the **Critical Path** for analysis:

1. **Research**: Find credible sources and gather evidence.
2. **Analyze**: Evaluate arguments and identify bias or assumptions.
3. **Perspectives**: Examine national, local, and global viewpoints on the issue.
4. **Reflect**: Think about how this research affects your own personal perspective.

**Tip for writing your GP Individual Report:** Make sure to clearly state your question, present a balanced view with evidence from different countries, and write a structured conclusion proposing realistic solutions!

Need feedback on a specific global issue topic? Just paste it here! 🕊️`;
        }

        if (query.includes('mandarin') || query.includes('chinese') || query.includes('pinyin') || query.includes('tone')) {
          return `### 🇨🇳 IGCSE Mandarin Chinese Helper

你好 (Nǐ hǎo)! Learning Mandarin Chinese is an amazing journey. Let's quickly review the **Four Tones** in Pinyin:

1. **First Tone (mā)**: High and level (flat). Like saying "ahhh" at the dentist.
2. **Second Tone (má)**: Rising tone. Like asking a question: "What?"
3. **Third Tone (mǎ)**: Dipping tone (falls then rises). Like saying "Well..." slowly.
4. **Fourth Tone (mà)**: Falling tone. Sharp and angry. Like saying "Stop!"

#### 📝 Useful Greetings:
- **Hello**: 你好 (Nǐ hǎo)
- **Thank you**: 谢谢 (Xièxie)
- **Goodbye**: 再见 (Zàijiàn)
- **How are you?**: 你好吗 (Nǐ hǎo ma?)

Would you like to practice sentence structures or grammar patterns like "虽然...但是..." (although... but...)? Let me know! 🎋`;
        }

        if (query.includes('cas') || query.includes('creativity') || query.includes('activity') || query.includes('service') || query.includes('project') || query.includes('reflection')) {
          return `### 🌟 IB CAS Advisor (Creativity, Activity, Service)
          
Hello! As an **IB CAS Advisor**, I can help you design high-quality experiences and write excellent reflections.

#### 💡 Brilliant CAS Experience Ideas:
1.  **Creativity**: Learn a new musical instrument, build a React website (like this one!), or create a digital portfolio of oil paintings.
2.  **Activity**: Train for a half-marathon, practice martial arts, or join the school basketball team.
3.  **Service**: Tutor middle schoolers in IGCSE subjects (adds directly to your hours!), coordinate a recycling campaign, or develop financial spreadsheets for a local charity (like **Project Finance**!).

#### 📝 Writing a Premium Reflection (The 3-Step Structure):
*   **What?** (Describe): What did you do? What worked and what didn't?
*   **So What?** (Analyze): How did you feel? What skills did you develop? Which CAS learning outcomes did you hit?
*   **Now What?** (Apply): How will you apply what you learned to future experiences?

Let me know if you want to write a reflection for a specific project or need project plan outlines! 🎓`;
        }

        return `### ✨ shineUE AI Assistant
        
Hello! 👋 I am your academic and CAS companion.

*   If you are a **Middle School Student**, I can tutor you in **IGCSE Math, Physics, ESL, Biology, Chemistry, ICT, GP, or Mandarin Chinese**. Just ask a question about any of these subjects!
*   If you are an **IB Student / Tutor**, I can help you write detailed **CAS reflections**, plan new experiences, or organize your **Project Finance** tasks.

How can I support you today? Just ask me any academic or planning question!`;
      };

      try {
        // @ts-ignore
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey || apiKey.includes('YOUR_GEMINI_API_KEY') || apiKey === 'undefined') {
          // Delay to simulate network response
          await new Promise(r => setTimeout(r, 800));
          return getMockAIResponse(prompt);
        }
        
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );
        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
          return data.candidates[0].content.parts[0].text;
        }
        
        // If API response is valid but has no candidates (like billing/quota issue)
        return getMockAIResponse(prompt);
      } catch (error) {
        console.warn("Gemini API failed, using high-quality mock fallback:", error);
        return getMockAIResponse(prompt);
      }
    }
  }
};


