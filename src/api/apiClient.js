
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
if (!localStorage.getItem('broski_projects')) {
  localStorage.setItem('broski_projects', JSON.stringify([
    { id: 'p1', student_email: 'student@example.com', title: 'Шинэ Үе ногоон төгөл', description: 'Сургуулийнхаа цэцэрлэгт мод тарьж нийгмийн тустай үйлс хийх төсөл.', category: 'service', status: 'in_progress', hours_logged: 15, target_hours: 50, start_date: '2026-05-01', end_date: '2026-06-30', reflections: 'Төсөл маань амжилттай үргэлжилж байгаа. Мод тарихаас гадна зүлэгжүүлэлт хийж байна.' },
    { id: 'p2', student_email: 'student@example.com', title: 'Вэбсайт хөгжүүлэлт', description: 'Сургуулийн мэдээллийн вэбсайт бэлтгэж, мэдээ мэдээллийг нийтлэх.', category: 'creativity', status: 'completed', hours_logged: 40, target_hours: 40, start_date: '2026-04-10', end_date: '2026-05-15', reflections: 'Маш сонирхолтой бүтээлч ажил байлаа.' },
    { id: 'p3', student_email: 'student@example.com', title: 'Сагсан бөмбөгийн тэмцээн', description: 'Сургуулийн анги хоорондын тэмцээнд оролцож спортоор хичээллэх.', category: 'activity', status: 'in_progress', hours_logged: 12, target_hours: 30, start_date: '2026-05-10', end_date: '2026-05-25', reflections: 'Идэвхтэй дасгал хөдөлгөөн хийж байна.' },
    { id: 'p4', student_email: 'student@example.com', title: 'Сургалтын аппликейшн бүтээх', description: 'Хүүхдүүдэд тоо бодож сурахад нь зориулсан интерактив тоглоом хөгжүүлэх.', category: 'creativity', status: 'in_progress', hours_logged: 30, target_hours: 50, start_date: '2026-05-01', end_date: '2026-06-15', reflections: 'Код бичих явцдаа их зүйл суралцаж байна.' },
    { id: 'p5', student_email: 'student@example.com', title: 'Асрамжийн газарт туслах', description: 'Асрамжийн газрын хүүхдүүдэд ном уншиж өгөх болон Англи хэл заах.', category: 'service', status: 'completed', hours_logged: 50, target_hours: 50, start_date: '2026-03-01', end_date: '2026-04-30', reflections: 'Хүүхдүүдэд туслах маш сайхан мэдрэмж байсан.' }
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
      try {
        // @ts-ignore
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
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
        return data.error?.message || "Sorry, I couldn't generate a response. Please try again.";
      } catch (error) {
        console.error("Gemini API error:", error);
        return "Failed to connect to the AI Assistant. Please check your network and try again.";
      }
    }
  }
};

