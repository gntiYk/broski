import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, GraduationCap, Users, FolderKanban,
  CalendarDays, BookOpen, Bot, Bell,
  Settings, ChevronLeft, ChevronRight, LogOut, Sparkles
} from 'lucide-react';
import { useTheme } from '../ThemeProvider';
import { Sun, Moon } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const role = user?.role || 'student';

  const menuItems = [];
  if (role === 'tutor') {
    menuItems.push(
      { path: '/tutor', icon: LayoutDashboard, label: 'Dashboard' },
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
    );
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col border-r border-sidebar-border bg-sidebar"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-border">
          <img src="/csorgil.jpg" alt="Logo" className="w-full h-full object-cover" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-heading font-bold text-lg text-sidebar-foreground whitespace-nowrap"
            >
              shine<span className="text-primary">UE</span>cas
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
            location.pathname.startsWith(item.path + '/');
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative ${isActive
                  ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-primary"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-2">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors w-full"
        >
          {theme === 'light' ? <Moon className="w-5 h-5 flex-shrink-0" /> : <Sun className="w-5 h-5 flex-shrink-0" />}
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm">
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm">
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </motion.aside>
  );
}