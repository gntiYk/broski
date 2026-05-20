import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import SectionHeader from '@/components/shared/SectionHeader';

export default function ProjectTrack() {
  const { user } = useAuth();

  // Fetch only the preloaded projects
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects', user?.email],
    queryFn: () => api.entities.Project.filter({ student_email: user?.email }),
    enabled: !!user?.email,
  });

  const greenProject = projects.find(p => p.title.includes('Шинэ Үе ногоон төгөл')) || {
    title: 'Шинэ Үе ногоон төгөл',
    description: 'Сургуулийнхаа цэцэрлэгт мод тарьж нийгмийн тустай үйлс хийх төсөл.',
    category: 'service',
    status: 'in_progress',
    start_date: '2026-05-01',
    end_date: '2026-06-30',
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <SectionHeader title="Project Focus" />

      {isLoading ? (
        <div className="bg-card rounded-2xl border border-border p-8 h-64 animate-pulse" />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card rounded-2xl border border-border p-8 shadow-md relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-amber-500" />
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
            <div className="space-y-2">
              <div className="text-amber-600 dark:text-amber-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Service Project</span>
              </div>
              <h3 className="font-heading font-extrabold text-2xl tracking-tight text-foreground">
                {greenProject.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                {greenProject.description}
              </p>
            </div>
            
            <div className="flex items-center gap-2 self-start">
              <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold uppercase tracking-wider">
                {greenProject.status === 'in_progress' ? 'Идэвхтэй' : greenProject.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-border/60">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Төслийн хугацаа</span>
              <span className="text-sm font-medium">{greenProject.start_date} - {greenProject.end_date}</span>
            </div>

            <div>
              <span className="text-[10px] text-muted-foreground uppercase font-bold block">Хариуцагч сургууль</span>
              <span className="text-sm font-medium">Шинэ Үе сургууль</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}