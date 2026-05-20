# ShineUEcas Demo Guide

## Overview
ShineUEcas is a comprehensive platform for managing CAS (Creativity, Activity, Service) projects, booking tutoring sessions, and AI-assisted learning. The application has been fully implemented with demo accounts and working features.

## 🎯 Key Features Implemented

### 1. **Role-Based Navigation**
- **Student Dashboard**: `/student` - View bookings, projects, calendar, AI assistant
- **Tutor Dashboard**: `/tutor` - Manage notifications, approve bookings, settings

### 2. **Student Features**
- **Dashboard** (`/student`) - Overview of projects, bookings, and statistics
- **Booking** (`/student/booking`) - Book tutoring sessions with tutors
- **Calendar** (`/student/calendar`) - Manage study sessions and events
- **Projects** (`/student/projects`) - Track CAS project hours and progress
- **AI Assistant** (`/student/chatbot`) - Get study assistance from AI
- **Notifications** (`/student/notifications`) - Receive updates on bookings

### 3. **Tutor Features**
- **Dashboard** (`/tutor`) - Overview and statistics
- **Calendar** (`/tutor/calendar`) - Manage tutoring schedule
- **AI Assistant** (`/tutor/chatbot`) - Professional assistance
- **Notifications** (`/tutor/notifications`) - **NEW: Receive booking requests and approve/reject them**
- **Settings** (`/tutor/settings`) - Manage profile and preferences

### 4. **Notification System** ✨ NEW
- Tutors receive notifications when students book sessions
- Notifications show:
  - Student name and subject
  - Date and time of booking
  - **Action buttons to Approve or Reject**
- Students receive status updates on their bookings
- Real-time notification management with read/unread status

### 5. **Booking Workflow**
```
Student Books Session
          ↓
Tutor Receives Notification
          ↓
Tutor Approves/Rejects
          ↓
Student Gets Status Update
```

---

## 👥 Demo Accounts

### **Student Account 1**
- **Email**: `student@example.com`
- **Password**: `student123`
- **Features**: Book tutoring, track projects, use calendar

### **Student Account 2** 
- **Email**: `student2@example.com`
- **Password**: `student123`
- **Features**: Alternative student account for testing

### **Tutor Account**
- **Email**: `tutor@example.com`
- **Password**: `tutor123`
- **Features**: Receive bookings, manage notifications, approve sessions

---

## 🚀 Getting Started

### 1. **Access the Landing Page**
- Navigate to `/welcome` or root URL
- See demo account credentials displayed
- Choose between Student or Tutor role

### 2. **Login with Demo Account**
- Click "Nэвтрэх" (Sign in)
- Select role (Student or Tutor)
- Credentials are displayed as helpful hints
- Both email and password fields are pre-filled hints for convenience

### 3. **Test Student Experience**
```
1. Login: student@example.com / student123
2. Redirects to /student (Student Dashboard)
3. Try these features:
   - /student/booking - Book a tutoring session
   - /student/calendar - View calendar
   - /student/projects - See CAS projects
   - /student/chatbot - Chat with AI
```

### 4. **Test Tutor Experience**
```
1. Login: tutor@example.com / tutor123
2. Redirects to /tutor (Tutor Dashboard)
3. Try these features:
   - /tutor/notifications - See booking notifications
   - Click "Approve" or "Reject" buttons
   - /tutor/calendar - View schedule
   - /tutor/settings - Manage profile
```

---

## 📋 Demo Data Included

### **Pre-Loaded Bookings**
- 1 Pending booking from Student 1
- 1 Approved booking from Student 2
- All data persisted in browser localStorage

### **Sample Projects** (For Students)
- Multiple CAS projects with different statuses
- Hours logged and targets
- Categories: Service, Creativity, Activity

### **Demo Notifications** (For Tutors)
- Sample booking request notification
- Status update notifications

---

## 🔄 Workflow Examples

### **Example 1: Complete Booking Flow**
```
1. Login as Student: student@example.com / student123
2. Go to /student/booking
3. Click "Book Session" button
4. Fill form:
   - Select tutor: Tutor Зориг
   - Subject: Mathematics
   - Date: Pick any future date
   - Time: 14:00
5. Click "Send Request"
6. Logout and login as Tutor: tutor@example.com / tutor123
7. Go to /tutor/notifications
8. See the booking notification
9. Click "Approve" or "Reject"
10. Logout and login as Student
11. See status update in notifications
```

### **Example 2: Calendar Management**
```
Student:
1. Login as student
2. Go to /student/calendar
3. Create calendar event
4. Select type, date, time
5. Add notes and save

Tutor:
1. Login as tutor
2. Go to /tutor/calendar
3. View your tutoring schedule
```

### **Example 3: Project Tracking**
```
Student Only Feature:
1. Login as student
2. Go to /student/projects
3. View CAS projects
4. Log hours worked
5. Track progress
```

---

## 🎨 UI/UX Features

- **Dark/Light Mode**: Toggle in sidebar
- **Responsive Design**: Works on desktop, tablet, mobile
- **Animations**: Smooth transitions and micro-interactions
- **Notifications**: Toast notifications for actions
- **Loading States**: Visual feedback during operations

---

## 💾 Data Persistence

All data is stored in **browser localStorage**:
- User sessions
- Bookings
- Projects
- Calendar events
- Notifications
- Messages

**Note**: Data persists across page refreshes but is cleared if browser storage is cleared.

---

## 🔐 Security Note

This is a demo application using mock authentication for testing purposes. 

**For Production**, implement:
- Real backend authentication
- Encrypted password storage
- JWT/Session tokens
- Database persistence
- API rate limiting

---

## 📱 Routes Reference

### Public Routes
- `/welcome` - Landing page with demo credentials
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password recovery

### Student Protected Routes
- `/student` - Dashboard
- `/student/booking` - Book tutoring
- `/student/calendar` - Calendar
- `/student/projects` - Project tracking
- `/student/chatbot` - AI Assistant

### Tutor Protected Routes
- `/tutor` - Dashboard
- `/tutor/calendar` - Calendar
- `/tutor/chatbot` - AI Assistant
- `/tutor/notifications` - **Booking notifications with approve/reject**
- `/tutor/settings` - Settings

---

## 🎯 Testing Checklist

- [ ] Login with student account
- [ ] Navigate to all student pages
- [ ] Book a tutoring session
- [ ] See booking in calendar
- [ ] Logout
- [ ] Login with tutor account
- [ ] See notification for new booking
- [ ] Approve or reject booking
- [ ] Logout and login as student
- [ ] See booking status update
- [ ] Test dark mode toggle
- [ ] Test mobile responsiveness
- [ ] Log project hours
- [ ] Chat with AI assistant
- [ ] Check notifications page

---

## 📞 Support

For issues or questions, check:
1. Browser console for errors
2. Network tab for API calls
3. LocalStorage for data persistence
4. Documentation files in repo

---

## ✅ Version History

**v1.0.0 - Complete Demo** (May 2026)
- ✅ Role-based routing and navigation
- ✅ Student and Tutor separate dashboards
- ✅ Booking system with notifications
- ✅ Tutor notification with approve/reject functionality
- ✅ Calendar management
- ✅ Project tracking
- ✅ AI Assistant integration
- ✅ Demo accounts with localStorage persistence
- ✅ Fully functional demo application

---

**Last Updated**: May 20, 2026  
**Demo Application**: shineUEcas v1.0.0
