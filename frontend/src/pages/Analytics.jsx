import React, { useEffect, useState } from 'react';
import api from '../api';
import { toast } from 'react-hot-toast';
import { Loader2, TrendingUp, Award, BarChart3, AlertCircle } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend 
} from 'recharts';

export const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/users/dashboard-metrics');
        setData(response.data.data);
      } catch (err) {
        toast.error('Failed to load performance analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-indigo-500" />
      </div>
    );
  }

  const { metrics, skillProgress, weakAreas, recentActivities } = data || {};

  // Formulate scoring trends for Recharts
  const trendData = [
    { name: 'Week 1', Interview: 60, Assessment: 50 },
    { name: 'Week 2', Interview: 68, Assessment: 60 },
    { name: 'Week 3', Interview: 75, Assessment: 58 },
    { name: 'Week 4', Interview: metrics?.interviewScore || 80, Assessment: metrics?.assessmentScore || 70 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">
          Review detailed progress graphs, study indicators, and trend parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Scoring Trends */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-md font-bold mb-6 flex items-center gap-1.5">
            <TrendingUp className="h-5 w-5 text-indigo-400" />
            <span>Weekly Scoring Trends</span>
          </h3>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid stroke="#1F2A45" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151D30', borderColor: '#1F2A45', color: '#F3F4F6' }}
                />
                <Legend />
                <Line type="monotone" dataKey="Interview" stroke="#6366F1" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Assessment" stroke="#06B6D4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Skill progress bar chart */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-md font-bold mb-6 flex items-center gap-1.5">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            <span>Syllabus Category Progress</span>
          </h3>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillProgress}>
                <CartesianGrid stroke="#1F2A45" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} />
                <YAxis stroke="#9CA3AF" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151D30', borderColor: '#1F2A45', color: '#F3F4F6' }}
                />
                <Bar dataKey="progress" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Focus areas and attempts count */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl md:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-rose-400 flex items-center gap-1.5">
            <AlertCircle className="h-4.5 w-4.5" />
            <span>Weak Areas to Improve</span>
          </h3>
          <ul className="space-y-3">
            {weakAreas && weakAreas.map((weak, i) => (
              <li key={i} className="text-sm bg-[#0B0F19]/40 border border-[#1F2A45] p-3 rounded-xl">
                {weak}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel p-6 rounded-2xl md:col-span-2 space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5">
            <Award className="h-4.5 w-4.5 text-indigo-400" />
            <span>Platform Accomplishments</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="text-center p-3 bg-[#0B0F19]/50 border border-[#1F2A45] rounded-xl">
              <span className="text-2xl font-bold text-indigo-400 block">{metrics?.totalInterviews || 0}</span>
              <span className="text-[10px] text-[#9CA3AF] uppercase">Interviews Run</span>
            </div>
            <div className="text-center p-3 bg-[#0B0F19]/50 border border-[#1F2A45] rounded-xl">
              <span className="text-2xl font-bold text-cyan-400 block">{metrics?.totalSubmissions || 0}</span>
              <span className="text-[10px] text-[#9CA3AF] uppercase">Code Submitted</span>
            </div>
            <div className="text-center p-3 bg-[#0B0F19]/50 border border-[#1F2A45] rounded-xl">
              <span className="text-2xl font-bold text-emerald-400 block">{metrics?.codingAccuracy || 0}%</span>
              <span className="text-[10px] text-[#9CA3AF] uppercase">Submission Pass</span>
            </div>
            <div className="text-center p-3 bg-[#0B0F19]/50 border border-[#1F2A45] rounded-xl">
              <span className="text-2xl font-bold text-amber-400 block">{metrics?.resumeScore || 0}%</span>
              <span className="text-[10px] text-[#9CA3AF] uppercase">Resume Grade</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
