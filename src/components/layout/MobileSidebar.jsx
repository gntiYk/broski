import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, GraduationCap, Users, FolderKanban,
  CalendarDays, BookOpen, MessageCircle, Bot, Bell,
  Settings, X, Sparkles, LogOut
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function MobileSidebar({ open, onClose }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const role = user?.role || 'student';

  const menuItems = [];
  if (role === 'tutor') {
    menuItems.push(
      { path: '/tutor', icon: LayoutDashboard, label: 'Dashboard' },
<<<<<<< HEAD
      { path: '/tutor/calendar', icon: CalendarDays, label: 'Calendar' },
      { path: '/tutor/chatbot', icon: Bot, label: 'AI Assistant' },
      { path: '/tutor/notifications', icon: Bell, label: 'Notifications' },
      { path: '/tutor/settings', icon: Settings, label: 'Settings' },
    );
  } else {
    menuItems.push(
      { path: '/student', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/student/booking', icon: BookOpen, label: 'Booking' },
      { path: '/student/calendar', icon: CalendarDays, label: 'Calendar' },
      { path: '/student/projects', icon: FolderKanban, label: 'Projects' },
      { path: '/student/chatbot', icon: Bot, label: 'AI Assistant' },
=======
      { path: '/projects', icon: FolderKanban, label: 'Project Track' },
      { path: '/calendar', icon: CalendarDays, label: 'Calendar' },
      { path: '/chatbot', icon: Bot, label: 'AI Assistant' },
      { path: '/notifications', icon: Bell, label: 'Notifications' },
      { path: '/settings', icon: Settings, label: 'Settings' },
    );
  } else {
    menuItems.push(
      { path: '/booking', icon: BookOpen, label: 'Booking' },
      { path: '/calendar', icon: CalendarDays, label: 'Calendar' },
      { path: '/chatbot', icon: Bot, label: 'AI Assistant' },
      { path: '/notifications', icon: Bell, label: 'Notifications' },
      { path: '/settings', icon: Settings, label: 'Settings' },
>>>>>>> 70147242d59ea2e29a56be4e64435702841dfbb1
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-screen w-[280px] bg-sidebar border-r border-sidebar-border z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-4 h-16 border-b border-sidebar-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-border">
                  <img src="/csorgil.jpg" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <span className="font-heading font-bold text-lg text-sidebar-foreground">
                  shine<span className="text-primary">UE</span>cas
                </span>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path || 
<<<<<<< HEAD
                  location.pathname.startsWith(item.path + '/');
=======
                  (item.path === '/tutor' && location.pathname === '/' && role === 'tutor') || 
                  (item.path === '/booking' && location.pathname === '/' && role === 'student');
>>>>>>> 70147242d59ea2e29a56be4e64435702841dfbb1
                return (
                  <Link key={item.path} to={item.path} onClick={onClose}>
                    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                      ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50'
                      }`}>
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                      <span className="text-sm">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
            <div className="px-3 py-4 border-t border-sidebar-border">
              <button
                onClick={() => logout()}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}