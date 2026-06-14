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
  Compass
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LearningRoadmap = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchPlan = async () => {
    try {
      const response = await api.get('/learning/plan');
      setPlan(response.data.data);
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
      toast.success('Gemini compiled your personalized 3-week study roadmap!');
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

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-indigo-500" />
      </div>
    );
  }

  // Calculate overall roadmap completion rate
  const getProgressPercent = () => {
    if (!plan || !plan.weeklyRoadmap?.length) return 0;
    const completed = plan.weeklyRoadmap.filter((w) => w.status === 'completed').length;
    return Math.round((completed / plan.weeklyRoadmap.length) * 100);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personalized Study Engine</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">
            Gemini parses your past performance logs to curate a focused week-by-week technical curriculum.
          </p>
        </div>
        {plan && (
          <button
            onClick={generateRoadmap}
            disabled={generating}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center space-x-2 transition-all btn-glow-primary disabled:opacity-50"
          >
            {generating ? (
              <Loader2 className="animate-spin h-3.5 w-3.5" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            )}
            <span>Regenerate Study Plan</span>
          </button>
        )}
      </div>

      {plan ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left stats card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel p-6 rounded-2xl text-center space-y-4">
              <h4 className="text-sm font-bold text-[#9CA3AF] uppercase tracking-wider">Plan Completion</h4>
              <div className="relative h-24 w-24 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center font-black text-2xl shadow-glow mx-auto">
                {getProgressPercent()}%
              </div>
              <p className="text-xs text-[#9CA3AF]">
                Complete all week goals to achieve mock interview readiness.
              </p>
            </div>

            {/* Target focus topics */}
            <div className="glass-panel p-6 rounded-2xl space-y-3">
              <h4 className="text-sm font-bold text-rose-400">Target Weak Areas</h4>
              <div className="space-y-2">
                {plan.weakAreas?.map((wa, idx) => (
                  <span key={idx} className="block text-xs bg-[#0B0F19] border border-[#1F2A45] p-2.5 rounded-lg text-[#F3F4F6]">
                    {wa}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Roadmap weekly blocks */}
          <div className="lg:col-span-3 space-y-6">
            {plan.weeklyRoadmap?.map((week) => (
              <motion.div
                key={week._id}
                whileHover={{ y: -2 }}
                className={`glass-panel p-6 rounded-2xl border transition-all ${
                  week.status === 'completed' 
                    ? 'border-emerald-500/30 bg-emerald-500/5' 
                    : 'border-[#1F2A45]'
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-[#1F2A45]">
                  <div>
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Week {week.weekNumber}</span>
                    <h3 className="text-lg font-bold mt-1">{week.theme}</h3>
                  </div>

                  <button
                    onClick={() => toggleWeekStatus(week.weekNumber, week.status)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      week.status === 'completed'
                        ? 'bg-emerald-600/15 border border-emerald-500/30 text-emerald-400'
                        : 'bg-[#0B0F19] border border-[#1F2A45] hover:border-indigo-500/30 text-[#9CA3AF] hover:text-[#F3F4F6]'
                    }`}
                  >
                    {week.status === 'completed' ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4" />
                        <span>Mark Done</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-sm">
                  {/* Left Column: Topics */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Topics to master</h4>
                    <ul className="space-y-2">
                      {week.topics?.map((topic, i) => (
                        <li key={i} className="flex items-center space-x-2 text-xs">
                          <span className="h-1 w-1 rounded-full bg-indigo-500"></span>
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right Column: Practice Problems & Resources */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Practice Challenge</h4>
                      {week.practiceChallenges?.map((pc) => (
                        <div key={pc._id} className="flex justify-between items-center bg-[#0B0F19]/40 border border-[#1F2A45] p-3 rounded-xl">
                          <span className="text-xs font-semibold">{pc.title}</span>
                          <Link 
                            to="/coding" 
                            className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                          >
                            <span>Code</span>
                            <Play className="h-3 w-3" />
                          </Link>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Study Resources</h4>
                      <ul className="space-y-1">
                        {week.recommendedResources?.map((res, i) => (
                          <li key={i} className="text-xs text-indigo-400 flex items-center gap-1">
                            <Compass className="h-3.5 w-3.5" />
                            <span>{res}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto glass-panel p-12 rounded-2xl text-center space-y-6">
          <BookOpen className="h-16 w-16 text-[#1F2A45] mx-auto animate-pulse" />
          <div>
            <h3 className="text-xl font-bold">No Study Plan Active</h3>
            <p className="text-sm text-[#9CA3AF] mt-1.5 leading-relaxed">
              We need a baseline of your skills to compile a personalized week-by-week curriculum. Click below to compile your profile and generate your roadmap.
            </p>
          </div>
          <button
            onClick={generateRoadmap}
            disabled={generating}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition-all btn-glow-primary text-sm disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                <span>Compiling Study Targets...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 animate-pulse" />
                <span>Generate Study Roadmap</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
