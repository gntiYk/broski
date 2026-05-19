import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ProtectedRoute from '@/components/ProtectedRoute';
import ThemeProvider from '@/components/ThemeProvider';

// Auth pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

// Public pages
import Landing from '@/pages/Landing';

// App pages
import Dashboard from '@/pages/Dashboard';
import StudentDashboard from '@/pages/StudentDashboard';
import TutorDashboard from '@/pages/TutorDashboard';
import ProjectTrack from '@/pages/ProjectTrack';
import CalendarPage from '@/pages/CalendarPage';
import BookingPage from '@/pages/BookingPage';
import ChatbotPage from '@/pages/ChatbotPage';
import NotificationsPage from '@/pages/NotificationsPage';
import SettingsPage from '@/pages/SettingsPage';

// Layout
import AppLayout from '@/components/layout/AppLayout';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">Loading shineUEcas...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
  }

const RoleBasedHome = () => {
  const { user } = useAuth();
  if (user?.role === 'tutor') return <Navigate to="/tutor" replace />;
  if (user?.role === 'student') return <Navigate to="/student" replace />;
  return <Navigate to="/welcome" replace />;
};

  return (
    <Routes>
      {/* Public pages */}
      <Route path="/welcome" element={<Landing />} />
      
      {/* Auth pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected app pages */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/welcome" replace />} />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<RoleBasedHome />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/tutor" element={<TutorDashboard />} />
          <Route path="/projects" element={<ProjectTrack />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App