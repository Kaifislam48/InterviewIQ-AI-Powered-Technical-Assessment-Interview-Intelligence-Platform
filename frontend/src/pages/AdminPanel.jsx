import React, { useEffect, useState } from 'react';
import api from '../api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Users, 
  Video, 
  Settings, 
  Trash2, 
  PlusCircle, 
  Search, 
  Loader2, 
  Award,
  BookOpen
} from 'lucide-react';

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingTest, setSubmittingTest] = useState(false);

  // Assessment designer states
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState('mcq');
  const [newDuration, setNewDuration] = useState(15);
  const [mcqQuestionsList, setMcqQuestionsList] = useState([]);
  const [codingProblemsList, setCodingProblemsList] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedChallenges, setSelectedChallenges] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.get('/admin/analytics');
      setStats(statsRes.data.data);

      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data.data);

      // Load available questions & coding challenges to compose new test
      const asmRes = await api.get('/assessments/list');
      const allAsm = asmRes.data.data;
      
      const questionsMap = [];
      const challengesMap = [];
      allAsm.forEach((a) => {
        if (a.questions) questionsMap.push(...a.questions);
        if (a.codingChallenges) challengesMap.push(...a.codingChallenges);
      });

      // Filter out duplicate objects in lists
      const uniqueQuestions = Array.from(new Map(questionsMap.map(q => [q._id, q])).values());
      const uniqueChallenges = Array.from(new Map(challengesMap.map(c => [c._id, c])).values());

      setMcqQuestionsList(uniqueQuestions);
      setCodingProblemsList(uniqueChallenges);
    } catch (err) {
      toast.error('Failed to load administrative analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you absolutely sure you want to remove this user profile?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User removed from platform');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove user');
    }
  };

  const handleCreateAssessment = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Test title is required');
      return;
    }
    
    setSubmittingTest(true);
    try {
      await api.post('/admin/assessments', {
        title: newTitle,
        description: newDesc,
        type: newType,
        duration: Number(newDuration),
        questions: selectedQuestions,
        codingChallenges: selectedChallenges,
      });

      toast.success('Custom timed assessment created successfully!');
      setNewTitle('');
      setNewDesc('');
      setSelectedQuestions([]);
      setSelectedChallenges([]);
      fetchData();
    } catch (err) {
      toast.error('Failed to create assessment module');
    } finally {
      setSubmittingTest(false);
    }
  };

  const handleToggleQuestion = (id) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleChallenge = (id) => {
    setSelectedChallenges((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  if (loading && !stats) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-indigo-500" />
      </div>
    );
  }

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-rose-400 flex items-center gap-2">
            <ShieldAlert className="h-8 w-8" />
            <span>Platform Administrative Panel</span>
          </h1>
          <p className="text-[#9CA3AF] text-sm mt-1">
            Access system logs, block or remove users, and build customized assessment challenges.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-[#151D30] border border-[#1F2A45] p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'stats' ? 'bg-rose-600 text-white' : 'text-[#9CA3AF]'
            }`}
          >
            Usage Analytics
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'users' ? 'bg-rose-600 text-white' : 'text-[#9CA3AF]'
            }`}
          >
            User Profiles
          </button>
          <button
            onClick={() => setActiveTab('designer')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'designer' ? 'bg-rose-600 text-white' : 'text-[#9CA3AF]'
            }`}
          >
            Test Designer
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Tab 1: Usage Stats */}
        {activeTab === 'stats' && stats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Stats KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl glass-panel relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Registered Candidates</p>
                    <h3 className="text-4xl font-extrabold mt-2 text-glow text-rose-400">
                      {stats.totalUsers}
                    </h3>
                  </div>
                  <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl glass-panel relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Daily Active Users</p>
                    <h3 className="text-4xl font-extrabold mt-2 text-glow text-cyan-400">
                      {stats.dailyActiveUsers}
                    </h3>
                  </div>
                  <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
                    <Settings className="h-6 w-6" />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl glass-panel relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Total Mock Interviews</p>
                    <h3 className="text-4xl font-extrabold mt-2 text-glow text-emerald-400">
                      {stats.totalInterviews}
                    </h3>
                  </div>
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                    <Video className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* AI query usage log */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-lg font-bold">Winston & Gemini System Logs</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-[#0B0F19]/60 border border-[#1F2A45] rounded-xl text-center">
                  <span className="text-xs text-[#9CA3AF] block font-semibold mb-1">Total API Queries</span>
                  <span className="text-3xl font-extrabold text-indigo-400">{stats.aiUsageStatistics?.totalQueries || 0}</span>
                </div>
                <div className="p-4 bg-[#0B0F19]/60 border border-[#1F2A45] rounded-xl text-center">
                  <span className="text-xs text-[#9CA3AF] block font-semibold mb-1">Resume Reviews</span>
                  <span className="text-3xl font-extrabold text-cyan-400">{stats.aiUsageStatistics?.resumeAnalyses || 0}</span>
                </div>
                <div className="p-4 bg-[#0B0F19]/60 border border-[#1F2A45] rounded-xl text-center">
                  <span className="text-xs text-[#9CA3AF] block font-semibold mb-1">Mock Question Turns</span>
                  <span className="text-3xl font-extrabold text-emerald-400">{stats.aiUsageStatistics?.interviewEvaluations || 0}</span>
                </div>
                <div className="p-4 bg-[#0B0F19]/60 border border-[#1F2A45] rounded-xl text-center">
                  <span className="text-xs text-[#9CA3AF] block font-semibold mb-1">Playground runs</span>
                  <span className="text-3xl font-extrabold text-amber-400">{stats.aiUsageStatistics?.codingSubmissions || 0}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: User Profiles list */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Search Input */}
            <div className="relative max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF]">
                <Search className="h-5 w-5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidate by name or email..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#151D30] border border-[#1F2A45] rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-sm text-[#F3F4F6]"
              />
            </div>

            {/* List */}
            <div className="glass-panel p-6 rounded-2xl overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-[#9CA3AF] uppercase border-b border-[#1F2A45]">
                  <tr>
                    <th scope="col" className="pb-3 pr-4">Name</th>
                    <th scope="col" className="pb-3 px-4">Email</th>
                    <th scope="col" className="pb-3 px-4">Role</th>
                    <th scope="col" className="pb-3 px-4">Status</th>
                    <th scope="col" className="pb-3 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F2A45]">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="text-[#F3F4F6]">
                      <td className="py-4 pr-4 font-semibold">{u.name}</td>
                      <td className="py-4 px-4">{u.email}</td>
                      <td className="py-4 px-4 capitalize">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${
                          u.role === 'admin' ? 'bg-rose-500/10 text-rose-400' : 'bg-indigo-500/10 text-indigo-400'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${
                          u.isVerified ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {u.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          disabled={u.role === 'admin'}
                          className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Test Designer Form */}
        {activeTab === 'designer' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto glass-panel p-8 rounded-2xl"
          >
            <div className="flex items-center space-x-3 pb-4 border-b border-[#1F2A45] mb-6">
              <PlusCircle className="h-6 w-6 text-rose-400" />
              <div>
                <h3 className="text-lg font-bold">Draft Custom Timed Test</h3>
                <p className="text-xs text-[#9CA3AF]">Bundle MCQs or Coding problems into assessment packages.</p>
              </div>
            </div>

            <form onSubmit={handleCreateAssessment} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Test Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  placeholder="e.g. React Junior Knowledge Assessment"
                  className="w-full px-4 py-2.5 bg-[#0B0F19]/60 border border-[#1F2A45] rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-sm text-[#F3F4F6]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Test Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Summarize target criteria, topics, and pass parameters."
                  className="w-full h-24 p-3 bg-[#0B0F19]/60 border border-[#1F2A45] rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-sm text-[#F3F4F6]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold mb-2">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => {
                      setNewType(e.target.value);
                      setSelectedQuestions([]);
                      setSelectedChallenges([]);
                    }}
                    className="w-full px-4 py-2.5 bg-[#0B0F19]/60 border border-[#1F2A45] rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-sm text-[#F3F4F6]"
                  >
                    <option value="mcq">MCQ Quiz</option>
                    <option value="coding">Coding Sandbox</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    required
                    min={5}
                    className="w-full px-4 py-2.5 bg-[#0B0F19]/60 border border-[#1F2A45] rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-sm text-[#F3F4F6]"
                  />
                </div>
              </div>

              {/* Compose Questions items list */}
              {newType === 'mcq' ? (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold">Select MCQs questions to include</label>
                  <div className="space-y-2 max-h-[180px] overflow-y-auto border border-[#1F2A45] rounded-xl p-3 bg-[#0B0F19]/40">
                    {mcqQuestionsList.map((q) => (
                      <label key={q._id} className="flex items-center space-x-3 text-xs cursor-pointer p-1">
                        <input
                          type="checkbox"
                          checked={selectedQuestions.includes(q._id)}
                          onChange={() => handleToggleQuestion(q._id)}
                          className="rounded text-rose-500 focus:ring-rose-500 bg-[#0B0F19] border-[#1F2A45]"
                        />
                        <span className="truncate w-10/12">{q.questionText}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold">Select Coding Challenges to include</label>
                  <div className="space-y-2 max-h-[180px] overflow-y-auto border border-[#1F2A45] rounded-xl p-3 bg-[#0B0F19]/40">
                    {codingProblemsList.map((c) => (
                      <label key={c._id} className="flex items-center space-x-3 text-xs cursor-pointer p-1">
                        <input
                          type="checkbox"
                          checked={selectedChallenges.includes(c._id)}
                          onChange={() => handleToggleChallenge(c._id)}
                          className="rounded text-rose-500 focus:ring-rose-500 bg-[#0B0F19] border-[#1F2A45]"
                        />
                        <span>{c.title} ({c.category})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submittingTest || (newType === 'mcq' ? selectedQuestions.length === 0 : selectedChallenges.length === 0)}
                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition-all btn-glow-secondary text-sm disabled:opacity-50"
              >
                {submittingTest ? <Loader2 className="animate-spin h-5 w-5" /> : <span>Create Timed Assessment</span>}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
