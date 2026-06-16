// @ts-nocheck
'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Shield, 
  BookOpen, 
  Globe, 
  Smile, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Award, 
  Play, 
  Compass, 
  Book, 
  ListTodo, 
  Sparkles, 
  GraduationCap,
  MessageSquare,
  ClipboardCheck,
  ChevronRight,
  Flame,
  Lock
} from 'lucide-react';
import { SystemLog } from '../types';

interface AcademyDashboardProps {
  theme?: 'light' | 'dark';
  onAddLog: (fresh: SystemLog) => void;
  currentUser?: { name: string; role: string };
  onUpdateAlerts?: (msg: string) => void;
}

export default function AcademyDashboard({ 
  theme = 'dark', 
  onAddLog, 
  currentUser = { name: 'Alex Chen', role: 'Operator' },
  onUpdateAlerts
}: AcademyDashboardProps) {
  // Navigation for Academy Subpages
  const [academySubtab, setAcademySubtab] = useState<'dashboard' | 'modules' | 'certifications' | 'mentorship' | 'reports'>('dashboard');

  // Interactive training parameters
  const [progress, setProgress] = useState({
    etiquette: 85,
    cyber: 60,
    crisis: 45
  });

  // Quiz active states
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  // Dynamic state for recent activities
  const [activities, setActivities] = useState([
    { id: 'act-1', text: "Completed 'Handling VIP Guests'", time: '2 hours ago', status: 'completed' },
    { id: 'act-2', text: "Started 'Phishing Awareness'", time: 'Yesterday', status: 'started' },
    { id: 'act-3', text: 'Mentorship Session with Manager', time: 'Oct 25', status: 'info' }
  ]);

  // Quizzes database mapping
  const quizzes: Record<string, {
    title: string;
    key: 'etiquette' | 'cyber' | 'crisis';
    questions: Array<{
      q: string;
      options: string[];
      answer: number;
    }>;
  }> = {
    etiquette: {
      title: 'Guest Etiquette & Service Quiz',
      key: 'etiquette',
      questions: [
        {
          q: "When greeting a distinguished guest ('Lord Alexander') upon their arrival at the lobby, what is the prime directive?",
          options: [
            "Shout their name across the lobby and offer generic coffee.",
            "Address them respectfully by title, maintain clean posture, and immediate cross-reference their pre-charged valet status.",
            "Ask them for their ID, credit card, and check-in confirmation number immediately before saying hello."
          ],
          answer: 1
        },
        {
          q: "A high-net-worth VIP complains about the ambient sound in the Serenity Suite being 2 decibels louder than preferred. You should:",
          options: [
            "Remind them that decibels are logarithmic and they cannot perceive that tiny fluctuation.",
            "Politely adjust the digital sound system level immediately from the command console and write an on-duty butler dispatch.",
            "Dispatch a security drone to hover and record the auditory waves of the room."
          ],
          answer: 1
        }
      ]
    },
    cyber: {
      title: 'Cyber-Security & Data Protection Quiz',
      key: 'cyber',
      questions: [
        {
          q: "What constitutes secure protection of Lord Alexander's flight logs, personal schedule, and luxury vehicle credentials?",
          options: [
            "We can keep it in a shared Google Sheet so the entire valet team has instant access on their mobile devices.",
            "Only on encrypted systems tied to the Aurum Security Shield v5, restricting telemetry to verified personnel under Role-Based Access Control.",
            "Storing credentials in plain text inside the physical glovebox of the vehicle."
          ],
          answer: 1
        }
      ]
    },
    crisis: {
      title: 'Crisis Management & Protocol Quiz',
      key: 'crisis',
      questions: [
        {
          q: "If an unexpected gale warning hits the pool side at 14 knots while VIP guests are lounging, what is the automated procedure?",
          options: [
            "No action required unless the tables physically begin moving.",
            "Activate the IoT smart shelter shields, deploy immediate staff directives to guide residents inside, and secure high-tension canopy canvases.",
            "Release emergency drone fleets to capture video feeds of public panic."
          ],
          answer: 1
        }
      ]
    }
  };

  const handleLaunchModule = (key: 'etiquette' | 'cyber' | 'crisis') => {
    setActiveQuiz(key);
    setQuizScore(null);
    setSelectedAnswers({});
    onAddLog({
      id: `acad-${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      module: 'ACADEMY',
      message: `Operator ${currentUser.name} initiated digital training module: ${key.toUpperCase()}`,
      type: 'INFO'
    });
  };

  const handleSubmitQuiz = (key: 'etiquette' | 'cyber' | 'crisis') => {
    const quiz = quizzes[key];
    let correct = 0;
    
    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        correct++;
      }
    });

    const isSuccess = correct === quiz.questions.length;
    setQuizScore(correct);

    if (isSuccess) {
      // Set progress to 100%
      setProgress(prev => ({
        ...prev,
        [key]: 100
      }));

      // Add recent activity
      const activityText = `Completed and scored 100% on '${quiz.title}'`;
      setActivities(prev => [
        { id: `act-${Date.now()}`, text: activityText, time: 'Just now', status: 'completed' },
        ...prev
      ]);

      // Global notify & add log
      if (onUpdateAlerts) {
        onUpdateAlerts(`SUCCESS: ${currentUser.name} fully certified in ${quiz.title}! Badge unlocked.`);
      }
      onAddLog({
        id: `acad-ok-${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        module: 'ACADEMY',
        message: `Operator ${currentUser.name} passed certified assessment ${key.toUpperCase()} at 100%`,
        type: 'OK'
      });
    } else {
      onAddLog({
        id: `acad-err-${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        module: 'ACADEMY',
        message: `Operator ${currentUser.name} attempted quiz ${key} but scored ${correct}/${quiz.questions.length}`,
        type: 'WARN'
      });
    }
  };

  return (
    <div className={`space-y-10 select-none transition-all duration-300 font-sans ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>
      
      {/* HEADER SECTION - Glass panel styled for extreme boutique layout */}
      <div className={`p-6 md:p-8 rounded-[2.5rem] border transition-all duration-300 shadow-xl ${
        theme === 'dark' 
          ? 'bg-slate-900/40 border-white/5 backdrop-blur-md shadow-indigo-950/5' 
          : 'bg-white border-slate-100 shadow-indigo-100/10'
      }`}>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold font-sans shadow-lg shadow-indigo-500/30 shrink-0 select-none">
              ES
            </div>
            <div className="text-left">
              <h1 className={`text-2.5xl font-serif font-bold tracking-tight uppercase ${theme === 'dark' ? 'text-slate-900 dark:text-white' : 'text-slate-900'}`}>
                Elite Staff Academy
              </h1>
              <p className={`text-[10px] font-mono tracking-[0.3em] font-black uppercase mt-1 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                PRESTIGE OPERATIONAL COMPLIANCE & ACCREDITATION COHORT
              </p>
            </div>
          </div>

          {/* User badge with online pulse status */}
          <div className="flex items-center gap-4 self-end lg:self-auto bg-slate-500/5 dark:bg-white/5 px-5 py-3 rounded-2xl border border-slate-200/50 dark:border-white/5">
            <div className="text-right">
              <p className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">Authenticated Specialist</p>
              <p className={`text-sm font-bold uppercase tracking-wide ${theme === 'dark' ? 'text-slate-900 dark:text-white' : 'text-slate-900'}`}>{currentUser.name}</p>
            </div>
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-slate-100 border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden flex items-center justify-center font-bold text-indigo-600 text-sm">
                {currentUser.name.split(' ').map(n=>n[0]).join('')}
              </div>
              <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-indigo-600 ring-2 ring-white"></span>
            </div>
          </div>
        </div>

        {/* Navigation layout */}
        <nav className="flex flex-wrap gap-2 md:gap-10 mt-8 border-b border-slate-100 dark:border-slate-800/60 pb-1 text-sm font-medium">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: GraduationCap },
            { id: 'modules', label: 'Training Modules', icon: BookOpen },
            { id: 'certifications', label: 'Certifications', icon: Award },
            { id: 'mentorship', label: 'Mentorship', icon: MessageSquare },
            { id: 'reports', label: 'Reports', icon: ClipboardCheck }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setAcademySubtab(item.id as any);
                setActiveQuiz(null);
                setQuizScore(null);
              }}
              className={`pb-3 text-xs md:text-sm font-semibold tracking-wider uppercase transition-all duration-200 flex items-center gap-2 cursor-pointer border-b-2 ${
                academySubtab === item.id 
                  ? 'border-indigo-650 text-indigo-600 dark:text-indigo-400 font-bold' 
                  : 'border-transparent text-slate-450 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-900 dark:text-white'
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* DASHBOARD TAB SUB-CONTENT */}
      {academySubtab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: Progress Trackers */}
          <section className="lg:col-span-4 space-y-8">
            <h2 className="text-2xl font-serif text-slate-900 dark:text-white font-medium text-left">
              My Progress <span className="font-light italic text-slate-500">Overview</span>
            </h2>

            {/* Primary Module Card (large visual ring) */}
            <div className={`p-10 rounded-[2.5rem] border text-center transition-all duration-300 ${
              theme === 'dark' 
                ? 'bg-slate-900/40 border-white/5 hover:bg-slate-900/60 shadow-lg shadow-indigo-950/5 hover:-translate-y-1' 
                : 'bg-white border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1'
            }`}>
              <div className="flex flex-col items-center">
                
                {/* SVG Progress Ring */}
                <div className="relative inline-flex items-center justify-center mb-8">
                  <svg className="w-56 h-56 transform -rotate-90">
                    <circle 
                      className={`${theme === 'dark' ? 'text-slate-800' : 'text-slate-100'}`} 
                      cx="112" cy="112" fill="transparent" r="90" 
                      stroke="currentColor" strokeWidth="10"
                    />
                    <circle 
                      className="text-indigo-650 transition-all duration-1000 ease-out" 
                      cx="112" cy="112" fill="transparent" r="90" 
                      stroke="currentColor" strokeWidth="12" 
                      strokeDasharray="565.4" 
                      strokeDashoffset={565.4 - (565.4 * progress.etiquette) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tighter">{progress.etiquette}%</span>
                    <Users className="h-6 w-6 text-indigo-500 opacity-60 mt-2" />
                  </div>
                </div>

                <h3 className="text-xl font-serif font-bold text-slate-805 dark:text-slate-200 mb-8">‘Guest Etiquette & Service’</h3>
                
                <button
                  onClick={() => handleLaunchModule('etiquette')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-lg shadow-indigo-200/50 dark:shadow-none active:scale-95 cursor-pointer"
                >
                  {progress.etiquette === 100 ? 'Review Module' : 'Continue Course'}
                </button>
              </div>
            </div>

            {/* Grid layout for secondary parameters */}
            <div className="grid grid-cols-2 gap-6">
              
              {/* Secondary Module 1: Cyber Security */}
              <div className={`p-6 rounded-3xl border text-center transition-all duration-300 hover:-translate-y-1 ${
                theme === 'dark' 
                  ? 'bg-slate-900/40 border-white/5 hover:bg-slate-900/60 shadow-lg' 
                  : 'bg-white border-slate-100 shadow-sm'
              }`}>
                <div className="flex flex-col items-center">
                  <div className="relative inline-flex items-center justify-center mb-4 scale-75">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle 
                        className={`${theme === 'dark' ? 'text-slate-800' : 'text-slate-100'}`} 
                        cx="64" cy="64" fill="transparent" r="54" 
                        stroke="currentColor" strokeWidth="8"
                      />
                      <circle 
                        className="text-indigo-650 transition-all duration-1000 ease-out" 
                        cx="64" cy="64" fill="transparent" r="54" 
                        stroke="currentColor" strokeWidth="10" 
                        strokeDasharray="339.2" 
                        strokeDashoffset={339.2 - (339.2 * progress.cyber) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-xl font-bold text-slate-900 dark:text-white">{progress.cyber}%</span>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-4 leading-tight min-h-[32px] flex items-center justify-center">
                    ‘Cyber-Security’
                  </p>
                  <button
                    onClick={() => handleLaunchModule('cyber')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all w-full cursor-pointer"
                  >
                    Continue
                  </button>
                </div>
              </div>

              {/* Secondary Module 2: Crisis Management */}
              <div className={`p-6 rounded-3xl border text-center transition-all duration-300 hover:-translate-y-1 ${
                theme === 'dark' 
                  ? 'bg-slate-900/40 border-white/5 hover:bg-slate-900/60 shadow-lg' 
                  : 'bg-white border-slate-100 shadow-sm'
              }`}>
                <div className="flex flex-col items-center">
                  <div className="relative inline-flex items-center justify-center mb-4 scale-75">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle 
                        className={`${theme === 'dark' ? 'text-slate-800' : 'text-slate-100'}`} 
                        cx="64" cy="64" fill="transparent" r="54" 
                        stroke="currentColor" strokeWidth="8"
                      />
                      <circle 
                        className="text-indigo-650 transition-all duration-1000 ease-out" 
                        cx="64" cy="64" fill="transparent" r="54" 
                        stroke="currentColor" strokeWidth="10" 
                        strokeDasharray="339.2" 
                        strokeDashoffset={339.2 - (339.2 * progress.crisis) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-xl font-bold text-slate-900 dark:text-white">{progress.crisis}%</span>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-4 leading-tight min-h-[32px] flex items-center justify-center">
                    ‘Crisis Management’
                  </p>
                  <button
                    onClick={() => handleLaunchModule('crisis')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all w-full cursor-pointer"
                  >
                    Continue
                  </button>
                </div>
              </div>

            </div>
          </section>

          {/* MIDDLE COLUMN: Digital Certification Wall & Activities */}
          <section className="lg:col-span-5 space-y-10 text-left">
            <div>
              <h2 className="text-2xl font-serif text-slate-900 dark:text-white mb-8">
                Digital <span className="font-light italic text-slate-500">Certification Wall</span>
              </h2>

              {/* Certification Relief Glass Badges */}
              <div className={`p-8 rounded-[2.5rem] border ${
                theme === 'dark' 
                  ? 'bg-slate-900/40 border-white/5 shadow-lg' 
                  : 'bg-slate-50/50 border-slate-100 shadow-sm'
              }`}>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { 
                      id: 'cert-1', 
                      title: 'Luxury Service Professional L2', 
                      icon: Smile, 
                      value: progress.etiquette, 
                      desc: 'Elite status on brand protocols.' 
                    },
                    { 
                      id: 'cert-2', 
                      title: 'Cyber-Security Specialist', 
                      icon: Shield, 
                      value: progress.cyber, 
                      desc: 'Aurum Shield credential standards.' 
                    },
                    { 
                      id: 'cert-3', 
                      title: 'Elite Hospitality Leadership', 
                      icon: Book, 
                      value: 100, 
                      desc: 'Bespoke administrative command.' 
                    },
                    { 
                      id: 'cert-4', 
                      title: 'Global Standards Compliance', 
                      icon: Globe, 
                      value: 100, 
                      desc: 'Operational safety compliance checks.' 
                    }
                  ].map((cert) => {
                    const unlocked = cert.value === 100;
                    return (
                      <div 
                        key={cert.id}
                        className={`rounded-3xl aspect-square flex flex-col items-center justify-center text-center p-5 border transition-all duration-300 transform hover:scale-[1.02] cursor-pointer ${
                          unlocked
                            ? theme === 'dark'
                              ? 'bg-gradient-to-br from-slate-900 to-indigo-950/20 border-indigo-500/35 shadow-[0_4px_20px_rgba(99,102,241,0.06),inset_0_0_12px_rgba(255,255,255,0.02)]'
                              : 'bg-gradient-to-br from-white to-slate-50/70 border-indigo-550/25 shadow-[0_4px_15px_rgba(0,0,0,0.02),inset_0_0_10px_rgba(255,255,255,1)]'
                            : 'border-slate-205/10 dark:border-slate-800 bg-transparent opacity-50'
                        }`}
                        title={unlocked ? 'Certified Accreditation active or verified' : 'Incomplete course threshold'}
                      >
                        <div className={`w-14 h-14 mb-4 rounded-full flex items-center justify-center transition-transform duration-350 ${
                          unlocked 
                            ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-550/5 dark:bg-indigo-500/10' 
                            : 'text-slate-400 dark:text-slate-650'
                        }`}>
                          <cert.icon className="w-8 h-8 opacity-90" />
                        </div>
                        
                        <p className={`text-[11px] font-semibold text-center leading-tight uppercase tracking-widest px-2 ${
                          theme === 'dark' ? 'text-slate-900 dark:text-white' : 'text-slate-800'
                        }`}>
                          {cert.title.split(' ')[0]} <br/> {cert.title.split(' ').slice(1).join(' ')}
                        </p>
                        
                        <div className="w-full bg-slate-200/50 dark:bg-slate-800 h-1 rounded-full overflow-hidden mt-4 max-w-[80%]">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${unlocked ? 'bg-indigo-600' : 'bg-slate-400'}`} 
                            style={{ width: `${cert.value}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recency timelines */}
            <div>
              <h2 className="text-2xl font-serif text-slate-900 dark:text-white mb-6">
                Recent <span className="font-light italic text-slate-500">Activity</span>
              </h2>
              <div className="space-y-6">
                {activities.map((act) => (
                  <div key={act.id} className="flex items-center gap-4 group cursor-pointer">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      act.status === 'completed' 
                        ? 'bg-indigo-600 shadow-[0_0_10px_#6366F1]' 
                        : 'bg-slate-350 dark:bg-slate-700'
                    }`}></div>
                    <div className="text-sm">
                      <p className="font-medium text-slate-800 dark:text-slate-250 group-hover:text-indigo-600 transition-colors">
                        {act.text.includes('Completed') ? (
                          <>Completed <span className="font-semibold text-slate-900 dark:text-white">'{act.text.replace('Completed ', '')}'</span></>
                        ) : act.text.includes('Started') ? (
                          <>Started <span className="font-semibold text-slate-900 dark:text-white">'{act.text.replace('Started ', '')}'</span></>
                        ) : (
                          act.text
                        )}
                      </p>
                      <p className="text-xs text-slate-405 font-mono uppercase tracking-wide mt-0.5">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN: Upcoming schedules & custom elite tip box */}
          <aside className="lg:col-span-3 flex flex-col gap-10">
            <div>
              <h2 className="text-2xl font-serif text-slate-900 dark:text-white mb-8">
                Upcoming <span className="font-light italic text-slate-500">Sessions</span>
              </h2>
              <div className="space-y-6">
                {[
                  { 
                    title: 'Live Webinar: Advanced Concierge', 
                    time: 'Today, 3 PM',
                    topic: 'Ambiance Noise Control & Suite Dispatch.'
                  },
                  { 
                    title: 'Workshop: Data Privacy Regulation', 
                    time: 'Tomorrow, 10 AM',
                    topic: 'Aurum Shield physical checks.'
                  }
                ].map((sess, idx) => (
                  <div key={idx} className="flex gap-4 group cursor-pointer">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-900 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-350 shadow-sm border border-slate-100 dark:border-white/5`}>
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-snug group-hover:text-indigo-600 transition-all">
                        {sess.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">{sess.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Elite beautiful card with gradient */}
            <div className={`p-8 rounded-[2.5rem] relative overflow-hidden border ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-slate-900 to-indigo-950/20 border-white/5' 
                : 'bg-gradient-to-br from-indigo-50/50 to-white border-indigo-100/60'
            }`}>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-4 font-mono">
                Elite Directive
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed font-serif font-light">
                "Personalization is the key to luxury. Remember to address guests by their name whenever possible."
              </p>
            </div>
          </aside>
        </div>
      )}

      {/* SUBPAGE ASSESSMENT / INTERACTIVE QUIZ MODAL */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-10 space-y-6 relative shadow-2xl my-8">
            <button 
              onClick={() => setActiveQuiz(null)}
              className="absolute top-6 right-8 text-slate-400 hover:text-slate-900 dark:hover:text-slate-900 dark:text-white text-3xl cursor-pointer font-serif select-none z-10"
            >
              &times;
            </button>

            <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <GraduationCap className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              <div className="text-left">
                <p className="text-[9px] font-mono text-indigo-500 uppercase tracking-widest">Prestige Qualification Exam</p>
                <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">{quizzes[activeQuiz].title}</h3>
              </div>
            </div>

            {quizScore !== null ? (
              // Quiz Completed state view
              <div className="py-10 text-center space-y-6 select-none text-left">
                {quizScore === quizzes[activeQuiz].questions.length ? (
                  <>
                    <div className="w-16 h-16 bg-indigo-550/10 text-indigo-600 dark:text-indigo-405 border border-indigo-500/20 rounded-full flex items-center justify-center mx-auto shadow-xl">
                      <Award className="w-8 h-8 animate-bounce" />
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-3xl font-serif text-slate-900 dark:text-white font-black uppercase tracking-tight">Accreditation Certified!</h4>
                      <p className="text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold uppercase tracking-widest">
                        SCORE ACHIEVED: {quizScore} OF {quizzes[activeQuiz].questions.length} PERFECT ACCURACY
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed pt-2">
                        The Academic Board has vetted your response metrics. Certified credentials have been written to the ledger wall successfully.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto">
                      <Flame className="w-8 h-8 text-rose-550" />
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-2xl font-serif text-slate-900 dark:text-white font-bold">Unsatisfactory Accuracy</h4>
                      <p className="text-rose-650 dark:text-rose-455 font-mono text-xs font-bold uppercase tracking-widest">
                        METRICS: {quizScore} OF {quizzes[activeQuiz].questions.length} CORRECT
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed pt-2">
                        To match the elite standards of Aetheon Opulence, training exams require 100% resolution score. Review syllabus content and retake.
                      </p>
                    </div>
                  </>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-6 max-w-md mx-auto justify-center">
                  <button
                    onClick={() => {
                      setQuizScore(null);
                      setSelectedAnswers({});
                    }}
                    className="px-6 py-3 border border-slate-205 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-mono font-bold uppercase hover:bg-slate-500/5 cursor-pointer transition-all"
                  >
                    Retake Exam
                  </button>
                  <button
                    onClick={() => setActiveQuiz(null)}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-widest cursor-pointer transition-all"
                  >
                    Close Terminal
                  </button>
                </div>
              </div>
            ) : (
              // Active questions sheet
              <div className="space-y-8 text-left max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {quizzes[activeQuiz].questions.map((q, qidx) => (
                  <div key={qidx} className="space-y-4">
                    <p className="text-[10px] text-indigo-500 font-mono tracking-widest font-black">QUESTION 0{qidx + 1}</p>
                    <p className={`text-md font-serif font-semibold leading-relaxed ${theme === 'dark' ? 'text-slate-900 dark:text-white' : 'text-slate-900'}`}>{q.q}</p>
                    
                    <div className="space-y-3 pt-2">
                      {q.options.map((opt, oidx) => {
                        const selected = selectedAnswers[qidx] === oidx;
                        return (
                          <div
                            key={oidx}
                            onClick={() => setSelectedAnswers(prev => ({ ...prev, [qidx]: oidx }))}
                            className={`p-4 rounded-2xl border text-xs cursor-pointer select-none transition-all duration-200 ${
                              selected 
                                ? 'border-indigo-600 bg-indigo-500/5 text-slate-900 dark:text-white font-semibold shadow-sm' 
                                : 'border-slate-203 dark:border-slate-800 bg-transparent text-slate-600 dark:text-slate-350 hover:bg-slate-500/5'
                            }`}
                          >
                            <span className="font-semibold">{String.fromCharCode(65 + oidx)}.</span> {opt}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => handleSubmitQuiz(activeQuiz as any)}
                  disabled={Object.keys(selectedAnswers).length < quizzes[activeQuiz].questions.length}
                  className={`w-full py-4 rounded-xl text-xs uppercase tracking-widest font-bold font-sans transition-all mt-6 ${
                    Object.keys(selectedAnswers).length === quizzes[activeQuiz].questions.length
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-lg shadow-indigo-100/10'
                      : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Submit Certified Answers &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TRAINING SYLLABUS TAB */}
      {academySubtab === 'modules' && (
        <div className="space-y-8 text-left animate-fadeIn">
          <div>
            <h3 className={`text-2xl font-serif font-black uppercase ${theme === 'dark' ? 'text-slate-900 dark:text-white' : 'text-slate-900'}`}>
              Interactive Course Syllabus
            </h3>
            <p className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">Select study subjects to ready compliance metrics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: 'etiquette', val: progress.etiquette, title: 'Guest Etiquette & Luxe Standards', items: ['Greeting VIP residents by name', 'Command ambiance noise mitigation', 'Suite dispatch procedures'] },
              { id: 'cyber', val: progress.cyber, title: 'Cyber-Security & Data Shield V5', items: ['Cryptographic login verification', 'Access credential security', 'Role-Based telemetry restriction'] },
              { id: 'crisis', val: progress.crisis, title: 'Emergency Crisis & Gale Protocols', items: ['Gale wind force tracking', 'IoT smart parasol auto-closing', 'Guest escape tunnel layouts'] }
            ].map((mod) => (
              <div 
                key={mod.id} 
                className={`p-8 rounded-[2.2rem] border transition-all duration-300 hover:-translate-y-1 ${
                  theme === 'dark' ? 'bg-slate-900/40 border-white/5 hover:bg-slate-900/60' : 'bg-white border-slate-100 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <h4 className={`text-md font-serif font-bold tracking-tight h-12 flex items-center leading-snug uppercase ${theme === 'dark' ? 'text-slate-900 dark:text-white' : 'text-slate-905'}`}>{mod.title}</h4>
                  <span className="text-xs font-mono font-bold bg-indigo-500/10 px-2.5 py-1 rounded text-indigo-600 dark:text-indigo-400 shrink-0">{mod.val}%</span>
                </div>
                
                <ul className="space-y-3.5 text-xs text-slate-500 dark:text-slate-400 list-inside h-28 border-t border-b border-slate-100 dark:border-slate-800/60 py-4 mb-2">
                  {mod.items.map((it, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleLaunchModule(mod.id as any)}
                  className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer"
                >
                  Take Competency Exam
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CERTIFICATIONS TAB: Academic ledger diploma display (Physical simulated layout) */}
      {academySubtab === 'certifications' && (
        <div className="space-y-8 text-left animate-fadeIn">
          <div>
            <h3 className={`text-2xl font-serif font-black uppercase ${theme === 'dark' ? 'text-slate-900 dark:text-white' : 'text-slate-900'}`}>
              Academic Ledger & Badges
            </h3>
            <p className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">Verifiable cryptographic proof of earned academic credentials.</p>
          </div>

          <div className="flex justify-center">
            <div className={`w-full max-w-3xl rounded-[3rem] p-10 md:p-12 border relative overflow-hidden transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/20 border-indigo-500/20'
                : 'bg-gradient-to-tr from-[#fbfbff] via-white to-slate-50 border-slate-200/80 shadow-xl shadow-slate-100'
            }`}>
              {/* Premium styling details */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="border border-indigo-500/10 p-8 rounded-[2rem] space-y-8 text-center bg-white/5 backdrop-blur-sm">
                
                <div className="flex justify-between items-center">
                  <div className="text-left leading-none font-mono text-[9px] text-slate-400">
                    <p>ACADEMY REGISTERED NO.</p>
                    <p className="font-bold text-indigo-550 mt-1">LH-905-TSXP</p>
                  </div>
                  <Award className="w-12 h-12 text-indigo-650 animate-pulse" />
                  <div className="text-right leading-none font-mono text-[9px] text-slate-400">
                    <p>STATUS SYSTEM CODES</p>
                    <p className="font-bold text-emerald-550 mt-1">SEC_LEVEL_IV</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-mono tracking-[0.4em] text-indigo-500 font-bold uppercase">
                    OFFICIAL DIPLOMA LEDGER OF THE ACADEMY
                  </h4>
                  <h3 className="text-3xl font-serif font-black uppercase text-slate-900 dark:text-white leading-tight">
                    {currentUser.name}
                  </h3>
                  <p className="text-xs font-serif text-slate-500 italic max-w-md mx-auto leading-relaxed">
                    Has successfully submitted, verified, and attained professional operational compliance certifications matching highest security clearances of luxury property management.
                  </p>
                </div>

                {/* Ledger specific credential details */}
                <div className="grid grid-cols-2 gap-4 border-t border-b border-indigo-500/15 py-6 text-left max-w-lg mx-auto font-mono text-[10px] text-slate-400">
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-400">Security Clearance Group:</p>
                    <p className="text-slate-800 dark:text-white font-bold">{currentUser.role === 'Manager' ? 'Lead Proprietor (Manager)' : 'Lobby Staff (Operator)'}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="font-semibold text-slate-400">Verification Hash Registry:</p>
                    <p className="text-indigo-400 truncate max-w-[200px]" title="SHA256_90c749bdf8e9823e2001e05a069ce5b">SHA256_90c749bdf8e9823e2001e05a069ce5b</p>
                  </div>
                </div>

                <div className="flex justify-center items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <p className="text-[9px] font-mono font-black text-emerald-500 uppercase tracking-widest">
                    Aurum Shield Verification Ledger Lock Deployed
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* MENTORSHIP TAB */}
      {academySubtab === 'mentorship' && (
        <div className="space-y-8 text-left animate-fadeIn">
          <div>
            <h3 className={`text-2xl font-serif font-black uppercase ${theme === 'dark' ? 'text-slate-900 dark:text-white' : 'text-slate-900'}`}>
              Executive Mentorship Logs
            </h3>
            <p className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">Sync reviews and strategic coach reports with on-site proprietors.</p>
          </div>

          <div className={`p-8 md:p-10 rounded-[2.5rem] border ${
            theme === 'dark' ? 'bg-slate-900/40 border-slate-850/60 shadow-lg' : 'bg-white border-slate-150 shadow-sm'
          }`}>
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-indigo-600/5 border border-indigo-550/15 relative">
                <div className="absolute top-4 right-4 text-[9px] font-mono uppercase bg-indigo-600/10 px-2 py-0.5 rounded text-indigo-500 font-bold">
                  OCTOBER 25 EVALUATION
                </div>
                <p className="text-xs font-mono text-indigo-500 font-extrabold uppercase tracking-widest mb-1">
                  Lead Proprietor Directives
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 font-serif font-light leading-relaxed italic pr-12">
                  "Alex Chen exhibited exemplary diligence during Lord Alexander's suite setup. Decibel tracking responses were instantaneous. Recommend passing 'Guest Etiquette Level 2' to unlock strategic luxury assets cohort."
                </p>
              </div>

              <button
                onClick={() => alert('Coaching synchronisation request submitted. Proprietor pager alerted.')}
                className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md cursor-pointer"
              >
                Request Sync Meeting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORTS TAB */}
      {academySubtab === 'reports' && (
        <div className="space-y-8 text-left animate-fadeIn">
          <div>
            <h3 className={`text-2xl font-serif font-black uppercase ${theme === 'dark' ? 'text-slate-900 dark:text-white' : 'text-slate-900'}`}>
              Certified Operations Reports
            </h3>
            <p className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">Audited performance scorecards generated for administrative review board.</p>
          </div>

          <div className={`p-10 rounded-[2.5rem] border text-center ${
            theme === 'dark' ? 'bg-slate-900/40 border-slate-850' : 'bg-white border-slate-150'
          }`}>
            <div className="max-w-md mx-auto space-y-4 py-8">
              <Lock className="w-12 h-12 text-slate-400/80 mx-auto animate-pulse" />
              <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                Operations scorecard is currently locked. Complete all digital competency exams (105% threshold) to compile a validated reports dossier.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

