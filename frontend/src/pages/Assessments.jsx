import React, { useEffect, useState } from 'react';
import api from '../api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Play,
  Loader2,
  ChevronRight,
  History
} from 'lucide-react';

const getStarterCode = (challenge, lang) => {
  if (!challenge) return '';
  const found = challenge.starterCode?.find(s => s.language === lang);
  if (found) return found.code;

  // Dynamic templating fallbacks based on challenge title
  if (challenge.title === 'Two Sum') {
    if (lang === 'go') return `package main\n\nfunc twoSum(nums []int, target int) []int {\n    // Write your Go code here\n    return []int{}\n}`;
    if (lang === 'rust') return `impl Solution {\n    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n        // Write your Rust code here\n        vec![]\n    }\n}`;
    if (lang === 'ruby') return `# @param {Integer[]} nums\n# @param {Integer} target\n# @return {Integer[]}\ndef two_sum(nums, target)\n    # Write your Ruby code here\nend`;
    if (lang === 'typescript') return `function twoSum(nums: number[], target: number): number[] {\n    // Write your TypeScript code here\n    return [];\n}`;
    if (lang === 'java') return `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your Java code here\n        return new int[]{};\n    }\n}`;
    if (lang === 'cpp') return `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your C++ code here\n        return {};\n    }\n}`;
  }

  if (challenge.title === 'Reverse a String') {
    if (lang === 'go') return `package main\n\nfunc reverseString(s []string) []string {\n    // Write your Go code here\n    return s\n}`;
    if (lang === 'rust') return `pub fn reverse_string(s: &mut Vec<char>) {\n    // Write your Rust code here\n}`;
    if (lang === 'ruby') return `def reverse_string(s)\n    # Write your Ruby code here\nend`;
    if (lang === 'typescript') return `function reverseString(s: string[]): string[] {\n    // Write your TypeScript code here\n    return s;\n}`;
    if (lang === 'java') return `class Solution {\n    public void reverseString(char[] s) {\n        // Write your Java code here\n    }\n}`;
    if (lang === 'cpp') return `class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        // Write your C++ code here\n    }\n}`;
  }

  if (challenge.title === 'Valid Parentheses') {
    if (lang === 'go') return `package main\n\nfunc isValid(s string) bool {\n    // Write your Go code here\n    return false\n}`;
    if (lang === 'rust') return `impl Solution {\n    pub fn is_valid(s: String) -> bool {\n        // Write your Rust code here\n        false\n    }\n}`;
    if (lang === 'ruby') return `def is_valid(s)\n    # Write your Ruby code here\n    false\nend`;
    if (lang === 'typescript') return `function isValid(s: string): boolean {\n    // Write your TypeScript code here\n    return false;\n}`;
    if (lang === 'java') return `class Solution {\n    public boolean isValid(String s) {\n        // Write your Java code here\n        return false;\n    }\n}`;
    if (lang === 'cpp') return `class Solution {\npublic:\n    bool isValid(string s) {\n        // Write your C++ code here\n        return false;\n    }\n}`;
  }

  // Default template fallbacks
  if (lang === 'go') return `package main\n\nfunc main() {\n    // Write your Go code here\n}`;
  if (lang === 'rust') return `fn main() {\n    // Write your Rust code here\n}`;
  if (lang === 'ruby') return `# Write your Ruby code here`;
  if (lang === 'typescript') return `// Write your TypeScript code here`;
  if (lang === 'java') return `class Solution {\n    public static void main(String[] args) {\n        // Write your Java code here\n    }\n}`;
  if (lang === 'cpp') return `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ code here\n    return 0;\n}`;
  if (lang === 'python') return `def main():\n    # Write your Python code here\n    pass`;
  if (lang === 'javascript') return `function main() {\n    // Write your JavaScript code here\n}`;

  return `// Write your code here`;
};

