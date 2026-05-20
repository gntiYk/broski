import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';
import SectionHeader from '@/components/shared/SectionHeader';
import StatCard from '@/components/shared/StatCard';
import { CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

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
const QUIZZES = {
  math: {
    subjectName: 'Mathematics',
    badge: 'Math Whiz',
    color: 'from-purple-500 to-indigo-500',
    questions: [
      {
        q: 'Solve for x: 3x + 7 = 22',
        options: ['x = 3', 'x = 5', 'x = 6', 'x = 7'],
        correct: 1,
        explanation: 'Subtract 7 from both sides to get 3x = 15. Then divide by 3 to get x = 5.'
      },
      {
        q: 'What is the gradient (slope) of the line 2y = 4x + 6?',
        options: ['2', '4', '6', '3'],
        correct: 0,
        explanation: 'Rearrange into y = mx + c format: y = 2x + 3. The coefficient of x (gradient) is 2.'
      },
      {
        q: 'If a triangle has sides 6cm and 8cm with a 90° angle between them, what is the hypotenuse length?',
        options: ['9cm', '10cm', '12cm', '14cm'],
        correct: 1,
        explanation: 'Apply Pythagoras\' Theorem: 6² + 8² = 36 + 64 = 100. The square root of 100 is 10cm.'
      }
    ]
  },
  physics: {
    subjectName: 'Physics',
    badge: 'Physics Master',
    color: 'from-blue-500 to-cyan-500',
    questions: [
      {
        q: 'What is the SI unit of electrical resistance?',
        options: ['Volt', 'Ampere', 'Ohm', 'Watt'],
        correct: 2,
        explanation: 'The Ohm (Ω) is the standard unit of electrical resistance, named after Georg Ohm.'
      },
      {
        q: 'Which type of electromagnetic radiation has the longest wavelength?',
        options: ['Ultraviolet', 'Gamma rays', 'Radio waves', 'Infrared'],
        correct: 2,
        explanation: 'Radio waves occupy the lowest-frequency and longest-wavelength band of the EM spectrum.'
      },
      {
        q: 'What describes the rate of change of velocity?',
        options: ['Speed', 'Displacement', 'Acceleration', 'Momentum'],
        correct: 2,
        explanation: 'Acceleration is defined mathematically as the change in velocity divided by time.'
      }
    ]
  },
  english: {
    subjectName: 'English (ESL)',
    badge: 'English Scholar',
    color: 'from-green-500 to-emerald-500',
    questions: [
      {
        q: 'Identify the grammatically correct sentence:',
        options: [
          'He don\'t like reading books.',
          'She has lived here since five years.',
          'I am looking forward to meeting you.',
          'They was playing soccer.'
        ],
        correct: 2,
        explanation: '"Look forward to" must be followed by a gerund (noun form of a verb, ending in -ing).'
      },
      {
        q: 'Choose the correct preposition: She is very good ___ painting.',
        options: ['in', 'at', 'on', 'for'],
        correct: 1,
        explanation: 'The adjective "good" is paired with the preposition "at" to show a specific skill.'
      },
      {
        q: 'What is the synonym of the word "diligent"?',
        options: ['Lazy', 'Clever', 'Hard-working', 'Fast'],
        correct: 2,
        explanation: '"Diligent" means showing careful, thorough, and active effort (hard-working).'
      }
    ]
  },
  biology: {
    subjectName: 'Biology',
    badge: 'Bio Explorer',
    color: 'from-emerald-500 to-teal-500',
    questions: [
      {
        q: 'Which cellular organelle is known as the powerhouse of the cell?',
        options: ['Nucleus', 'Ribosome', 'Mitochondrion', 'Chloroplast'],
        correct: 2,
        explanation: 'Mitochondria generate ATP (adenosine triphosphate) which serves as energy for cells.'
      },
      {
        q: 'What is the primary pigment responsible for photosynthesis in plants?',
        options: ['Carotenoid', 'Chlorophyll', 'Hemoglobin', 'Melanin'],
        correct: 1,
        explanation: 'Chlorophyll absorbs light, primarily in the blue and red wavelengths, transferring it to reactions.'
      },
      {
        q: 'What type of blood vessel always carries blood away from the heart?',
        options: ['Artery', 'Vein', 'Capillary', 'Venule'],
        correct: 0,
        explanation: 'Arteries carry oxygenated blood away from the heart (except the pulmonary artery).'
      }
    ]
  },
  chemistry: {
    subjectName: 'Chemistry',
    badge: 'Chem Alchemist',
    color: 'from-red-500 to-rose-500',
    questions: [
      {
        q: 'What is the pH value of a neutral solution at 25°C?',
        options: ['0', '5', '7', '14'],
        correct: 2,
        explanation: 'A neutral solution (like pure water) registers exactly at pH 7 on the scale.'
      },
      {
        q: 'What is the correct chemical formula of rust?',
        options: ['Fe', 'Fe₂O₃', 'FeO', 'FeCl₃'],
        correct: 1,
        explanation: 'Rust is iron(III) oxide (Fe₂O₃), formed when iron reacts with oxygen and water.'
      },
      {
        q: 'Which gas turns limewater milky when bubbled through it?',
        options: ['Oxygen', 'Hydrogen', 'Carbon Dioxide', 'Nitrogen'],
        correct: 2,
        explanation: 'Carbon dioxide reacts with calcium hydroxide (limewater) to form insoluble calcium carbonate.'
      }
    ]
  },
  ict: {
    subjectName: 'ICT',
    badge: 'Tech Innovator',
    color: 'from-cyan-500 to-blue-500',
    questions: [
      {
        q: 'What does CPU stand for?',
        options: ['Central Processing Unit', 'Computer Power Utility', 'Control Path Unit', 'Core Processor Usability'],
        correct: 0,
        explanation: 'The CPU acts as the primary "brain" executing computer program instructions.'
      },
      {
        q: 'Which of the following acts purely as an input device?',
        options: ['Monitor', 'Printer', 'Scanner', 'Projector'],
        correct: 2,
        explanation: 'A scanner reads a physical image/text and converts it to digital data inside the computer.'
      },
      {
        q: 'What is the primary function of a network firewall?',
        options: ['Increase download speed', 'Filter unauthorized network traffic', 'Back up local files', 'Clean hardware dust'],
        correct: 1,
        explanation: 'Firewalls monitor and block incoming/outgoing connections based on custom security policies.'
      }
    ]
  },
  gp: {
    subjectName: 'Global Perspectives',
    badge: 'Global Citizen',
    color: 'from-amber-500 to-orange-500',
    questions: [
      {
        q: 'What is defined as a preconceived opinion or prejudice not based on reason?',
        options: ['Evidence', 'Perspective', 'Bias', 'Hypothesis'],
        correct: 2,
        explanation: 'Bias is a strong tendency or prejudice toward or against an issue, affecting objective judgment.'
      },
      {
        q: 'Which type of research source is a direct first-hand account of an event?',
        options: ['Secondary source', 'Tertiary source', 'Primary source', 'Editorial article'],
        correct: 2,
        explanation: 'Primary sources represent raw material collected during an event (e.g. interviews, speeches).'
      },
      {
        q: 'In Global Perspectives, what does the "local" perspective represent?',
        options: [
          'Viewpoints of international governments',
          'Viewpoint of a single family member',
          'Viewpoint of a specific localized community',
          'A nation-wide general opinion survey'
        ],
        correct: 2,
        explanation: 'A local perspective analyzes responses and viewpoints restricted to a specific community or neighborhood.'
      }
    ]
  },
  mandarin: {
    subjectName: 'Mandarin Chinese',
    badge: 'Tonal Linguist',
    color: 'from-rose-500 to-pink-500',
    questions: [
      {
        q: 'How do you write the word "Apple" in Chinese characters?',
        options: ['苹果 (Píngguǒ)', '香蕉 (Xiāngjiāo)', '橙子 (Chéngzi)', '西瓜 (Xīguā)'],
        correct: 0,
        explanation: '苹果 (píngguǒ) is apple. 香蕉 is banana, 橙子 is orange, and 西瓜 is watermelon.'
      },
      {
        q: 'Which character represents the number "Eight"?',
        options: ['三', '六', '八', '十'],
        correct: 2,
        explanation: '八 (bā) stands for the number 8. 三 is 3, 六 is 6, and 十 is 10.'
      },
      {
        q: 'What is the purpose of the particle "吗" (ma) at the end of a sentence?',
        options: [
          'Indicates a high surprise level',
          'Converts a declarative sentence into a yes/no question',
          'Triggers past tense translation',
          'Fuses two nouns together'
        ],
        correct: 1,
        explanation: 'Placing 吗 (ma) at the end of a simple statement turns it directly into a yes/no question.'
      }
    ]
  }
};

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
                      <p className="text-[10px] text-muted-foreground mt-1">3 Multiple choice questions</p>
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