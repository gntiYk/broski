import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import SectionHeader from '@/components/shared/SectionHeader';
import StatCard from '@/components/shared/StatCard';
import { CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { QUIZZES } from '@/data/quizzes';

// Synthetic sound helper using browser Web Audio API
const playSound = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (type === 'correct') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      osc2.frequency.setValueAtTime(783.99, ctx.currentTime + 0.04); // G5
      
      osc1.type = 'sine';
      osc2.type = 'sine';
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.4);
      osc2.stop(ctx.currentTime + 0.4);
    } else if (type === 'incorrect') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(70, ctx.currentTime + 0.25);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'victory') {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
      });
    }
  } catch (e) {
    console.warn("Audio synthesis blocked/unsupported", e);
  }
};

// Curated Educational IGCSE Quizzes Database

export default function StudentDashboard() {
  const { user } = useAuth();
  
  // Custom states for points and quiz progress
  const [studentStats, setStudentStats] = useState({
    quizPoints: 150,
    quizzesCompleted: 3
  });

  // Load persistent stats
  useEffect(() => {
    const saved = localStorage.getItem('broski_student_stats');
    if (saved) {
      setStudentStats(JSON.parse(saved));
    } else {
      localStorage.setItem('broski_student_stats', JSON.stringify(studentStats));
    }
  }, []);

  const saveStats = (newStats) => {
    setStudentStats(newStats);
    localStorage.setItem('broski_student_stats', JSON.stringify(newStats));
  };

  // Active bookings list
  const { data: bookings = [] } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => api.entities.Booking.filter({ student_email: user?.email }, '-created_date', 20),
    enabled: !!user?.email,
  });

  // Quiz Modal States
  const [activeQuizKey, setActiveQuizKey] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const startQuiz = (key) => {
    setActiveQuizKey(key);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setAnswered(false);
    setCorrectAnswersCount(0);
    setQuizFinished(false);
  };

  const handleOptionSelect = (optIdx) => {
    if (answered) return;
    setSelectedOption(optIdx);
  };

  const checkAnswer = () => {
    if (selectedOption === null || answered) return;
    
    const quiz = QUIZZES[activeQuizKey];
    const question = quiz.questions[currentQuestionIdx];
    const isCorrect = selectedOption === question.correct;

    setAnswered(true);
    if (isCorrect) {
      playSound('correct');
      setCorrectAnswersCount(prev => prev + 1);
    } else {
      playSound('incorrect');
    }
  };

  const handleNext = () => {
    const quiz = QUIZZES[activeQuizKey];
    if (currentQuestionIdx < quiz.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      // Quiz completed!
      setQuizFinished(true);
      
      const newPoints = studentStats.quizPoints + (correctAnswersCount * 10);
      playSound('victory');

      saveStats({
        quizPoints: newPoints,
        quizzesCompleted: studentStats.quizzesCompleted + 1
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <SectionHeader title="IGCSE Student" />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard label="Quiz Points" value={studentStats.quizPoints} color="accent" delay={0.1} />
        <StatCard label="Tutors Booked" value={bookings.length} color="chart3" delay={0.2} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Interactive Subject Grid for IGCSE Quizzes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-6">
              <h3 className="font-heading font-semibold text-lg">IGCSE Quiz</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(QUIZZES).map(([key, quiz], idx) => {
                return (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-xl border border-border bg-gradient-to-br from-card to-muted/20 flex flex-col justify-between h-36 relative overflow-hidden"
                  >
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{quiz.subjectName}</span>
                      <h4 className="font-heading font-semibold text-sm mt-2">{quiz.subjectName}</h4>
                      <p className="text-[10px] text-muted-foreground mt-1">{quiz.questions.length} Multiple choice questions</p>
                    </div>

                    <button
                      onClick={() => startQuiz(key)}
                      className="mt-3 text-xs font-medium text-primary hover:text-primary-hover flex items-center gap-1 self-start group transition-colors"
                    >
                      <span>Start Quiz</span>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Timetable / Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card rounded-xl border border-border p-6 shadow-sm"
        >
          <h3 className="font-heading font-semibold mb-4">Your Tutoring Schedule</h3>
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">No tutoring bookings found.</p>
              <p className="text-xs text-muted-foreground mt-0.5">Click 'Booking' in the sidebar to request your first academic session!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 4).map((slot, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/60 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">{slot.date}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <div>
                      <p className="text-xs font-semibold">{slot.subject}</p>
                      <p className="text-[10px] text-muted-foreground">Tutor: {slot.tutor_email?.split('@')[0]} · {slot.time_slot}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    slot.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600' :
                    slot.status === 'completed' ? 'bg-blue-500/10 text-blue-600' :
                    'bg-amber-500/10 text-amber-600'
                  }`}>
                    {slot.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* QUIZ INTERACTIVE DIALOG MODAL OVERLAY */}
      <AnimatePresence>
        {activeQuizKey && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveQuizKey(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="relative bg-card border border-border w-full max-w-lg rounded-2xl p-6 shadow-2xl overflow-hidden"
            >
              {/* Top Subject banner */}
              <div className={`absolute left-0 top-0 right-0 h-2 bg-gradient-to-r ${QUIZZES[activeQuizKey].color}`} />

              {!quizFinished ? (
                <div>
                  {/* Subject and progress */}
                  <div className="flex justify-between items-center mt-2 mb-6">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {QUIZZES[activeQuizKey].subjectName} Quiz
                    </span>
                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      Question {currentQuestionIdx + 1} of {QUIZZES[activeQuizKey].questions.length}
                    </span>
                  </div>

                  {/* Question */}
                  <h3 className="font-heading font-semibold text-base mb-6 leading-relaxed">
                    {QUIZZES[activeQuizKey].questions[currentQuestionIdx].q}
                  </h3>

                  {/* Options */}
                  <div className="space-y-3 mb-6">
                    {QUIZZES[activeQuizKey].questions[currentQuestionIdx].options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === QUIZZES[activeQuizKey].questions[currentQuestionIdx].correct;
                      let optionStyle = 'border-border/60 hover:bg-muted/40 hover:border-border';
                      
                      if (answered) {
                        if (isCorrect) {
                          optionStyle = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium';
                        } else if (isSelected) {
                          optionStyle = 'border-destructive/50 bg-destructive/10 text-destructive dark:text-destructive-foreground font-medium';
                        } else {
                          optionStyle = 'border-border/40 opacity-60';
                        }
                      } else if (isSelected) {
                        optionStyle = 'border-primary bg-primary/5 text-primary font-medium';
                      }

                      return (
                        <motion.button
                          key={idx}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleOptionSelect(idx)}
                          className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between ${optionStyle}`}
                          disabled={answered}
                        >
                          <span>{opt}</span>
                          {answered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                          {answered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Explanation visual block */}
                  <AnimatePresence>
                    {answered && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-muted/40 rounded-xl p-4 mb-6 border border-border/50"
                      >
                        <p className="text-xs font-semibold text-primary mb-1">Explanation:</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {QUIZZES[activeQuizKey].questions[currentQuestionIdx].explanation}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Footer Actions */}
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setActiveQuizKey(null)}
                      className="px-4 py-2 border border-border/80 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted/30 transition-colors"
                    >
                      Quit
                    </button>
                    
                    {!answered ? (
                      <button
                        onClick={checkAnswer}
                        disabled={selectedOption === null}
                        className="px-5 py-2 bg-primary text-primary-foreground font-medium rounded-xl text-xs hover:bg-primary-hover disabled:opacity-50 disabled:pointer-events-none transition-colors"
                      >
                        Check Answer
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        className="px-5 py-2 bg-primary text-primary-foreground font-medium rounded-xl text-xs hover:bg-primary-hover flex items-center gap-1 transition-colors"
                      >
                        <span>{currentQuestionIdx === QUIZZES[activeQuizKey].questions.length - 1 ? 'Finish' : 'Next Question'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* QUIZ SUMMARY WINDOW */
                <div className="text-center py-6">
                  <h3 className="font-heading font-bold text-lg mb-2">Quiz Completed!</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                    You answered <span className="font-semibold text-primary">{correctAnswersCount} out of 3</span> questions correctly.
                  </p>

                  <div className="bg-muted/30 rounded-xl p-4 max-w-sm mx-auto mb-8 border border-border/50 text-left space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Points earned:</span>
                      <span className="font-semibold text-foreground">+{correctAnswersCount * 10} pts</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveQuizKey(null)}
                    className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl text-xs hover:bg-primary-hover transition-colors shadow-md"
                  >
                    Back to Dashboard
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}