export const Assessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list');

  // Active exam states
  const [activeExam, setActiveExam] = useState(null);
  const [examQuestions, setExamQuestions] = useState([]);
  const [examChallenges, setExamChallenges] = useState([]);
  const [answers, setAnswers] = useState([]); // Array of { questionId, selectedOptions: [] } or { codingChallengeId, submittedCode, language }
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submittingExam, setSubmittingExam] = useState(false);

  // Result display
  const [examResult, setExamResult] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const listRes = await api.get('/assessments/list');
      setAssessments(listRes.data.data);

      const historyRes = await api.get('/assessments/history');
      setAttempts(historyRes.data.data);
    } catch (err) {
      toast.error('Failed to load assessment details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Timer countdown hook
  useEffect(() => {
    if (!activeExam || secondsLeft <= 0) {
      if (activeExam && secondsLeft === 0) {
        autoSubmitExam();
      }
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeExam, secondsLeft]);

  const startAssessment = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/assessments/${id}`);
      const data = response.data.data;
      
      setActiveExam(data);
      setExamQuestions(data.questions || []);
      setExamChallenges(data.codingChallenges || []);
      setCurrentIdx(0);
      setSecondsLeft(data.duration * 60);
      setExamResult(null);

      // Initialize answers empty structure
      const initialAnswers = [];
      (data.questions || []).forEach((q) => {
        initialAnswers.push({ questionId: q._id, selectedOptions: [] });
      });
      (data.codingChallenges || []).forEach((c) => {
        initialAnswers.push({ 
          codingChallengeId: c._id, 
          submittedCode: c.starterCode?.find(s => s.language === 'javascript')?.code || '', 
          language: 'javascript' 
        });
      });
      setAnswers(initialAnswers);
    } catch (err) {
      toast.error('Failed to start assessment session');
    } finally {
      setLoading(false);
    }
  };

  const handleMCQSelect = (questionId, optionIndex, isMultiple = false) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((ans) => {
        if (ans.questionId !== questionId) return ans;
        
        let currentOptions = [...ans.selectedOptions];
        if (isMultiple) {
          if (currentOptions.includes(optionIndex)) {
            currentOptions = currentOptions.filter((item) => item !== optionIndex);
          } else {
            currentOptions.push(optionIndex);
          }
        } else {
          currentOptions = [optionIndex];
        }
        return { ...ans, selectedOptions: currentOptions };
      })
    );
  };

  const handleCodeChange = (challengeId, code) => {
    setAnswers((prevAnswers) =>
      prevAnswers.map((ans) => {
        if (ans.codingChallengeId !== challengeId) return ans;
        return { ...ans, submittedCode: code };
      })
    );
  };

  const handleLanguageChange = (challenge, newLang) => {
    const defaultCode = getStarterCode(challenge, newLang);
    setAnswers((prevAnswers) =>
      prevAnswers.map((ans) => {
        if (ans.codingChallengeId !== challenge._id) return ans;
        return { ...ans, language: newLang, submittedCode: defaultCode };
      })
    );
  };

  const submitExam = async () => {
    setSubmittingExam(true);
    const durationUsed = activeExam.duration * 60 - secondsLeft;

    try {
      const response = await api.post(`/assessments/${activeExam._id}/submit`, {
        timeTaken: durationUsed,
        answers,
      });

      setExamResult(response.data.data);
      setActiveExam(null);
      fetchData();
      toast.success('Assessment completed and scored!');
    } catch (err) {
      toast.error('Failed to submit assessment answers');
    } finally {
      setSubmittingExam(false);
    }
  };

  const autoSubmitExam = () => {
    toast.error('Time limit reached! Submitting answers automatically...', { duration: 5000 });
    submitExam();
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  if (loading && assessments.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header bar */}
      {!activeExam && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Technical Assessments</h1>
            <p className="text-[#9CA3AF] text-sm mt-1">
              Attempt structured, timed MCQ and coding quizzes to demonstrate your engineering skills.
            </p>
          </div>
          <div className="flex bg-[#151D30] border border-[#1F2A45] p-1 rounded-xl gap-1">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'list' ? 'bg-indigo-600 text-white' : 'text-[#9CA3AF]'
              }`}
            >
              Assessments List
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'history' ? 'bg-indigo-600 text-white' : 'text-[#9CA3AF]'
              }`}
            >
              Attempt Logs
            </button>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* State 1: Active Exam Runner */}
        {activeExam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-8"
          >
            {/* Left Nav Bar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-panel p-6 rounded-2xl text-center space-y-4">
                <div className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Remaining Time</div>
                <div className="text-3xl font-black text-glow text-rose-400 flex items-center justify-center gap-2">
                  <Clock className="h-7 w-7 animate-pulse" />
                  <span>{formatTime(secondsLeft)}</span>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl">
                <h4 className="text-sm font-bold mb-4">Question List</h4>
                <div className="grid grid-cols-4 gap-2">
                  {[...examQuestions, ...examChallenges].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIdx(index)}
                      className={`h-10 rounded-xl font-bold transition-all text-sm border ${
                        currentIdx === index
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-glow'
                          : 'bg-[#0B0F19]/40 border-[#1F2A45] hover:border-[#1F2A45]/80'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={submitExam}
                disabled={submittingExam}
                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition-all btn-glow-primary text-sm disabled:opacity-50"
              >
                {submittingExam ? <Loader2 className="animate-spin h-5 w-5" /> : <span>Finish & Submit</span>}
              </button>
            </div>

            {/* Middle Question pane */}
            <div className="lg:col-span-3 glass-panel p-6 rounded-2xl space-y-6">
              {currentIdx < examQuestions.length ? (
                // MCQ Question Layout
                <div className="space-y-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-xs font-semibold uppercase tracking-wider mb-2">
                      Multiple Choice ({examQuestions[currentIdx].difficulty})
                    </span>
                    <h3 className="text-xl font-bold leading-relaxed">
                      {examQuestions[currentIdx].questionText}
                    </h3>
                  </div>

                  <div className="space-y-3 pt-4">
                    {examQuestions[currentIdx].options.map((option, idx) => {
                      const ansObj = answers.find((a) => a.questionId === examQuestions[currentIdx]._id);
                      const isSelected = ansObj ? ansObj.selectedOptions.includes(idx) : false;

                      return (
                        <div
                          key={idx}
                          onClick={() => handleMCQSelect(examQuestions[currentIdx]._id, idx, examQuestions[currentIdx].correctOptions.length > 1)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-indigo-600/15 border-indigo-500 text-[#F3F4F6]'
                              : 'bg-[#0B0F19]/40 border-[#1F2A45] hover:border-[#1F2A45]/80'
                          }`}
                        >
                          <span className="text-sm font-semibold">{option}</span>
                          <span className={`h-5 w-5 rounded-full border flex items-center justify-center text-xs font-bold ${
                            isSelected ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-[#1F2A45]'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                // Coding Challenge Layout
                <div className="space-y-6">
                  {(() => {
                    const chIndex = currentIdx - examQuestions.length;
                    const challenge = examChallenges[chIndex];
                    const ansObj = answers.find((a) => a.codingChallengeId === challenge._id);

                    return (
                      <div className="space-y-6">
                        <div>
                          <span className="inline-block px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-lg text-xs font-semibold uppercase tracking-wider mb-2">
                            Coding Challenge ({challenge.difficulty})
                          </span>
                          <h3 className="text-xl font-bold">{challenge.title}</h3>
                          <p className="text-sm text-[#9CA3AF] mt-1 whitespace-pre-line leading-relaxed">
                            {challenge.description}
                          </p>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-bold">Solution Sandbox ({ansObj?.language === 'cpp' ? 'C++' : (ansObj?.language?.charAt(0)?.toUpperCase() + ansObj?.language?.slice(1) || 'JavaScript')})</label>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-[#9CA3AF]">Language:</span>
                              <select
                                value={ansObj ? ansObj.language : 'javascript'}
                                onChange={(e) => handleLanguageChange(challenge, e.target.value)}
                                className="bg-[#0B0F19] border border-[#1F2A45] text-xs font-semibold rounded-lg px-2.5 py-1 text-[#F3F4F6] focus:outline-none focus:border-indigo-500 cursor-pointer"
                              >
                                <option value="javascript">JavaScript</option>
                                <option value="typescript">TypeScript</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                                <option value="go">Go</option>
                                <option value="rust">Rust</option>
                                <option value="ruby">Ruby</option>
                              </select>
                            </div>
                          </div>
                          <textarea
                            value={ansObj ? ansObj.submittedCode : ''}
                            onChange={(e) => handleCodeChange(challenge._id, e.target.value)}
                            className="w-full h-80 p-4 font-mono text-sm bg-[#0B0F19] border border-[#1F2A45] rounded-xl focus:outline-none focus:border-indigo-500 text-[#F3F4F6]"
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* State 2: Assessment List */}
        {!activeExam && activeTab === 'list' && !examResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {assessments.map((asm) => (
              <div key={asm._id} className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-64">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                      asm.type === 'mcq' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-cyan-500/10 text-cyan-400'
                    }`}>
                      {asm.type} test
                    </span>
                    <span className="text-xs text-[#9CA3AF] flex items-center gap-1.5 font-semibold">
                      <Clock className="h-4 w-4" />
                      <span>{asm.duration} mins</span>
                    </span>
                  </div>
                  <h3 className="text-lg font-bold">{asm.title}</h3>
                  <p className="text-sm text-[#9CA3AF] line-clamp-3 leading-relaxed">
                    {asm.description}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[#1F2A45]">
                  <span className="text-xs text-[#9CA3AF]">
                    {asm.type === 'mcq' 
                      ? `${asm.questions?.length || 0} Questions` 
                      : `${asm.codingChallenges?.length || 0} Coding Challenges`}
                  </span>
                  <button
                    onClick={() => startAssessment(asm._id)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-all btn-glow-primary"
                  >
                    <span>Start Test</span>
                    <Play className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* State 3: Attempt Logs */}
        {!activeExam && activeTab === 'history' && !examResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-panel p-6 rounded-2xl overflow-x-auto"
          >
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[#9CA3AF] uppercase border-b border-[#1F2A45]">
                <tr>
                  <th scope="col" className="pb-3 pr-4">Assessment</th>
                  <th scope="col" className="pb-3 px-4">Score</th>
                  <th scope="col" className="pb-3 px-4">Result</th>
                  <th scope="col" className="pb-3 px-4">Time Taken</th>
                  <th scope="col" className="pb-3 pl-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F2A45]">
                {attempts.map((att) => (
                  <tr key={att._id} className="text-[#F3F4F6]">
                    <td className="py-4 pr-4 font-semibold">{att.assessmentId?.title || 'General Test'}</td>
                    <td className="py-4 px-4 font-bold">{att.score}%</td>
                    <td className="py-4 px-4">
                      {att.passed ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Passed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-bold">
                          <XCircle className="h-4 w-4" />
                          <span>Failed</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">{Math.round(att.timeTaken / 60)} mins</td>
                    <td className="py-4 pl-4 text-xs text-[#9CA3AF]">
                      {new Date(att.createdAt).toLocaleDateString(undefined, { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* State 4: Score Result Panel */}
        {examResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-md mx-auto glass-panel p-8 rounded-2xl text-center space-y-6"
          >
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
              examResult.passed ? 'bg-emerald-500/10 text-emerald-400 shadow-glow' : 'bg-rose-500/10 text-rose-400'
            }`}>
              {examResult.passed ? <CheckCircle2 className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                {examResult.passed ? 'Congratulations!' : 'Keep Practicing!'}
              </h2>
              <p className="text-sm text-[#9CA3AF] mt-1.5">
                You completed the technical evaluation with a score of:
              </p>
              <h3 className={`text-4xl font-extrabold mt-3 ${
                examResult.passed ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {examResult.score}%
              </h3>
            </div>

            <div className="bg-[#0B0F19]/40 border border-[#1F2A45] p-4 rounded-xl text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">Time Taken:</span>
                <span className="font-bold">{Math.round(examResult.timeTaken / 60)} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">Result Code:</span>
                <span className={`font-bold ${examResult.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {examResult.passed ? 'PASSED' : 'FAILED'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setExamResult(null);
                setActiveTab('history');
              }}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-all btn-glow-primary"
            >
              View Detailed Logs
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
