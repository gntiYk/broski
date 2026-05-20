import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import SectionHeader from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { toast } from 'sonner';

const typeColors = {
  study: 'bg-primary/80',
  tutoring: 'bg-emerald-500',
  cas_work: 'bg-purple-500',
  deadline: 'bg-destructive',
  reminder: 'bg-amber-500',
  personal: 'bg-muted-foreground',
};

export default function CalendarPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'study', start_time: '', end_time: '', description: '' });

  const { data: events = [] } = useQuery({
    queryKey: ['calendar-events'],
    queryFn: () => api.entities.CalendarEvent.filter({ user_email: user?.email }, '-date', 200),
    enabled: !!user?.email,
  });

  const createEvent = useMutation({
    mutationFn: (data) => api.entities.CalendarEvent.create({ ...data, user_email: user?.email }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['calendar-events'] }); setDialogOpen(false); toast.success('Event created'); },
  });

  const deleteEvent = useMutation({
    mutationFn: (id) => api.entities.CalendarEvent.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['calendar-events'] }),
  });

  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start, end });
  const startDay = start.getDay();
  const paddingDays = Array.from({ length: startDay }, (_, i) => null);

  const getEventsForDate = (date) => events.filter(e => e.date && isSameDay(new Date(e.date), date));

  const handleAddEvent = () => {
    if (!form.title || !selectedDate) { toast.error('Title and date required'); return; }
    createEvent.mutate({ ...form, date: format(selectedDate, 'yyyy-MM-dd') });
    setForm({ title: '', type: 'study', start_time: '', end_time: '', description: '' });
  };

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        title="Calendar"
        subtitle="Schedule study blocks, CAS sessions, and deadlines"
        action={
          <Button onClick={() => { setSelectedDate(new Date()); setDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Add Event
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-card rounded-xl border border-border p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="font-heading font-semibold text-lg">{format(currentDate, 'MMMM yyyy')}</h3>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-px">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-xs font-medium text-muted-foreground text-center py-2">{d}</div>
            ))}
            {paddingDays.map((_, i) => <div key={`pad-${i}`} />)}
            {days.map((day) => {
              const dayEvents = getEventsForDate(day);
              const selected = selectedDate && isSameDay(day, selectedDate);
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`relative aspect-square p-1 rounded-lg text-sm transition-all hover:bg-muted/50 flex flex-col items-center ${
                    selected ? 'bg-primary/10 ring-1 ring-primary' :
                    isToday(day) ? 'bg-accent/10' : ''
                  }`}
                >
                  <span className={`text-xs ${isToday(day) ? 'w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center' : ''}`}>
                    {format(day, 'd')}
                  </span>
                  {dayEvents.length > 0 && (
                    <div className="flex gap-0.5 mt-1">
                      {dayEvents.slice(0, 3).map((e, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${typeColors[e.type] || 'bg-primary'}`} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Day Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold">
              {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Select a date'}
            </h3>
            {selectedDate && (
              <Button size="sm" variant="outline" onClick={() => setDialogOpen(true)}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add
              </Button>
            )}
          </div>
          {selectedEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No events for this day</p>
          ) : (
            <div className="space-y-2">
              {selectedEvents.map((event) => (
                <div key={event.id} className="p-3 rounded-lg border border-border hover:bg-muted/20 transition-colors group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${typeColors[event.type] || 'bg-primary'}`} />
                      <span className="text-sm font-medium">{event.title}</span>
                    </div>
                    <button
                      onClick={() => deleteEvent.mutate(event.id)}
                      className="text-xs text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                  {event.start_time && (
                    <p className="text-xs text-muted-foreground mt-1 ml-4">
                      {event.start_time}{event.end_time ? ` – ${event.end_time}` : ''}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">Event Types</p>
            <div className="grid grid-cols-2 gap-1">
              {Object.entries(typeColors).map(([type, color]) => (
                <div key={type} className="flex items-center gap-1.5 text-[10px]">
                  <div className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="capitalize text-muted-foreground">{type.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add Event Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading">Add Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Input placeholder="Event title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="study">Study</SelectItem>
                <SelectItem value="tutoring">Tutoring</SelectItem>
                <SelectItem value="cas_work">CAS Work</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <Input type="time" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} />
              <Input type="time" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddEvent}>Add Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}