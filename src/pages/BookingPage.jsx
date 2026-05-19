import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import SectionHeader from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar, Clock, BookOpen, Plus
} from 'lucide-react';
import { toast } from 'sonner';

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'CAS Planning', 'Extended Essay', 'TOK'];

const statusColors = {
  pending: 'bg-amber-500/10 text-amber-600',
  approved: 'bg-emerald-500/10 text-emerald-600',
  rejected: 'bg-destructive/10 text-destructive',
  completed: 'bg-primary/10 text-primary',
  cancelled: 'bg-muted text-muted-foreground',
};

export default function BookingPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ tutor_email: '', subject: '', date: '', time_slot: '', notes: '' });

  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => api.entities.Booking.list('-created_date', 50),
  });

  const { data: tutors = [] } = useQuery({
    queryKey: ['tutors'],
    queryFn: async () => {
      const users = await api.entities.User.list();
      return users.filter(u => u.role === 'tutor');
    },
  });

  const createBooking = useMutation({
    mutationFn: (data) => api.entities.Booking.create({
      ...data,
      student_email: user?.email,
      student_name: user?.full_name,
      status: 'pending',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setDialogOpen(false);
      setForm({ tutor_email: '', subject: '', date: '', time_slot: '', notes: '' });
      toast.success('Booking request sent!');
    },
  });

  const myBookings = bookings.filter(b => b.student_email === user?.email || b.tutor_email === user?.email);

  const handleSubmit = () => {
    if (!form.subject || !form.date || !form.time_slot) {
      toast.error('Please fill all required fields');
      return;
    }
    const tutor = tutors.find(t => t.email === form.tutor_email);
    createBooking.mutate({
      ...form,
      tutor_name: tutor?.full_name || 'Tutor',
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        title="Booking"
        subtitle="Schedule tutoring sessions with available tutors"
        action={<Button onClick={() => setDialogOpen(true)}><Plus className="w-4 h-4 mr-2" /> Book Session</Button>}
      />

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        {['upcoming', 'past', 'all'].map((tab) => {
          const filtered = tab === 'all' ? myBookings :
            tab === 'upcoming' ? myBookings.filter(b => ['pending', 'approved'].includes(b.status)) :
            myBookings.filter(b => ['completed', 'rejected', 'cancelled'].includes(b.status));
          return (
            <TabsContent key={tab} value={tab}>
              {filtered.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No bookings here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map((booking, i) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-card rounded-xl border border-border p-5 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-heading font-semibold text-sm">{booking.subject}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            with {booking.student_email === user?.email ? booking.tutor_name : booking.student_name}
                          </p>
                        </div>
                        <Badge className={`${statusColors[booking.status]} border-0 text-[10px]`}>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{booking.time_slot}</span>
                        </div>
                      </div>
                      {booking.notes && (
                        <p className="text-xs text-muted-foreground mt-3 italic border-t border-border pt-2">"{booking.notes}"</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Booking Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Book a Tutoring Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {tutors.length > 0 && (
              <Select value={form.tutor_email} onValueChange={v => setForm({ ...form, tutor_email: v })}>
                <SelectTrigger><SelectValue placeholder="Select tutor" /></SelectTrigger>
                <SelectContent>
                  {tutors.map(t => (
                    <SelectItem key={t.id} value={t.email}>{t.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={form.subject} onValueChange={v => setForm({ ...form, subject: v })}>
              <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
              <SelectContent>
                {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            <Select value={form.time_slot} onValueChange={v => setForm({ ...form, time_slot: v })}>
              <SelectTrigger><SelectValue placeholder="Select time slot" /></SelectTrigger>
              <SelectContent>
                {timeSlots.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Textarea placeholder="Additional notes (optional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Send Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}