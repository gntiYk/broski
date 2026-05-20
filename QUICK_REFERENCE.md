# 🚀 Quick Start - Demo Credentials

## Accounts

### Student
```
Email: student@example.com
Password: student123
Role: Student
Location: /student
Features: Book tutoring, track projects, calendar, AI chat
```

### Tutor
```
Email: tutor@example.com  
Password: tutor123
Role: Tutor
Location: /tutor
Features: Manage bookings, approve sessions, calendar, AI chat
```

## Quick Links

### Student Dashboard
- Landing: http://localhost:5173/welcome
- Dashboard: http://localhost:5173/student
- Booking: http://localhost:5173/student/booking
- Calendar: http://localhost:5173/student/calendar
- Projects: http://localhost:5173/student/projects
- AI Chat: http://localhost:5173/student/chatbot

### Tutor Dashboard
- Dashboard: http://localhost:5173/tutor
- Notifications: http://localhost:5173/tutor/notifications ⭐ (Approve/Reject bookings here)
- Calendar: http://localhost:5173/tutor/calendar
- AI Chat: http://localhost:5173/tutor/chatbot
- Settings: http://localhost:5173/tutor/settings

## Test Scenario

1. **Login as Student**
   - Go to: student@example.com / student123
   - Navigate to: /student/booking
   - Click "Book Session"
   - Fill in details and submit

2. **Check Tutor Notifications**
   - Logout
   - Login as Tutor: tutor@example.com / tutor123
   - Go to: /tutor/notifications
   - See the booking request
   - Click "Approve" or "Reject"

3. **See Update as Student**
   - Logout
   - Login as Student again
   - Go to: /student/booking or /student/notifications
   - See the updated status

## Key Features

✅ Separate Student & Tutor dashboards  
✅ Booking notification system  
✅ Approve/Reject bookings  
✅ Calendar management  
✅ CAS project tracking  
✅ AI Assistant integration  
✅ Dark/Light mode  
✅ Fully responsive design  
✅ localStorage data persistence  

## Data Storage

All demo data is stored in browser localStorage:
- User sessions
- Bookings and their status
- Projects
- Calendar events
- Notifications

Clear browser storage to reset all data.

---

**Application**: shineUEcas Demo Platform  
**Status**: ✅ Fully Functional  
**Last Updated**: May 20, 2026
