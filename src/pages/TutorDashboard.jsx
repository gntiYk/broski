import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import SectionHeader from '@/components/shared/SectionHeader';
import StatCard from '@/components/shared/StatCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Users, Clock, CheckCircle2, XCircle, Calendar, TrendingUp,
  Palette, Activity, Heart, Sparkles, Plus, PlusCircle, Check, X
} from 'lucide-react';
import { toast } from 'sonner';

const CAS_TARGET = 150;
const CATEGORY_TARGET = 50;

export default function TutorDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Booking states
  const { data: bookings = [] } = useQuery({
    queryKey: ['tutor-bookings'],
    queryFn: () => api.entities.Booking.filter({ tutor_email: user?.email }, '-created_date', 50),
    enabled: !!user?.email,
  });

  // Projects states
  const { data: projects = [] } = useQuery({
    queryKey: ['projects', user?.email],
    queryFn: () => api.entities.Project.filter({ student_email: user?.email }, '-created_date', 200),
    enabled: !!user?.email,
  });

  const updateBooking = useMutation({
    mutationFn: ({ id, data }) => api.entities.Booking.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutor-bookings'] });
      toast.success('Booking status updated');
    },
  });

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const approvedBookings = bookings.filter(b => b.status === 'approved');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  const handleAction = (id, status) => {
    updateBooking.mutate({ id, data: { status } });
  };

  // --- Manual CAS Logging State ---
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logForm, setLogForm] = useState({
    title: '',
    category: 'creativity',
    hours_logged: 3,
    reflections: '',
    start_date: new Date().toISOString().split('T')[0]
  });

  const handleManualLogSubmit = async (e) => {
    e.preventDefault();
    if (!logForm.title.trim()) {
      toast.error('Please enter what activity you did.');
      return;
    }
    if (logForm.hours_logged <= 0) {
      toast.error('Please enter a positive number of hours.');
      return;
    }

    try {
      await api.entities.Project.create({
        ...logForm,
        student_email: user?.email,
        status: 'completed',
        target_hours: logForm.hours_logged,
        description: `Manually logged CAS activity: ${logForm.title}`
      });
      
      // Invalidate queries to refresh statistical calculations
      queryClient.invalidateQueries({ queryKey: ['projects', user?.email] });
      toast.success(`Logged ${logForm.hours_logged} hours of ${logForm.title} successfully!`);
      
      // Reset form
      setLogForm({
        title: '',
        category: 'creativity',
        hours_logged: 3,
        reflections: '',
        start_date: new Date().toISOString().split('T')[0]
      });
      setIsLogModalOpen(false);
    } catch (err) {
      toast.error('Failed to log manual CAS hours.');
    }
  };

  // Compute CAS hours
  const creativityHours = projects.filter(p => p.category === 'creativity').reduce((s, p) => s + (p.hours_logged || 0), 0);
  const activityHours   = projects.filter(p => p.category === 'activity').reduce((s, p) => s + (p.hours_logged || 0), 0);
  
  // Service hours = logged projects service hours + completed tutoring sessions (1.5 hours each)
  const serviceProjectHours = projects.filter(p => p.category === 'service').reduce((s, p) => s + (p.hours_logged || 0), 0);
  const tutoringServiceHours = completedBookings.length * 1.5;
  const serviceHours = serviceProjectHours + tutoringServiceHours;

  const totalHours = creativityHours + activityHours + serviceHours;
  const overallPct = Math.min((totalHours / CAS_TARGET) * 100, 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <SectionHeader 
        title="Tutor" 
        action={
          <Button onClick={() => setIsLogModalOpen(true)} className="bg-primary hover:bg-primary-hover flex items-center gap-1.5 shadow-sm text-xs font-semibold">
            <Plus className="w-4 h-4" /> Log CAS Hours Manually
          </Button>
        }
      />

      {/* CAS Progress Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-xl border border-border p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-heading font-semibold text-base flex items-center gap-2">
              Total Hours
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Зорилго: {CAS_TARGET} цаг биелүүлэх (тус бүр 50 цаг)</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-heading font-extrabold gradient-text">{totalHours.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground"> / {CAS_TARGET}ц</span>
          </div>
        </div>
        <Progress value={overallPct} className="h-3 mb-6" />

        {/* Per-category bars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg p-4 bg-purple-500/10 border border-purple-500/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-purple-600">Creativity</span>
              <span className="ml-auto text-xs text-muted-foreground">{creativityHours.toFixed(1)} / {CATEGORY_TARGET}ц</span>
            </div>
            <Progress value={Math.min((creativityHours / CATEGORY_TARGET) * 100, 100)} className="h-1.5 bg-purple-500/20" indicatorClassName="bg-purple-500" />
            <p className="text-[10px] text-muted-foreground mt-1">{Math.min((creativityHours / CATEGORY_TARGET) * 100, 100).toFixed(0)}% биелсэн</p>
          </div>

          <div className="rounded-lg p-4 bg-emerald-500/10 border border-emerald-500/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-emerald-600">Activity</span>
              <span className="ml-auto text-xs text-muted-foreground">{activityHours.toFixed(1)} / {CATEGORY_TARGET}ц</span>
            </div>
            <Progress value={Math.min((activityHours / CATEGORY_TARGET) * 100, 100)} className="h-1.5 bg-emerald-500/20" indicatorClassName="bg-emerald-500" />
            <p className="text-[10px] text-muted-foreground mt-1">{Math.min((activityHours / CATEGORY_TARGET) * 100, 100).toFixed(0)}% биелсэн</p>
          </div>

          <div className="rounded-lg p-4 bg-amber-500/10 border border-amber-500/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-amber-600">Service</span>
              <span className="ml-auto text-xs text-muted-foreground">{serviceHours.toFixed(1)} / {CATEGORY_TARGET}ц</span>
            </div>
            <Progress value={Math.min((serviceHours / CATEGORY_TARGET) * 100, 100)} className="h-1.5 bg-amber-500/20" indicatorClassName="bg-amber-500" />
            <div className="flex justify-between items-center mt-1">
              <p className="text-[10px] text-muted-foreground">{Math.min((serviceHours / CATEGORY_TARGET) * 100, 100).toFixed(0)}% биелсэн</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Pending Requests" value={pendingBookings.length} color="chart4" delay={0} />
        <StatCard icon={Calendar} label="Upcoming Sessions" value={approvedBookings.length} color="primary" delay={0.1} />
        <StatCard icon={CheckCircle2} label="Completed" value={completedBookings.length} color="chart3" delay={0.2} />
        <StatCard icon={TrendingUp} label="Total Sessions" value={bookings.length} color="accent" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <h3 className="font-heading font-semibold mb-4">Pending Requests</h3>
          {pendingBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No pending requests</p>
          ) : (
            <div className="space-y-3">
              {pendingBookings.map((booking, i) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/20 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{booking.student_name || 'Student'}</p>
                    <p className="text-xs text-muted-foreground">{booking.subject} · {booking.date} · {booking.time_slot}</p>
                    {booking.notes && <p className="text-xs text-muted-foreground mt-1 italic">"{booking.notes}"</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAction(booking.id, 'approved')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(booking.id, 'rejected')}
                      className="text-destructive border-destructive/30 hover:bg-destructive/10"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Upcoming Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <h3 className="font-heading font-semibold mb-4">Upcoming Sessions</h3>
          {approvedBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No upcoming sessions</p>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {approvedBookings.map((booking, i) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-lg border border-border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{booking.student_name || 'Student'}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{booking.subject}</p>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-0 text-xs">
                      Approved
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{booking.date}</span>
                    <Clock className="w-3.5 h-3.5 ml-2" />
                    <span>{booking.time_slot}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 w-full text-xs"
                    onClick={() => handleAction(booking.id, 'completed')}
                  >
                    Mark Completed
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* MANUAL CAS LOGGER OVERLAY MODAL */}
      <AnimatePresence>
        {isLogModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="relative bg-card border border-border w-full max-w-md rounded-2xl p-6 shadow-2xl overflow-hidden"
            >
              <div className="absolute left-0 top-0 right-0 h-1.5 bg-gradient-to-r from-primary to-accent" />
              
              <div className="flex justify-between items-center mb-4 mt-2">
                <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-primary" /> Log CAS Hours Manually
                </h3>
                <button onClick={() => setIsLogModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleManualLogSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">What did you do? *</label>
                  <Input
                    placeholder="e.g. Drawing and Painting / Soccer Practice"
                    value={logForm.title}
                    onChange={e => setLogForm({ ...logForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Category</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={logForm.category}
                      onChange={e => setLogForm({ ...logForm, category: e.target.value })}
                    >
                      <option value="creativity">Creativity</option>
                      <option value="activity">Activity</option>
                      <option value="service">Service</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Hours Spent</label>
                    <Input
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={logForm.hours_logged}
                      onChange={e => setLogForm({ ...logForm, hours_logged: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Date</label>
                    <Input
                      type="date"
                      value={logForm.start_date}
                      onChange={e => setLogForm({ ...logForm, start_date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">Reflections / Description</label>
                  <Textarea
                    placeholder="What did you learn? What skills did you practice?"
                    rows={3}
                    value={logForm.reflections}
                    onChange={e => setLogForm({ ...logForm, reflections: e.target.value })}
                  />
                </div>

                <div className="flex gap-2 justify-end pt-3">
                  <Button variant="outline" type="button" onClick={() => setIsLogModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary-hover">
                    Log Hours
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}