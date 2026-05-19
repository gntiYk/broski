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
  { icon: FolderKanban, title: 'CAS Төсөл Хөтлөлт', desc: 'Бүтээлч, Идэвхтэй, Нийгмийн тустай ажлын цагаа бүртгэж, явцаа хянах' },
  { icon: BookOpen, title: 'Багш Захиалга', desc: 'Хүссэн цагтаа багш нартай хичээлийн цаг товлож, сурлагадаа тусламж авах' },
  { icon: CalendarDays, title: 'Ухаалаг Хуанли', desc: 'Хичээл давтах цаг, CAS ажил, даалгавар өгөх эцсийн хугацаа болон багштай уулзах цагаа нэг дороос төлөвлөх' },
  { icon: Bot, title: 'AI Туслах', desc: 'Хувийн CAS зөвлөгөө, төслийн санаа, сургалтын төлөвлөлтийг хиймэл оюунаас авах' },
  { icon: Users, title: 'Сурагч-Багшийн Чат', desc: 'Удирдамж, зөвлөгөө авахын тулд багш нартай шууд холбогдож цагаа зохицуулах' },
  { icon: TrendingUp, title: 'Статистик Хянах Самбар', desc: 'Сурлагын явц, ололт амжилтаа үзүүлэн зураг, графикуудын тусламжтай харах' },
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
            <Link to="/login"><Button variant="ghost" size="sm">Нэвтрэх</Button></Link>
            <Link to="/register"><Button size="sm">Бүртгүүлэх</Button></Link>
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
                  Бүртгүүлэх <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="px-8">
                  Багш Захиалах
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-heading font-bold">shineUEcas</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 shineUEcas. IB сурагчдад зориулан сурагчдын бүтээв.</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">Нууцлал</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Үйлчилгээний нөхцөл</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Холбоо барих</span>
          </div>
        </div>
      </footer>
    </div>
  );
}