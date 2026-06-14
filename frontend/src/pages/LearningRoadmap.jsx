import React, { useEffect, useState } from 'react';
import api from '../api';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Loader2, 
  ArrowRight, 
  Play, 
  Sparkles,
  CheckCircle,
  Clock,
  Compass,
  Check,
  ExternalLink,
  Book,
  Youtube,
  Target,
  AlertTriangle,
  Lock,
  ChevronRight,
  TrendingUp,
  FileText,
  Activity,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LearningRoadmap = () => {
  const [plan, setPlan] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const response = await api.get('/learning/plan');
      setPlan(response.data.data);
      
      try {
        const subRes = await api.get('/coding/history');
        setSubmissions(subRes.data.data);
      } catch (err) {
        console.error('Failed to load coding history:', err);
      }
    } catch (err) {
      console.error('No roadmap found initially.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const generateRoadmap = async () => {
    setGenerating(true);
    try {
      const response = await api.post('/learning/plan/regenerate');
      setPlan(response.data.data);
      
      try {
        const subRes = await api.get('/coding/history');
        setSubmissions(subRes.data.data);
      } catch (err) {
        console.error('Failed to load coding history after regeneration:', err);
      }
      
      toast.success('Gemini compiled your personalized week-by-week study roadmap!');
    } catch (err) {
      toast.error('Failed to compile study roadmap. Try again.');
    } finally {
      setGenerating(false);
    }
  };

  const toggleWeekStatus = async (weekNumber, currentStatus) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      const response = await api.post('/learning/plan/milestone', {
        weekNumber,
        status: nextStatus,
      });
      setPlan(response.data.data);
      toast.success(`Week ${weekNumber} marked as ${nextStatus}!`);
    } catch (err) {
      toast.error('Failed to update milestone status');
    }
  };

  // Calculate overall roadmap completion rate
  const getProgressPercent = () => {
    if (!plan || !plan.weeklyRoadmap?.length) return 0;
    const completed = plan.weeklyRoadmap.filter((w) => w.status === 'completed').length;
    return Math.round((completed / plan.weeklyRoadmap.length) * 100);
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-indigo-500" />
      </div>
    );
  }

  const activeWeekNum = plan?.weeklyRoadmap?.find(w => w.status !== 'completed')?.weekNumber || 999;

  const getWeekState = (week) => {
    if (week.status === 'completed') return 'completed';
    if (week.weekNumber === activeWeekNum) return 'active';
    return 'upcoming';
  };

  const getChallengeSolvedStatus = (challengeId) => {
    const subs = submissions.filter(s => s.challengeId?._id === challengeId);
    return subs.some(s => s.status === 'Passed');
  };

  const getResourceIcon = (res) => {
    const lower = res.toLowerCase();
    if (lower.includes('leetcode') || lower.includes('neetcode')) {
      return <ExternalLink className="h-3.5 w-3.5 text-cyan-400" />;
    }
    if (lower.includes('book') || lower.includes('cracking') || lower.includes('read')) {
      return <Book className="h-3.5 w-3.5 text-indigo-400" />;
    }
    if (lower.includes('video') || lower.includes('course') || lower.includes('youtube') || lower.includes('watch')) {
      return <Youtube className="h-3.5 w-3.5 text-rose-400" />;
    }
    return <FileText className="h-3.5 w-3.5 text-amber-400" />;
  };

  // SVG circular progress settings
  const pct = getProgressPercent();
  const radius = 40;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  const totalWeeks = plan?.weeklyRoadmap?.length || 0;
  const completedWeeks = plan?.weeklyRoadmap?.filter(w => w.status === 'completed').length || 0;

  return (
    <div className="space-y-8">
      {/* Header section with sparkles */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-indigo-950/15 via-[#0B0F19] to-[#0B0F19] p-6 rounded-2xl border border-[#1F2A45]/40 shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              AI Curriculum
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Synced with performance logs</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1 bg-gradient-to-r from-white via-[#EBF4FF] to-[#9CA3AF] bg-clip-text text-transparent">
            Personalized Study Engine
          </h1>
          <p className="text-[#9CA3AF] text-xs mt-1.5 max-w-xl leading-relaxed">
            Gemini parses your mock interview marks, resume skill deficits, and coding sandbox attempts to curate a bespoke week-by-week practice syllabus.
          </p>
        </div>
        {plan && (
          <button
            onClick={generateRoadmap}
            disabled={generating}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center space-x-2 transition-all btn-glow-primary disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2 className="animate-spin h-3.5 w-3.5" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                <span>Regenerate Study Plan</span>
              </>
            )}
          </button>
        )}
      </div>

      {plan ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Diagnostics Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Completion Gauge */}
            <div className="glass-panel p-6 rounded-2xl text-center flex flex-col items-center space-y-5 border border-[#1F2A45]/50">
              <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Plan Completion</h4>
              
              <div className="relative flex items-center justify-center">
                <svg className="w-28 h-28 transform -rotate-90">
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  {/* Outer circle track */}
                  <circle
                    cx="56"
                    cy="56"
                    r={radius}
                    stroke="#1F2A45"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="opacity-40"
                  />
                  {/* Active progress ring */}
                  <circle
                    cx="56"
                    cy="56"
                    r={radius}
                    stroke="url(#progressGradient)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                {/* Inside percentage */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">{pct}%</span>
                  <span className="text-[9px] text-[#9CA3AF] uppercase font-bold tracking-widest">Done</span>
                </div>
              </div>

              {/* Progress Milestones Checklist */}
              <div className="pt-4 border-t border-[#1F2A45]/40 w-full text-left space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#9CA3AF] font-medium">Weeks Complete:</span>
                  <span className="font-bold text-white bg-[#0B0F19] px-2 py-0.5 rounded-md border border-[#1F2A45]/40">{completedWeeks} / {totalWeeks}</span>
                </div>
                <div className="w-full bg-[#0B0F19] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-1000 ease-out"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-[10px] text-[#9CA3AF] text-center italic">
                  {pct === 100 ? "Congratulations! Ready to schedule live assessments." : "Solve assigned challenges to increase status level."}
                </p>
              </div>
            </div>

            {/* Target Focus Areas (Diagnostic Cards) */}
            <div className="glass-panel p-6 rounded-2xl space-y-4 border border-[#1F2A45]/50">
              <div className="flex items-center gap-2">
                <Target className="h-4.5 w-4.5 text-rose-400" />
                <h4 className="text-xs font-black text-rose-400 uppercase tracking-wider">Target Weak Areas</h4>
              </div>
              <div className="space-y-3">
                {plan.weakAreas && plan.weakAreas.length > 0 ? (
                  plan.weakAreas.map((wa, idx) => (
                    <div 
                      key={idx} 
                      className="group relative bg-[#0B0F19]/60 border-l-2 border-rose-500 border-y border-r border-[#1F2A45]/40 hover:border-[#1F2A45]/80 p-3.5 rounded-r-xl transition-all duration-200"
                    >
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-rose-400 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-rose-400/80 uppercase tracking-widest">Focus Target</span>
                          <p className="text-xs text-[#F3F4F6] leading-relaxed font-semibold">
                            {wa}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-[#9CA3AF] border border-dashed border-[#1F2A45] rounded-xl bg-[#0B0F19]/20">
                    No diagnostic weak areas identified yet!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Timeline blocks */}
          <div className="lg:col-span-3 space-y-8 relative pl-4 md:pl-6">
            {/* Timeline connector thread */}
            <div className="absolute left-[3px] md:left-[5px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-indigo-500/40 via-[#1F2A45]/40 to-slate-800/20 border-dashed border-l border-[#1F2A45]/40 hidden md:block"></div>

            {plan.weeklyRoadmap?.map((week, idx) => {
              const weekState = getWeekState(week);
              const isCompleted = weekState === 'completed';
              const isActive = weekState === 'active';

              // Visual styling configuration based on target state
              const cardBorderClass = 
                isCompleted
                  ? 'border-emerald-500/25 bg-emerald-950/5 border-l-4 border-l-emerald-500 shadow-lg shadow-emerald-950/5'
                  : isActive
                  ? 'border-indigo-500/40 bg-indigo-950/10 border-l-4 border-l-indigo-500 shadow-[0_0_20px_-3px_rgba(99,102,241,0.08)]'
                  : 'border-[#1F2A45]/60 bg-[#0B0F19]/40 border-l-4 border-l-slate-700 opacity-80 hover:opacity-100';

              return (
                <motion.div
                  key={week._id || idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className={`group relative glass-panel p-6 rounded-2xl border transition-all duration-300 ${cardBorderClass}`}
                >
                  {/* Timeline bullet node */}
                  <div className="absolute -left-[30px] md:-left-[37px] top-[26px] h-[16px] w-[16px] rounded-full bg-[#0B0F19] border-2 flex items-center justify-center transition-all duration-300 hidden md:flex">
                    <div className={`h-1.5 w-1.5 rounded-full ${
                      isCompleted 
                        ? 'bg-emerald-400' 
                        : isActive 
                        ? 'bg-indigo-400 animate-ping' 
                        : 'bg-[#1F2A45]'
                    }`} />
                  </div>

                  {/* Header Row */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-[#1F2A45]/40">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                          Week {week.weekNumber}
                        </span>
                        {/* Status Badges */}
                        {isCompleted && (
                          <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle className="h-2.5 w-2.5" />
                            Completed
                          </span>
                        )}
                        {isActive && (
                          <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 animate-pulse flex items-center gap-1">
                            <Activity className="h-2.5 w-2.5" />
                            Active Target
                          </span>
                        )}
                        {!isCompleted && !isActive && (
                          <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider bg-[#1F2A45]/60 text-[#9CA3AF] border border-[#1F2A45]/30 flex items-center gap-1">
                            <Lock className="h-2.5 w-2.5" />
                            Upcoming
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold mt-1 text-white group-hover:text-indigo-300 transition-colors">
                        {week.theme}
                      </h3>
                    </div>

                    <button
                      onClick={() => toggleWeekStatus(week.weekNumber, week.status)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        isCompleted
                          ? 'bg-emerald-600/15 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-600/25'
                          : 'bg-[#0B0F19] border border-[#1F2A45] hover:border-indigo-500/30 text-[#9CA3AF] hover:text-white'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          <span>Milestone Achieved</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4" />
                          <span>Mark Done</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Body Content Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
                    {/* Syllabus Column */}
                    <div className="space-y-3.5">
                      <h4 className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Curriculum Syllabus</span>
                      </h4>
                      <div className="space-y-2 bg-[#0B0F19]/40 p-4 rounded-xl border border-[#1F2A45]/30">
                        {week.topics?.map((topic, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs text-[#F3F4F6]">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)] flex-shrink-0" />
                            <span className="leading-relaxed font-medium">{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Challenges & Resources Column */}
                    <div className="space-y-5">
                      {/* Challenges */}
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest flex items-center gap-1.5">
                          <Award className="h-3.5 w-3.5 text-indigo-400" />
                          <span>Practice Sandbox</span>
                        </h4>
                        
                        <div className="space-y-2">
                          {week.practiceChallenges && week.practiceChallenges.length > 0 ? (
                            week.practiceChallenges.map((pc) => {
                              const isSolved = getChallengeSolvedStatus(pc._id);
                              return (
                                <div 
                                  key={pc._id} 
                                  className="flex justify-between items-center bg-[#0B0F19]/60 border border-[#1F2A45]/30 p-3 rounded-xl hover:border-indigo-500/20 transition-all group/item"
                                >
                                  <div className="flex flex-col gap-0.5">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-semibold text-[#F3F4F6]">{pc.title}</span>
                                      {pc.difficulty && (
                                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                                          pc.difficulty === 'easy'
                                            ? 'bg-emerald-500/10 text-emerald-400'
                                            : pc.difficulty === 'medium'
                                            ? 'bg-amber-500/10 text-amber-400'
                                            : 'bg-rose-500/10 text-rose-400'
                                        }`}>
                                          {pc.difficulty}
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[9px] text-[#9CA3AF]">{pc.category}</span>
                                  </div>

                                  {isSolved ? (
                                    <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-bold flex items-center gap-1 select-none">
                                      <Check className="h-3 w-3" />
                                      <span>Solved</span>
                                    </span>
                                  ) : (
                                    <Link 
                                      to="/coding" 
                                      className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all group-hover/item:scale-105"
                                    >
                                      <span>Solve</span>
                                      <ChevronRight className="h-3 w-3" />
                                    </Link>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center py-4 text-xs text-[#9CA3AF] border border-dashed border-[#1F2A45] rounded-xl bg-[#0B0F19]/20">
                              No challenge matches.
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Resources */}
                      <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest flex items-center gap-1.5">
                          <Compass className="h-3.5 w-3.5 text-indigo-400" />
                          <span>Coaching Resources</span>
                        </h4>
                        <ul className="space-y-1.5">
                          {week.recommendedResources && week.recommendedResources.length > 0 ? (
                            week.recommendedResources.map((res, i) => (
                              <li 
                                key={i} 
                                className="flex items-center gap-2.5 text-xs bg-[#0B0F19]/45 border border-[#1F2A45]/20 p-2 rounded-lg hover:bg-[#0B0F19] transition-all hover:border-indigo-500/10"
                              >
                                {getResourceIcon(res)}
                                <span 
                                  className="text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors truncate w-full cursor-default select-all font-medium" 
                                  title={res}
                                >
                                  {res}
                                </span>
                              </li>
                            ))
                          ) : (
                            <div className="text-center py-4 text-xs text-[#9CA3AF] border border-dashed border-[#1F2A45] rounded-xl bg-[#0B0F19]/20">
                              No study links.
                            </div>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto glass-panel p-12 rounded-2xl text-center space-y-6 border border-[#1F2A45]/40 shadow-xl">
          <BookOpen className="h-16 w-16 text-[#1F2A45] mx-auto animate-pulse" />
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-white">No Study Plan Active</h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed max-w-sm mx-auto">
              We compile your profile parameters (ATS score, mock score failures, and weak categories) to draft a tailored week-by-week roadmap.
            </p>
          </div>
          <button
            onClick={generateRoadmap}
            disabled={generating}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all btn-glow-primary text-xs disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                <span>Compiling Study Targets...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span>Generate Study Roadmap</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
