import React, { useEffect, useState } from 'react';
import api from '../api';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { 
  Award, 
  FileText, 
  Video, 
  Code2, 
  Loader2, 
  CheckCircle,
  Activity, 
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';

export const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/users/dashboard-metrics');
        setData(response.data.data);
      } catch (error) {
        toast.error('Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-indigo-500" />
      </div>
    );
  }

  const { metrics, recentActivities, skillProgress, weakAreas, recommendedTopics } = data || {};

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Candidate Workspace</h1>
          <p className="text-[#9CA3AF] text-sm mt-1">
            Monitor your interview readiness and complete technical practice challenges.
          </p>
        </div>
        <div className="flex gap-3">
          <Link 
            to="/interview" 
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl flex items-center space-x-2 transition-all btn-glow-primary"
          >
            <Video className="h-4 w-4" />
            <span>Mock Interview</span>
          </Link>
          <Link 
            to="/resume" 
            className="px-4 py-2.5 bg-[#151D30] hover:bg-[#1F2A45] border border-[#1F2A45] text-white text-sm font-semibold rounded-xl flex items-center space-x-2 transition-all"
          >
            <FileText className="h-4 w-4" />
            <span>Upload Resume</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mock Interview KPI */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="p-6 rounded-2xl glass-panel relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Avg Interview Score</p>
              <h3 className="text-4xl font-extrabold mt-2 text-glow text-indigo-400">
                {metrics?.interviewScore || 0}%
              </h3>
            </div>
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
              <Video className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-[#9CA3AF] mt-4 flex items-center gap-1">
            <Activity className="h-3 w.3 text-emerald-400" />
            <span>Based on {metrics?.totalInterviews || 0} AI interview sessions</span>
          </p>
        </motion.div>

        {/* Assessments KPI */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="p-6 rounded-2xl glass-panel relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Avg Assessment Score</p>
              <h3 className="text-4xl font-extrabold mt-2 text-glow text-cyan-400">
                {metrics?.assessmentScore || 0}%
              </h3>
            </div>
            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
              <Award className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-[#9CA3AF] mt-4 flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-emerald-400" />
            <span>Aim for 60% standard passing score</span>
          </p>
        </motion.div>

        {/* Resume ATS KPI */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="p-6 rounded-2xl glass-panel relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Latest Resume ATS</p>
              <h3 className="text-4xl font-extrabold mt-2 text-glow text-emerald-400">
                {metrics?.resumeScore || 0}%
              </h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
              <FileText className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xs text-[#9CA3AF] mt-4 flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-emerald-400" />
            <span>Optimal score is 80%+</span>
          </p>
        </motion.div>
      </div>

      {/* Main Grid: Recent Activity vs Study plans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity List */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Recent Prep Activity</h3>
            <span className="text-xs text-[#9CA3AF] hover:underline cursor-pointer">View All</span>
          </div>

          <div className="space-y-4">
            {recentActivities && recentActivities.length > 0 ? (
              recentActivities.map((act) => (
                <div 
                  key={act.id} 
                  className="flex items-center justify-between p-4 bg-[#0B0F19]/40 border border-[#1F2A45] rounded-xl hover:border-indigo-500/30 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2.5 rounded-lg ${
                      act.type === 'interview' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-cyan-500/10 text-cyan-400'
                    }`}>
                      {act.type === 'interview' ? <Video className="h-5 w-5" /> : <Award className="h-5 w-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">{act.title}</h4>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">
                        {new Date(act.date).toLocaleDateString(undefined, { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      act.score >= 70 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {act.score}%
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-[#9CA3AF] text-sm">
                No recent attempts. Start practicing by launching an interview or coding problem!
              </div>
            )}
          </div>
        </div>

        {/* Study roadmap and stats */}
        <div className="space-y-6">
          {/* Practice Recommendations */}
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <h3 className="text-lg font-bold">Recommended Topics</h3>
            <div className="space-y-3">
              {recommendedTopics && recommendedTopics.map((topic, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-3.5 bg-[#0B0F19]/60 border border-[#1F2A45] rounded-xl"
                >
                  <span className="text-sm font-semibold text-[#F3F4F6]">{topic}</span>
                  <Link 
                    to="/coding" 
                    className="p-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-lg transition-colors"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Weak areas */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-rose-400">Focus Areas</h3>
            <ul className="space-y-2.5">
              {weakAreas && weakAreas.map((area, i) => (
                <li key={i} className="flex items-center space-x-2.5 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                  <span className="text-[#F3F4F6]">{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
