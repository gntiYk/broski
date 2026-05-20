import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, trend, color = 'primary', delay = 0 }) {
  const colorClasses = {
    primary: 'from-primary/10 to-primary/5 text-primary',
    accent: 'from-accent/10 to-accent/5 text-accent',
    chart3: 'from-emerald-500/10 to-emerald-500/5 text-emerald-600',
    chart4: 'from-amber-500/10 to-amber-500/5 text-amber-600',
    destructive: 'from-destructive/10 to-destructive/5 text-destructive',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="bg-card rounded-xl border border-border p-5 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <p className="text-2xl font-bold font-heading mt-1">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend > 0 ? 'text-emerald-600' : 'text-destructive'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week
            </p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}