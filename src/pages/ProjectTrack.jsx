import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import SectionHeader from '@/components/shared/SectionHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
  Plus, Clock, Target, Palette, Activity, Heart,
  MoreVertical, Pencil, Trash2, PlusCircle, Calendar, Check,
  ChevronDown, ChevronUp, Sparkles, AlertCircle
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const CAS_TARGET = 150; // total CAS hours target
const CATEGORY_TARGET = 50; // per-category target

const categoryConfig = {
  creativity: { icon: Palette, color: 'bg-purple-500', bar: 'bg-purple-500', label: 'Creativity', text: 'text-purple-600', light: 'bg-purple-500/10' },
  activity:   { icon: Activity, color: 'bg-emerald-500', bar: 'bg-emerald-500', label: 'Activity',   text: 'text-emerald-600', light: 'bg-emerald-500/10' },
  service:    { icon: Heart,    color: 'bg-amber-500',  bar: 'bg-amber-500',  label: 'Service',    text: 'text-amber-600',  light: 'bg-amber-500/10' },
};

const defaultForm = {
  title: '', description: '', category: 'creativity',
  status: 'planning', hours_logged: 0, target_hours: 10,
  start_date: '', end_date: '', reflections: '',
};

export default function ProjectTrack() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [filter, setFilter] = useState('all');
  const [logHoursId, setLogHoursId] = useState(null);
  const [hoursToLog, setHoursToLog] = useState('');
  
  // Track expanded timeline project IDs. Default expand "p_finance"
  const [expandedTimelines, setExpandedTimelines] = useState(['p_finance']);

  // Fetch projects
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects', user?.email],
    queryFn: () => api.entities.Project.filter({ student_email: user?.email }, '-created_date', 200),
    enabled: !!user?.email,
  });

  const createProject = useMutation({
    mutationFn: (data) => api.entities.Project.create({ ...data, student_email: user?.email }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', user?.email] });
      setDialogOpen(false);
      toast.success('Project created successfully');
    },
  });

  const updateProject = useMutation({
    mutationFn: ({ id, data }) => api.entities.Project.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', user?.email] });
      setDialogOpen(false);
      setLogHoursId(null);
    },
  });

  const deleteProject = useMutation({
    mutationFn: (id) => api.entities.Project.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', user?.email] });
      toast.success('Project deleted');
    },
  });

  // Toggle expanded state for a project timeline
  const toggleTimeline = (projectId) => {
    setExpandedTimelines(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  // Toggle milestone status and auto-calculate hours
  const handleToggleMilestone = (project, milestoneId) => {
    if (!project.milestones) return;
    
    const updatedMilestones = project.milestones.map(m => {
      if (m.id === milestoneId) {
        let nextStatus = 'planned';
        if (m.status === 'planned') nextStatus = 'in_progress';
        else if (m.status === 'in_progress') nextStatus = 'completed';
        else if (m.status === 'completed') nextStatus = 'planned';
        return { ...m, status: nextStatus };
      }
      return m;
    });

    const completedCount = updatedMilestones.filter(m => m.status === 'completed').length;
    // Tying project milestones directly to logged hours: 10h per completed milestone
    const newHours = completedCount * 10;

    let newStatus = project.status;
    if (completedCount === updatedMilestones.length) {
      newStatus = 'completed';
    } else if (completedCount > 0) {
      newStatus = 'in_progress';
    } else {
      newStatus = 'planning';
    }

    updateProject.mutate({
      id: project.id,
      data: {
        milestones: updatedMilestones,
        hours_logged: newHours,
        status: newStatus
      }
    });

    toast.success(`Milestone updated! Hours recalculated to ${newHours}h.`);
  };

  // --- computed stats ---
  const hoursBy = (cat) =>
    projects.filter(p => p.category === cat).reduce((s, p) => s + (p.hours_logged || 0), 0);
  const creativityHours = hoursBy('creativity');
  const activityHours   = hoursBy('activity');
  const serviceHours    = hoursBy('service');
  const totalHours      = creativityHours + activityHours + serviceHours;
  const overallPct      = Math.min((totalHours / CAS_TARGET) * 100, 100);

  // --- handlers ---
  const openCreate = () => { setEditProject(null); setForm(defaultForm); setDialogOpen(true); };
  const openEdit   = (p)  => { setEditProject(p); setForm({ ...defaultForm, ...p }); setDialogOpen(true); };

  const handleSubmit = () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (editProject) {
      updateProject.mutate({ id: editProject.id, data: form });
      toast.success('Project updated');
    } else {
      createProject.mutate(form);
    }
  };

  const handleLogHours = () => {
    const h = parseFloat(hoursToLog);
    if (!h || h <= 0) { toast.error('Enter a valid number of hours'); return; }
    const project = projects.find(p => p.id === logHoursId);
    if (project) {
      updateProject.mutate({
        id: project.id,
        data: { hours_logged: (project.hours_logged || 0) + h },
      });
      toast.success(`Logged ${h} hours to ${project.title}`);
      setHoursToLog('');
    }
  };

  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <SectionHeader
        title="CAS Projects & Activities"
        subtitle="Log CAS hours, manage projects, and track your milestone timelines"
        action={<Button onClick={openCreate} className="bg-primary hover:bg-primary-hover"><Plus className="w-4 h-4 mr-2" /> New Project</Button>}
      />

      {/* ── Overall progress banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-xl border border-border p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-heading font-semibold text-base">Overall CAS Progress</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Target: {CAS_TARGET} total hours</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-heading font-extrabold gradient-text">{totalHours.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground"> / {CAS_TARGET}h</span>
          </div>
        </div>
        <Progress value={overallPct} className="h-3 mb-6" />

        {/* Per-category bars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(['creativity', 'activity', 'service']).map((cat) => {
            const cfg = categoryConfig[cat];
            const hrs = hoursBy(cat);
            const pct = Math.min((hrs / CATEGORY_TARGET) * 100, 100);
            return (
              <div key={cat} className={`rounded-lg p-4 ${cfg.light}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-md ${cfg.color} flex items-center justify-center`}>
                    <cfg.icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className={`text-xs font-semibold ${cfg.text}`}>{cfg.label}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{hrs.toFixed(1)} / {CATEGORY_TARGET}h</span>
                </div>
                <div className="h-2 rounded-full bg-black/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${cfg.bar}`}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{pct.toFixed(0)}% complete</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Filter tabs ── */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'creativity', 'activity', 'service']).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize"
          >
            {f === 'all' ? 'All Projects' : categoryConfig[f]?.label}
          </Button>
        ))}
      </div>

      {/* ── Projects Grid ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-5 h-44 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No projects yet</p>
          <p className="text-sm mt-1">Create your first CAS project to start logging hours</p>
          <Button className="mt-4" onClick={openCreate}><PlusCircle className="w-4 h-4 mr-2" /> Create Project</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => {
              const cat = categoryConfig[project.category] || categoryConfig.creativity;
              const progress = project.target_hours
                ? Math.min((project.hours_logged / project.target_hours) * 100, 100)
                : 0;
              const isTimelineOpen = expandedTimelines.includes(project.id);
              const hasMilestones = !!project.milestones;

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    {/* Header: Title and details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-8 h-8 rounded-lg ${cat.color} flex items-center justify-center flex-shrink-0`}>
                          <cat.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className={`text-xs font-semibold ${cat.text} uppercase tracking-wider`}>{cat.label}</span>
                        {hasMilestones && (
                          <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium flex items-center gap-1 font-sans">
                            <Sparkles className="w-3 h-3 text-primary" /> Long-term Timeline
                          </span>
                        )}
                      </div>

                      <h4 className="font-heading font-semibold text-lg leading-snug">{project.title}</h4>
                      {project.description && (
                        <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">{project.description}</p>
                      )}
                    </div>

                    {/* Actions and status */}
                    <div className="flex items-center gap-3 self-end md:self-start">
                      <span className={`text-xs px-2.5 py-1 rounded-full capitalize font-semibold ${
                        project.status === 'completed'  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                        project.status === 'in_progress'? 'bg-primary/10 text-primary border border-primary/20'         :
                        project.status === 'paused'     ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'     :
                                                          'bg-muted text-muted-foreground border border-border'
                      }`}>
                        {project.status?.replace('_', ' ')}
                      </span>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-muted-foreground hover:text-foreground p-1.5 rounded-md border border-border hover:bg-muted/50 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setLogHoursId(project.id); setHoursToLog(''); }}>
                            <Clock className="w-3.5 h-3.5 mr-2" /> Log Hours
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(project)}>
                            <Pencil className="w-3.5 h-3.5 mr-2" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteProject.mutate(project.id)} className="text-destructive">
                            <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Progress segment */}
                  <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 py-2 border-y border-border/40">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold block mb-0.5">Timeline Dates</span>
                      <span className="text-xs font-medium text-foreground">{project.start_date || 'N/A'} to {project.end_date || 'N/A'}</span>
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground font-semibold">
                          {(project.hours_logged || 0).toFixed(1)}h logged
                        </span>
                        <span className="font-semibold text-primary">
                          {progress.toFixed(0)}% of {project.target_hours || 10}h target
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </div>

                  {/* Timeline steppers block */}
                  {hasMilestones && (
                    <div className="mt-2">
                      <button
                        onClick={() => toggleTimeline(project.id)}
                        className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
                      >
                        {isTimelineOpen ? (
                          <>
                            <ChevronUp className="w-4 h-4" /> Hide Interactive Timeline
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" /> Show Interactive Timeline ({project.milestones.filter(m => m.status === 'completed').length}/{project.milestones.length} done)
                          </>
                        )}
                      </button>

                      <AnimatePresence>
                        {isTimelineOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-6 pb-2 pl-4 pr-2 space-y-6 relative border-l border-dashed border-border/80 ml-3.5 my-3">
                              <p className="text-[10px] text-muted-foreground italic flex items-center gap-1 -mt-2 mb-4 bg-muted/40 p-2 rounded border border-border/40 max-w-sm">
                                <AlertCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" /> Click any step below to change its progress state!
                              </p>

                              {project.milestones.map((m) => {
                                const isDone = m.status === 'completed';
                                const isInProgress = m.status === 'in_progress';
                                
                                return (
                                  <motion.div
                                    key={m.id}
                                    whileHover={{ x: 3 }}
                                    onClick={() => handleToggleMilestone(project, m.id)}
                                    className="flex items-start gap-4 relative group cursor-pointer"
                                  >
                                    {/* Icon / dot */}
                                    <div className="absolute -left-[27px] top-0.5 z-10 flex items-center justify-center">
                                      {isDone ? (
                                        <div className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center shadow-sm">
                                          <Check className="w-3 h-3 text-white stroke-[3px]" />
                                        </div>
                                      ) : isInProgress ? (
                                        <div className="w-5 h-5 rounded-full bg-primary border-2 border-background flex items-center justify-center animate-pulse shadow">
                                          <Clock className="w-3 h-3 text-white" />
                                        </div>
                                      ) : (
                                        <div className="w-5 h-5 rounded-full bg-muted border-2 border-border flex items-center justify-center group-hover:border-primary transition-colors" />
                                      )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className={`text-xs font-semibold ${
                                          isDone ? 'text-emerald-600 dark:text-emerald-400 line-through' :
                                          isInProgress ? 'text-primary font-bold' :
                                          'text-muted-foreground'
                                        }`}>
                                          {m.title}
                                        </span>
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                                          isDone ? 'bg-emerald-500/10 text-emerald-600' :
                                          isInProgress ? 'bg-primary/10 text-primary animate-pulse' :
                                          'bg-muted text-muted-foreground'
                                        }`}>
                                          {m.status}
                                        </span>
                                      </div>
                                      <p className="text-[10px] text-muted-foreground mt-0.5">Timeline target: {m.due}</p>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Reflections block if present */}
                  {project.reflections && (
                    <div className="text-xs bg-muted/40 rounded-lg p-3 border border-border/40">
                      <span className="font-semibold text-primary block mb-1">Reflections</span>
                      <p className="text-muted-foreground italic leading-relaxed">"{project.reflections}"</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ── Create / Edit Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">{editProject ? 'Edit CAS Project' : 'New CAS Project'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input
              placeholder="Project title *"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
            <Textarea
              placeholder="Description"
              rows={3}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Category</label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="creativity">Creativity</SelectItem>
                    <SelectItem value="activity">Activity</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Target hours</label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.target_hours}
                  onChange={e => setForm({ ...form, target_hours: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Hours logged so far</label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.hours_logged}
                  onChange={e => setForm({ ...form, hours_logged: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Start date</label>
                <Input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">End / due date</label>
                <Input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Reflections</label>
              <Textarea
                placeholder="What did you learn? What would you do differently?"
                rows={3}
                value={form.reflections}
                onChange={e => setForm({ ...form, reflections: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={createProject.isPending || updateProject.isPending}>
              {(createProject.isPending || updateProject.isPending) ? 'Saving…' : editProject ? 'Update' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Log Hours Dialog ── */}
      <Dialog open={!!logHoursId} onOpenChange={() => setLogHoursId(null)}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle className="font-heading">Log Hours</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Adding hours to: <span className="font-medium text-foreground">
              {projects.find(p => p.id === logHoursId)?.title}
            </span>
          </p>
          <div className="py-2">
            <Input
              type="number"
              step="0.5"
              min="0.5"
              placeholder="e.g. 1.5"
              value={hoursToLog}
              onChange={e => setHoursToLog(e.target.value)}
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleLogHours()}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Current total: {(projects.find(p => p.id === logHoursId)?.hours_logged || 0).toFixed(1)}h
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLogHoursId(null)}>Cancel</Button>
            <Button onClick={handleLogHours} disabled={updateProject.isPending}>
              {updateProject.isPending ? 'Saving…' : 'Add Hours'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}