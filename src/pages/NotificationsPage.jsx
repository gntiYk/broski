import React from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import SectionHeader from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2, XCircle, Clock, AlertTriangle, MessageCircle, Bell, CheckCheck, Check, X
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const typeIcons = {
  booking: { icon: Bell, color: 'text-blue-500 bg-blue-500/10' },
  booking_approved: { icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
  booking_rejected: { icon: XCircle, color: 'text-destructive bg-destructive/10' },
  booking_status: { icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
  reminder: { icon: Clock, color: 'text-amber-500 bg-amber-500/10' },
  deadline: { icon: AlertTriangle, color: 'text-orange-500 bg-orange-500/10' },
  message: { icon: MessageCircle, color: 'text-primary bg-primary/10' },
  system: { icon: Bell, color: 'text-muted-foreground bg-muted' },
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', user?.email],
    queryFn: async () => {
      const allNotifications = await api.entities.Notification.list();
      // Filter notifications for this user (tutor or student)
      return allNotifications.filter(n => n.tutor_email === user?.email || n.student_email === user?.email);
    },
    enabled: !!user?.email,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings', user?.email],
    queryFn: () => api.entities.Booking.list(),
    enabled: !!user?.email,
  });

  const markRead = useMutation({
    mutationFn: (id) => api.entities.Notification.update(id, { read: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.read);
    for (const n of unread) {
      await api.entities.Notification.update(n.id, { read: true });
    }
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  const approveBooking = useMutation({
    mutationFn: (bookingId) => api.entities.Booking.update(bookingId, { status: 'approved' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Booking approved!');
    },
  });

  const rejectBooking = useMutation({
    mutationFn: (bookingId) => api.entities.Booking.update(bookingId, { status: 'rejected' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Booking rejected');
    },
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <SectionHeader
        title="Notifications"
        subtitle={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
        action={
          unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead}>
              <CheckCheck className="w-4 h-4 mr-2" /> Mark all read
            </Button>
          )
        }
      />

      <div className="space-y-2">
        {notifications.map((notif, i) => {
          const config = typeIcons[notif.type] || typeIcons.system;
          const Icon = config.icon;
          
          // Find related booking for action buttons
          const booking = notif.data?.booking_id ? bookings.find(b => b.id === notif.data.booking_id) : null;
          const showActions = notif.type === 'booking' && booking && booking.status === 'pending' && user?.role === 'tutor';

          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => !notif.read && markRead.mutate(notif.id)}
              className={`flex items-start gap-3 p-4 rounded-xl border border-border transition-colors cursor-pointer ${
                notif.read ? 'bg-card' : 'bg-primary/[0.02] border-primary/20'
              } hover:bg-muted/30`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm ${notif.read ? '' : 'font-medium'}`}>{notif.message}</p>
                  {!notif.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                </div>
                {booking && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {booking.subject} • {booking.date} • {booking.time_slot}
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground mt-1">
                  {notif.created_date ? format(new Date(notif.created_date), 'MMM d, h:mm a') : ''}
                </p>
                {showActions && (
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        approveBooking.mutate(booking.id);
                      }}
                      disabled={approveBooking.isPending}
                    >
                      <Check className="w-3 h-3 mr-1" /> Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        rejectBooking.mutate(booking.id);
                      }}
                      disabled={rejectBooking.isPending}
                    >
                      <X className="w-3 h-3 mr-1" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
        {notifications.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">All caught up!</p>
            <p className="text-sm mt-1">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
}