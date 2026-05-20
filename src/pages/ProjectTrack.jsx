import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import SectionHeader from '@/components/shared/SectionHeader';
import { Progress } from '@/components/ui/progress';
import { Users, DollarSign, Target, Briefcase, Calendar, Activity, ChevronRight, CheckCircle2 } from 'lucide-react';

const mockFinance = {
  totalBudget: 500000,
  funding: [
    { source: 'School Grant', amount: 300000, date: '2026-05-02' },
    { source: 'Bake Sale Fundraiser', amount: 150000, date: '2026-05-15' },
    { source: 'Personal Contribution', amount: 50000, date: '2026-05-18' }
  ],
  expenses: [
    { item: 'Tree Saplings (x50)', amount: 250000, date: '2026-05-10' },
    { item: 'Gardening Tools', amount: 120000, date: '2026-05-12' },
    { item: 'Fertilizer & Soil', amount: 80000, date: '2026-05-13' }
  ]
};

const mockMembers = [
  { name: 'Gantigmaa T.', role: 'Project Leader', avatar: 'GT' },
  { name: 'Zorigt S.', role: 'Supervisor (Tutor)', avatar: 'ZS' },
  { name: 'Bat-Erdene', role: 'Treasurer', avatar: 'BE' },
  { name: 'Khulan B.', role: 'Volunteer Coordinator', avatar: 'KB' }
];

export default function ProjectTrack() {
  const { user } = useAuth();

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
    milestones: [
      {id: 'm1', title: 'Хөрс бэлтгэх, цэцэрлэг төлөвлөх', status: 'completed'},
      {id: 'm2', title: 'Модны суулгац, багаж хэрэгсэл бэлтгэх', status: 'completed'},
      {id: 'm3', title: 'Эхний ээлжийн моддыг суулгах', status: 'in_progress'},
      {id: 'm4', title: 'Зүлэгжүүлэлт, зүлэгний үр суулгах', status: 'planned'},
      {id: 'm5', title: 'Төслийн үр дүнгийн тайлан, зургийг нэгтгэх', status: 'planned'}
    ]
  };

  const totalSpent = mockFinance.expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalFunding = mockFinance.funding.reduce((sum, f) => sum + f.amount, 0);
  const remainingBudget = totalFunding - totalSpent;
  const budgetSpentPct = Math.min((totalSpent / totalFunding) * 100, 100);

  const formatMoney = (amount) => new Intl.NumberFormat('mn-MN', { style: 'currency', currency: 'MNT' }).format(amount);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <SectionHeader title="Project Dashboard" />

      {isLoading ? (
        <div className="bg-card rounded-2xl border border-border p-8 h-96 animate-pulse" />
      ) : (
        <div className="space-y-6">
          {/* Main Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border p-8 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-amber-500" />
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-2">
                <div className="text-amber-600 dark:text-amber-400">
                  <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                    <Target className="w-3.5 h-3.5" /> Service Project
                  </span>
                </div>
                <h3 className="font-heading font-extrabold text-3xl tracking-tight text-foreground">
                  {greenProject.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                  {greenProject.description}
                </p>
              </div>
              <div className="flex items-center gap-2 self-start">
                <span className="text-xs px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold uppercase tracking-wider">
                  {greenProject.status === 'in_progress' ? 'Active' : greenProject.status}
                </span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Finance & Members */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Finance Tracking Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl border border-border p-6 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-6">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-heading font-bold text-lg">Finance Tracking</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Total Funding</p>
                    <p className="text-xl font-heading font-bold text-emerald-600 dark:text-emerald-400">{formatMoney(totalFunding)}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Total Spent</p>
                    <p className="text-xl font-heading font-bold text-destructive">{formatMoney(totalSpent)}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Remaining Balance</p>
                    <p className="text-xl font-heading font-bold text-primary">{formatMoney(remainingBudget)}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-semibold text-muted-foreground">Budget Utilization</span>
                    <span className="font-bold">{budgetSpentPct.toFixed(0)}%</span>
                  </div>
                  <Progress value={budgetSpentPct} className="h-2 bg-muted" indicatorClassName="bg-emerald-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-emerald-500" /> Funding Sources</h4>
                    <div className="space-y-3">
                      {mockFinance.funding.map((f, i) => (
                        <div key={i} className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                          <span className="text-muted-foreground">{f.source}</span>
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">+{formatMoney(f.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-1.5"><Activity className="w-4 h-4 text-destructive" /> Expenses Log</h4>
                    <div className="space-y-3">
                      {mockFinance.expenses.map((e, i) => (
                        <div key={i} className="flex justify-between items-center text-sm border-b border-border/50 pb-2">
                          <span className="text-muted-foreground">{e.item}</span>
                          <span className="font-medium text-destructive">-{formatMoney(e.amount)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Project Members Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl border border-border p-6 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Users className="w-5 h-5 text-blue-500" />
                  <h3 className="font-heading font-bold text-lg">Team Members & Roles</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mockMembers.map((member, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm shadow-sm">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>

            {/* Right Column: Timeline & Meta */}
            <div className="space-y-6">
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card rounded-2xl border border-border p-6 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h3 className="font-heading font-bold text-lg">Timeline</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-1">Project Duration</span>
                    <span className="text-sm font-medium">{greenProject.start_date} to {greenProject.end_date}</span>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t border-border/50">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold block mb-4">Milestones</span>
                    <div className="space-y-0 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                      {greenProject.milestones?.map((m, i) => (
                        <div key={m.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active pb-6 last:pb-0">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-background bg-muted text-muted-foreground shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow flex-none">
                            {m.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                            {m.status === 'in_progress' && <Activity className="w-3 h-3 text-primary animate-pulse" />}
                          </div>
                          <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] px-4 py-2 rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm">
                            <p className={`text-xs font-medium ${m.status === 'completed' ? 'text-muted-foreground line-through' : m.status === 'in_progress' ? 'text-primary font-bold' : ''}`}>
                              {m.title}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}