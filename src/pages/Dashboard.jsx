import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import { 
  Clock, BookOpen, FolderKanban, CalendarDays,
  CheckCircle2, Sparkles, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '@/components/shared/StatCard';
import SectionHeader from '@/components/shared/SectionHeader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const weeklyData = [
  { day: 'Mon', hours: 2 },
  { day: 'Tue', hours: 3 },
  { day: 'Wed', hours: 1.5 },
  { day: 'Thu', hours: 4 },
  { day: 'Fri', hours: 2 },
  { day: 'Sat', hours: 5 },
  { day: 'Sun', hours: 1 },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const { user } = useAuth();

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => api.entities.Project.list('-created_date', 50),
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => api.entities.Booking.list('-created_date', 20),
  });

  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: () => api.entities.CalendarEvent.list('-date', 10),
  });

  const totalHours = projects.reduce((sum, p) => sum + (p.hours_logged || 0), 0);
  const activeProjects = projects.filter(p => p.status === 'in_progress').length;
  const upcomingSessions = bookings.filter(b => b.status === 'approved').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        title={`Welcome back, ${user?.full_name?.split(' ')[0] || 'there'}`}
        subtitle="Here's your CAS journey overview"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Clock} label="Total CAS Hours" value={totalHours.toFixed(1)} trend={12} color="primary" delay={0} />
        <StatCard icon={FolderKanban} label="Active Projects" value={activeProjects} trend={5} color="accent" delay={0.1} />
        <StatCard icon={BookOpen} label="Upcoming Sessions" value={upcomingSessions} color="chart3" delay={0.2} />
        <StatCard icon={CheckCircle2} label="Completed" value={projects.filter(p => p.status === 'completed').length} color="chart4" delay={0.3} />
      </div>

      {/* Main content grid */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <motion.div variants={item} className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold">Weekly Activity</h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">This Week</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item} className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-heading font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Log CAS Hours', path: '/projects', icon: Clock, gradient: 'from-primary to-accent' },
              { label: 'Book a Tutor', path: '/booking', icon: BookOpen, gradient: 'from-emerald-500 to-teal-500' },
              { label: 'AI Assistant', path: '/chatbot', icon: Sparkles, gradient: 'from-purple-500 to-pink-500' },
              { label: 'View Calendar', path: '/calendar', icon: CalendarDays, gradient: 'from-amber-500 to-orange-500' },
            ].map((action) => (
              <Link key={action.path} to={action.path}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center`}>
                    <action.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium flex-1">{action.label}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Projects + Upcoming */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <motion.div variants={item} className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold">Recent Projects</h3>
            <Link to="/projects" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {projects.slice(0, 4).map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full ${
                  project.category === 'creativity' ? 'bg-purple-500' :
                  project.category === 'activity' ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{project.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{project.category} · {project.hours_logged || 0}h logged</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  project.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600' :
                  project.status === 'in_progress' ? 'bg-primary/10 text-primary' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {project.status?.replace('_', ' ')}
                </span>
              </motion.div>
            ))}
            {projects.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No projects yet. Start your CAS journey!</p>
            )}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div variants={item} className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold">Upcoming Events</h3>
            <Link to="/calendar" className="text-xs text-primary hover:underline">View calendar</Link>
          </div>
          <div className="space-y-3">
            {events.slice(0, 4).map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex flex-col items-center justify-center">
                  <span className="text-[10px] text-muted-foreground leading-none">
                    {event.date ? new Date(event.date).toLocaleDateString('en', { month: 'short' }) : ''}
                  </span>
                  <span className="text-sm font-bold leading-none">
                    {event.date ? new Date(event.date).getDate() : ''}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{event.type?.replace('_', ' ')} {event.start_time ? `· ${event.start_time}` : ''}</p>
                </div>
              </motion.div>
            ))}
            {events.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No upcoming events. Add some to your calendar!</p>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* CAS Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-xl border border-border p-6"
      >
        <h3 className="font-heading font-semibold mb-4">CAS Categories Progress</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Creativity', color: 'bg-purple-500', count: projects.filter(p => p.category === 'creativity').length, hours: projects.filter(p => p.category === 'creativity').reduce((s, p) => s + (p.hours_logged || 0), 0) },
            { label: 'Activity', color: 'bg-emerald-500', count: projects.filter(p => p.category === 'activity').length, hours: projects.filter(p => p.category === 'activity').reduce((s, p) => s + (p.hours_logged || 0), 0) },
            { label: 'Service', color: 'bg-amber-500', count: projects.filter(p => p.category === 'service').length, hours: projects.filter(p => p.category === 'service').reduce((s, p) => s + (p.hours_logged || 0), 0) },
          ].map((cat) => (
            <div key={cat.label} className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                <span className="font-medium text-sm">{cat.label}</span>
              </div>
              <p className="text-2xl font-bold font-heading">{cat.hours.toFixed(1)}h</p>
              <p className="text-xs text-muted-foreground">{cat.count} project{cat.count !== 1 ? 's' : ''}</p>
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((cat.hours / 50) * 100, 100)}%` }}
                  transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
                  className={`h-full rounded-full ${cat.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
