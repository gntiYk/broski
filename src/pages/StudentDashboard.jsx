import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import SectionHeader from '@/components/shared/SectionHeader';
import StatCard from '@/components/shared/StatCard';
import {
  Clock, Target, Award, TrendingUp, BookOpen, Zap
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const COLORS = ['hsl(270, 60%, 58%)', 'hsl(160, 55%, 45%)', 'hsl(40, 80%, 55%)'];

const studyData = [
  { week: 'W1', hours: 8 }, { week: 'W2', hours: 12 }, { week: 'W3', hours: 10 },
  { week: 'W4', hours: 15 }, { week: 'W5', hours: 18 }, { week: 'W6', hours: 14 },
];

export default function StudentDashboard() {
  const { user } = useAuth();

  const { data: projects = [] } = useQuery({
    queryKey: ['my-projects'],
    queryFn: () => api.entities.Project.filter({ student_email: user?.email }, '-created_date', 50),
    enabled: !!user?.email,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => api.entities.Booking.filter({ student_email: user?.email }, '-created_date', 20),
    enabled: !!user?.email,
  });

  const totalHours = projects.reduce((s, p) => s + (p.hours_logged || 0), 0);
  const targetHours = 150;
  const progress = Math.min((totalHours / targetHours) * 100, 100);

  const categoryData = [
    { name: 'Creativity', value: projects.filter(p => p.category === 'creativity').reduce((s, p) => s + (p.hours_logged || 0), 0) },
    { name: 'Activity', value: projects.filter(p => p.category === 'activity').reduce((s, p) => s + (p.hours_logged || 0), 0) },
    { name: 'Service', value: projects.filter(p => p.category === 'service').reduce((s, p) => s + (p.hours_logged || 0), 0) },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader title="Student Hub" subtitle="Track your CAS progress and academic journey" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Clock} label="Total CAS Hours" value={totalHours.toFixed(1)} trend={8} color="primary" delay={0} />
        <StatCard icon={Target} label="Target Progress" value={`${progress.toFixed(0)}%`} color="accent" delay={0.1} />
        <StatCard icon={BookOpen} label="Sessions Booked" value={bookings.length} color="chart3" delay={0.2} />
        <StatCard icon={Award} label="Projects Completed" value={projects.filter(p => p.status === 'completed').length} color="chart4" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall progress ring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <h3 className="font-heading font-semibold mb-4">CAS Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData.filter(d => d.value > 0).length ? categoryData : [{ name: 'No data', value: 1 }]}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {categoryData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                <span className="text-muted-foreground">{d.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Study hours trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-card rounded-xl border border-border p-6"
        >
          <h3 className="font-heading font-semibold mb-4">Study Hours Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={studyData}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(235, 65%, 55%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(235, 65%, 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="hours" stroke="hsl(235, 65%, 55%)" fill="url(#colorHours)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Achievements + Timetable */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <h3 className="font-heading font-semibold mb-4">Achievements</h3>
          <div className="space-y-3">
            {[
              { icon: Zap, label: 'First CAS Hour Logged', unlocked: totalHours >= 1 },
              { icon: TrendingUp, label: '10 Hours Milestone', unlocked: totalHours >= 10 },
              { icon: Target, label: 'All Categories Started', unlocked: categoryData.every(c => c.value > 0) },
              { icon: Award, label: 'First Project Completed', unlocked: projects.some(p => p.status === 'completed') },
              { icon: BookOpen, label: 'First Tutoring Session', unlocked: bookings.some(b => b.status === 'completed') },
            ].map((a, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${a.unlocked ? 'bg-primary/5' : 'bg-muted/30 opacity-50'}`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${a.unlocked ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  <a.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{a.label}</span>
                {a.unlocked && <span className="ml-auto text-xs text-primary">✓ Unlocked</span>}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <h3 className="font-heading font-semibold mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {[
              { time: '08:00', title: 'Math Tutoring', type: 'tutoring' },
              { time: '10:30', title: 'CAS Reflection Writing', type: 'cas_work' },
              { time: '13:00', title: 'Community Service', type: 'cas_work' },
              { time: '15:00', title: 'Study Block', type: 'study' },
            ].map((slot, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                <span className="text-xs text-muted-foreground font-mono w-12">{slot.time}</span>
                <div className={`w-1 h-8 rounded-full ${
                  slot.type === 'tutoring' ? 'bg-primary' :
                  slot.type === 'cas_work' ? 'bg-accent' : 'bg-emerald-500'
                }`} />
                <span className="text-sm font-medium">{slot.title}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}