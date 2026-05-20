import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] } }),
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-lg">shine<span className="text-primary">UE</span>cas</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"><Button size="sm">Нэвтрэх</Button></Link>
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
              <Link to="/login">
                <Button size="lg" className="px-8 gap-2">
                  Нэвтрэх <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Demo Credentials Section */}
      <section className="relative py-20 px-4 sm:px-6 bg-muted/30 border-t border-b border-border">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-heading font-bold mb-2">Try Demo Accounts</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Student Demo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold">Student Account</h3>
              </div>
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-mono text-sm">gantigmaa@example.com</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Password</p>
                  <p className="font-mono text-sm">gantigmaa123</p>
                </div>
              </div>
              <Link to="/login" className="w-full">
                <Button size="sm" className="w-full" variant="outline">
                  Sign in as Student
                </Button>
              </Link>
            </motion.div>

            {/* Tutor Demo */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold">Tutor Account</h3>
              </div>
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-mono text-sm">zorigt@example.com</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Password</p>
                  <p className="font-mono text-sm">zorigt123</p>
                </div>
              </div>
              <Link to="/login" className="w-full">
                <Button size="sm" className="w-full" variant="outline">
                  Sign in as Tutor
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t border-border py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold">shineUEcas</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 shineUEcas. Шинэ Үе сургуулийн сурагчид бүтээв.</p>
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