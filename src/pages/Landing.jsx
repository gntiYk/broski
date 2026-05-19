import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Sparkles, ArrowRight, BookOpen, FolderKanban, CalendarDays,
  Bot, Users, TrendingUp, Star, GraduationCap
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] } }),
};

const features = [
  { icon: FolderKanban, title: 'CAS Project Tracking', desc: 'Log hours, track progress across Creativity, Activity, and Service categories' },
  { icon: BookOpen, title: 'Tutor Booking', desc: 'Schedule sessions with available tutors and get academic help when you need it' },
  { icon: CalendarDays, title: 'Smart Calendar', desc: 'Plan study blocks, CAS work, deadlines, and tutoring sessions in one place' },
  { icon: Bot, title: 'AI Assistant', desc: 'Get personalized CAS advice, project ideas, and study planning from AI' },
  { icon: Users, title: 'Student-Tutor Chat', desc: 'Communicate directly with tutors for guidance and session coordination' },
  { icon: TrendingUp, title: 'Analytics Dashboard', desc: 'Visualize your progress with beautiful charts and achievement tracking' },
];

const stats = [
  { value: '500+', label: 'Students Active' },
  { value: '150+', label: 'CAS Hours Logged' },
  { value: '50+', label: 'Tutors Available' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const testimonials = [
  { name: 'Sarah M.', role: 'IB Student', text: 'shineUEcas completely transformed how I manage my CAS portfolio. The AI assistant helped me plan my entire service project!' },
  { name: 'James K.', role: 'CAS Tutor', text: 'Managing tutoring requests and tracking student progress has never been easier. The booking system is fantastic.' },
  { name: 'Dr. Patel', role: 'CAS Coordinator', text: 'Finally a platform that gives me oversight of student CAS progress. The analytics are incredibly helpful.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-lg">shine<span className="text-primary">UE</span>cas</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
            <Link to="/register"><Button size="sm">Get Started</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >

            <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold leading-tight tracking-tight">
              Manage your CAS journey{' '}
              <span className="gradient-text">smarter</span>
            </motion.h1>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap justify-center gap-3">
              <Link to="/register">
                <Button size="lg" className="px-8 gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="px-8">
                  Book a Tutor
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>



      {/* Features */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-heading font-bold">Everything you need for CAS success</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Powerful tools designed specifically for IB students, tutors, and coordinators</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-xl transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>





      {/* Footer */}
      <footer className="border-t border-border py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-heading font-bold">shineUEcas</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 shineUEcas. Built for IB students, by students.</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}