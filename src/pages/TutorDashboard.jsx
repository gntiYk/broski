import React from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import SectionHeader from '@/components/shared/SectionHeader';
import StatCard from '@/components/shared/StatCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users, Clock, CheckCircle2, XCircle, Calendar, TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

export default function TutorDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: bookings = [] } = useQuery({
    queryKey: ['tutor-bookings'],
    queryFn: () => api.entities.Booking.filter({ tutor_email: user?.email }, '-created_date', 50),
    enabled: !!user?.email,
  });

  const updateBooking = useMutation({
    mutationFn: ({ id, data }) => api.entities.Booking.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutor-bookings'] });
      toast.success('Booking updated');
    },
  });

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const approvedBookings = bookings.filter(b => b.status === 'approved');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  const handleAction = (id, status) => {
    updateBooking.mutate({ id, data: { status } });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader title="Tutor Hub" subtitle="Manage your tutoring sessions and availability" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Pending Requests" value={pendingBookings.length} color="chart4" delay={0} />
        <StatCard icon={Calendar} label="Upcoming Sessions" value={approvedBookings.length} color="primary" delay={0.1} />
        <StatCard icon={CheckCircle2} label="Completed" value={completedBookings.length} trend={15} color="chart3" delay={0.2} />
        <StatCard icon={TrendingUp} label="Total Sessions" value={bookings.length} color="accent" delay={0.3} />
      </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
  );
}