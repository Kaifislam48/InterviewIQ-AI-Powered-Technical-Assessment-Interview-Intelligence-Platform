import React, { useEffect, useState } from 'react';
import api from '../api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  Loader2, 
  MessageSquare, 
  Send, 
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Award,
  ChevronDown,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export const MockInterview = () => {
  const [session, setSession] = useState(null); // active session info
  const [loading, setLoading] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  
  // Start form states
  const [role, setRole] = useState('MERN Stack Developer');
  const [experienceLevel, setExperienceLevel] = useState('intermediate');
  const [techStack, setTechStack] = useState('React, Node.js, Express, MongoDB');
  const [difficulty, setDifficulty] = useState('Intermediate');

  // Active chat states
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [lastEvaluation, setLastEvaluation] = useState(null);

  // Completion states
  const [finalReport, setFinalReport] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const startInterview = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/interviews/generate', {
        role,
        experienceLevel,
        techStack: techStack.split(',').map((t) => t.trim()),
        difficulty,
      });

      const { interviewId, totalQuestions: totalQ, currentQuestionIndex: currIdx, firstQuestion } = response.data.data;
      setSession({ interviewId, role, difficulty, techStack });
      setTotalQuestions(totalQ);
      setCurrentQuestionIndex(currIdx);
      setCurrentQuestion(firstQuestion);
      setLastEvaluation(null);
      setFinalReport(null);
      setUserAnswer('');
      toast.success('Mock Interview started! Here is your first question.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start interview session');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) {
      toast.error('Please type an answer before submitting');
      return;
    }

    setSubmittingAnswer(true);
    try {
      const response = await api.post(`/interviews/${session.interviewId}/answer`, {
        answer: userAnswer,
      });

      const result = response.data.data;
      setLastEvaluation(result.evaluation);
      setUserAnswer('');

      if (result.status === 'completed') {
        toast.success('Mock interview completed! Fetching your feedback report...');
        setFinalReport(result.report);
      } else {
        setCurrentQuestion(result.nextQuestion);
        setCurrentQuestionIndex(result.currentQuestionIndex);
        toast.success('Answer evaluated. Moving to next question!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit answer');
    } finally {
      setSubmittingAnswer(false);
    }
  };

  // Convert final evaluation metrics into Recharts structure
  const getChartData = () => {
    if (!finalReport) return [];
    
    // Compute averages of metrics
    let accuracy = 0, comm = 0, prob = 0, conf = 0;
    finalReport.questions.forEach((q) => {
      accuracy += q.evaluation.metrics.technicalAccuracy;
      comm += q.evaluation.metrics.communication;
      prob += q.evaluation.metrics.problemSolving;
      conf += q.evaluation.metrics.confidence;
    });

    const len = finalReport.questions.length;

    return [
      { subject: 'Accuracy', A: Math.round((accuracy / len) * 10), fullMark: 100 },
      { subject: 'Communication', A: Math.round((comm / len) * 10), fullMark: 100 },
      { subject: 'Problem Solving', A: Math.round((prob / len) * 10), fullMark: 100 },
      { subject: 'Confidence', A: Math.round((conf / len) * 10), fullMark: 100 },
    ];
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Mock Interview Console</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">
          Participate in interactive technical mock interviews tailored to your role.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* State 1: Configuration Form */}
        {!session && !finalReport && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mx-auto glass-panel p-8 rounded-2xl space-y-6"
          >
            <div className="flex items-center space-x-3 pb-4 border-b border-[#1F2A45]">
              <div className="p-2.5 bg-indigo-600/10 text-indigo-400 rounded-xl">
                <Video className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Configure Mock Interview</h3>
                <p className="text-xs text-[#9CA3AF]">Define your target parameters for the Gemini model.</p>
              </div>
            </div>

            <form onSubmit={startInterview} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold mb-2">Target Job Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-[#0B0F19]/60 border border-[#1F2A45] rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-sm text-[#F3F4F6]"
                    placeholder="MERN Stack Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0B0F19]/60 border border-[#1F2A45] rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-sm text-[#F3F4F6]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold mb-2">Experience Level</label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0B0F19]/60 border border-[#1F2A45] rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-sm text-[#F3F4F6]"
                  >
                    <option value="beginner">Junior (0-2 years)</option>
                    <option value="intermediate">Mid-Level (2-5 years)</option>
                    <option value="advanced">Senior (5+ years)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-[#0B0F19]/60 border border-[#1F2A45] rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-sm text-[#F3F4F6]"
                    placeholder="React, Node.js, Express, MongoDB"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition-all btn-glow-primary text-sm disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Generating Questions...</span>
                  </>
                ) : (
                  <>
                    <span>Start Mock Interview</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {/* State 2: Active Interview Mode */}
        {session && !finalReport && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Config Panel */}
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h4 className="text-md font-bold text-indigo-400">Session Details</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-[#9CA3AF] block text-xs uppercase tracking-wider font-semibold">Role</span>
                    <span className="font-semibold">{session.role}</span>
                  </div>
                  <div>
                    <span className="text-[#9CA3AF] block text-xs uppercase tracking-wider font-semibold">Difficulty</span>
                    <span className="font-semibold">{session.difficulty}</span>
                  </div>
                  <div>
                    <span className="text-[#9CA3AF] block text-xs uppercase tracking-wider font-semibold">Tech Stack</span>
                    <span className="text-xs font-semibold">{session.techStack}</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-[#9CA3AF] block text-xs uppercase tracking-wider font-semibold mb-2">
                      Interview Progress
                    </span>
                    <div className="w-full bg-[#0B0F19] rounded-full h-2">
                      <div 
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-[#9CA3AF] mt-1.5 block text-right font-semibold">
                      Question {currentQuestionIndex + 1} of {totalQuestions}
                    </span>
                  </div>
                </div>
              </div>

              {/* Previous Evaluation metrics */}
              {lastEvaluation && (
                <div className="glass-panel p-6 rounded-2xl space-y-4 bg-emerald-500/5 border-emerald-500/20">
                  <h4 className="text-md font-bold text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="h-5 w-5" />
                    <span>Last Answer Score</span>
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#9CA3AF]">Turn Score:</span>
                      <span className="font-bold text-emerald-400">{lastEvaluation.score}/10</span>
                    </div>
                    <p className="text-xs text-[#9CA3AF] bg-[#0B0F19]/40 p-3 rounded-lg border border-[#1F2A45] leading-relaxed">
                      {lastEvaluation.feedback}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Pane */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col min-h-[500px]">
              <div className="flex-1 space-y-6">
                {/* AI Bubble */}
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="h-5 w-5" />
                  </div>
                  <div className="bg-[#151D30]/80 border border-[#1F2A45] p-5 rounded-2xl rounded-tl-none max-w-xl">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 bg-indigo-500/10 text-indigo-400">
                      {currentQuestion?.questionType} question
                    </span>
                    <p className="text-sm font-semibold leading-relaxed">
                      {currentQuestion?.questionText}
                    </p>
                  </div>
                </div>

                {/* User Input Bubble */}
                <div className="flex gap-4 flex-row-reverse">
                  <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 font-bold shadow-glow">
                    U
                  </div>
                  <div className="w-full max-w-xl">
                    <form onSubmit={submitAnswer} className="space-y-4">
                      <textarea
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type your detailed response here..."
                        className="w-full min-h-[150px] p-4 bg-[#0B0F19]/60 border border-[#1F2A45] rounded-2xl focus:outline-none focus:border-indigo-500 transition-colors text-sm text-[#F3F4F6] resize-none"
                      />
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={submittingAnswer || !userAnswer.trim()}
                          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl flex items-center space-x-2 transition-all btn-glow-primary text-sm disabled:opacity-50"
                        >
                          {submittingAnswer ? (
                            <>
                              <Loader2 className="animate-spin h-4 w-4" />
                              <span>Evaluating answer...</span>
                            </>
                          ) : (
                            <>
                              <span>Submit Answer</span>
                              <Send className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* State 3: Completion Report Mode */}
        {finalReport && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Score header */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center gap-8 justify-between">
              <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <div className="relative h-24 w-24 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-black text-2xl shadow-glow">
                  {finalReport.overallScore}%
                </div>
                <div>
                  <h3 className="text-xl font-bold">Interview Analysis Complete</h3>
                  <p className="text-sm text-[#9CA3AF] mt-1 max-w-lg">
                    {finalReport.overallFeedback}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSession(null);
                  setFinalReport(null);
                }}
                className="px-6 py-3 bg-[#151D30] hover:bg-[#1F2A45] border border-[#1F2A45] text-white font-semibold rounded-xl text-sm transition-all"
              >
                Start Another Session
              </button>
            </div>

            {/* Radar Charts & Topics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Radar chart */}
              <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col items-center">
                <h4 className="text-md font-bold mb-6 self-start flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-indigo-400" />
                  <span>Performance Metrics</span>
                </h4>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getChartData()}>
                      <PolarGrid stroke="#1F2A45" />
                      <PolarAngleAxis dataKey="subject" stroke="#9CA3AF" fontSize={11} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#1F2A45" />
                      <Radar name="Score" dataKey="A" stroke="#6366F1" fill="#6366F1" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Skill Recommendations */}
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h4 className="text-md font-bold text-rose-400 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span>Turn Breakdown</span>
                </h4>
                <p className="text-xs text-[#9CA3AF]">
                  Toggle the drop downs below to view the detailed question evaluation transcript.
                </p>
              </div>
            </div>

            {/* Dialogues list */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h4 className="text-lg font-bold">Dialogue Transcript</h4>
              
              <div className="space-y-4">
                {finalReport.questions.map((q, i) => (
                  <div key={q._id} className="border border-[#1F2A45] rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                      className="w-full p-4 bg-[#0B0F19]/40 flex justify-between items-center text-left hover:bg-[#151D30]/30 transition-colors"
                    >
                      <span className="text-sm font-semibold truncate w-11/12">
                        Q{i+1}: {q.questionText}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-[#9CA3AF] transition-transform ${
                        expandedIndex === i ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {expandedIndex === i && (
                      <div className="p-4 bg-[#151D30]/40 border-t border-[#1F2A45] space-y-4 text-sm">
                        <div>
                          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">Your Answer</p>
                          <p className="text-[#F3F4F6] leading-relaxed bg-[#0B0F19]/40 p-3 rounded-lg border border-[#1F2A45]">
                            {q.userAnswer}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1 flex justify-between">
                            <span>Evaluator Feedback</span>
                            <span>Score: {q.evaluation.score}/10</span>
                          </p>
                          <p className="text-[#9CA3AF] leading-relaxed">
                            {q.evaluation.feedback}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
