import React, { useEffect, useState } from 'react';
import api from '../api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  HelpCircle, 
  Terminal, 
  BookOpen, 
  Loader2, 
  Play, 
  Award, 
  CheckCircle,
  Lightbulb
} from 'lucide-react';

export const CodingPractice = () => {
  const [challenges, setChallenges] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Arrays');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  
  // Compiler & editor states
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [runLogs, setRunLogs] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState(null);

  // Hint states
  const [fetchingHint, setFetchingHint] = useState(false);
  const [hintData, setHintData] = useState(null);

  const categories = [
    'Arrays', 'Strings', 'Linked List', 'Stack', 'Queue', 'Trees', 'Graphs', 'Dynamic Programming'
  ];

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const response = await api.get('/coding/challenges');
      setChallenges(response.data.data);
      
      const subRes = await api.get('/coding/history');
      setSubmissions(subRes.data.data);

      // Default select first challenge in selected category
      const inCat = response.data.data.filter(c => c.category === activeCategory);
      if (inCat.length > 0) {
        selectChallenge(inCat[0]);
      }
    } catch (err) {
      toast.error('Failed to load coding challenges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  useEffect(() => {
    // When category changes, select the first challenge in that category
    const inCat = challenges.filter(c => c.category === activeCategory);
    if (inCat.length > 0) {
      selectChallenge(inCat[0]);
    } else {
      setSelectedChallenge(null);
      setCode('');
      setHintData(null);
    }
  }, [activeCategory, challenges]);

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
    
    return `// Write your code here`;
  };

  const selectChallenge = (challenge, lang = language) => {
    setSelectedChallenge(challenge);
    setHintData(null);
    setRunLogs('');
    setSubmissionStatus(null);
    setCode(getStarterCode(challenge, lang));
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    if (selectedChallenge) {
      setCode(getStarterCode(selectedChallenge, newLang));
    }
  };

  const executeCode = async (isSubmit) => {
    if (!code.trim()) {
      toast.error('Code sandbox is empty');
      return;
    }

    if (isSubmit) {
      setSubmitting(true);
    } else {
      setRunning(true);
    }

    setRunLogs(isSubmit ? 'Submitting solution and executing final assertions...' : 'Running compilation and executing visible assertions...');
    setSubmissionStatus(null);
    try {
      const response = await api.post(`/coding/submit/${selectedChallenge._id}`, {
        code,
        language,
        isSubmit,
      });

      const { status, testCasesPassed, totalTestCases, logs } = response.data.data;
      setSubmissionStatus({ status, testCasesPassed, totalTestCases });
      setRunLogs(logs);
      
      if (status === 'Passed') {
        if (isSubmit) {
          toast.success('Congratulations! Your solution passed all test cases.');
        } else {
          toast.success('Sample test cases passed successfully!');
        }
      } else {
        toast.error(`${status}: Passed ${testCasesPassed}/${totalTestCases} test cases.`);
      }

      // Re-fetch submissions to update checkmarks
      const subRes = await api.get('/coding/history');
      setSubmissions(subRes.data.data);
    } catch (err) {
      setRunLogs(`Compilation halted: ${err.response?.data?.message || err.message}`);
      toast.error(isSubmit ? 'Submission failed' : 'Execution failed');
    } finally {
      setRunning(false);
      setSubmitting(false);
    }
  };

  const handleRunCode = (e) => {
    e.preventDefault();
    executeCode(false);
  };

  const handleSubmitCode = (e) => {
    e.preventDefault();
    executeCode(true);
  };

  const getAiHint = async () => {
    setFetchingHint(true);
    setHintData(null);
    try {
      const response = await api.post(`/coding/hint/${selectedChallenge._id}`, {
        code,
        language,
      });
      setHintData(response.data.data);
      toast.success('Gemini generated a conceptual hint!');
    } catch (err) {
      toast.error('Failed to fetch hints from Gemini');
    } finally {
      setFetchingHint(false);
    }
  };

  const getChallengeStatus = (id) => {
    const subs = submissions.filter(s => s.challengeId?._id === id);
    if (subs.some(s => s.status === 'Passed')) return 'passed';
    if (subs.length > 0) return 'failed';
    return 'unattempted';
  };

  if (loading && challenges.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-indigo-500" />
      </div>
    );
  }

  const categoryChallenges = challenges.filter(c => c.category === activeCategory);

  return (
    <div className="space-y-8">
      {/* Category selector */}
      <div className="flex border-b border-[#1F2A45] gap-1 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
              activeCategory === cat
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-[#9CA3AF] hover:text-[#F3F4F6]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Side: Category Challenges */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-panel p-4 rounded-2xl">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-1.5">
              <BookOpen className="h-4.5 w-4.5 text-indigo-400" />
              <span>{activeCategory} Problems</span>
            </h3>

            <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
              {categoryChallenges.length > 0 ? (
                categoryChallenges.map((challenge) => {
                  const status = getChallengeStatus(challenge._id);
                  return (
                    <div
                      key={challenge._id}
                      onClick={() => selectChallenge(challenge)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedChallenge?._id === challenge._id
                          ? 'bg-indigo-600/15 border-indigo-500 text-[#F3F4F6]'
                          : 'bg-[#0B0F19]/40 border-[#1F2A45] hover:border-[#1F2A45]/80'
                      }`}
                    >
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-xs font-semibold truncate w-32">{challenge.title}</span>
                        <div className="flex items-center gap-1.5">
                          {status === 'passed' && (
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                          )}
                          <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase ${
                            challenge.difficulty === 'easy'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : challenge.difficulty === 'medium'
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {challenge.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-xs text-[#9CA3AF]">
                  No problems in this category.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Workstation: Editor + Description */}
        <div className="lg:col-span-3 grid grid-cols-1 xl:grid-cols-3 gap-6">
          {selectedChallenge ? (
            <>
              {/* Problem statement and Editor */}
              <div className="xl:col-span-2 space-y-6">
                <div className="glass-panel p-6 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">{selectedChallenge.title}</h2>
                    <span className="text-xs text-[#9CA3AF] uppercase tracking-wider font-semibold">
                      {selectedChallenge.category}
                    </span>
                  </div>
                  <p className="text-sm text-[#9CA3AF] leading-relaxed whitespace-pre-line bg-[#0B0F19]/30 p-4 rounded-xl border border-[#1F2A45]/50">
                    {selectedChallenge.description}
                  </p>
                </div>

                {/* Code Editor */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center border-b border-[#1F2A45] pb-3">
                    <span className="text-sm font-bold flex items-center gap-1.5">
                      <Code2 className="h-5 w-5 text-indigo-400" />
                      <span>Workspace ({language === 'cpp' ? 'C++' : language.charAt(0).toUpperCase() + language.slice(1)})</span>
                    </span>
                    <button
                      onClick={getAiHint}
                      disabled={fetchingHint}
                      className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold rounded-lg flex items-center gap-1 hover:bg-indigo-500 hover:text-white transition-colors disabled:opacity-50"
                    >
                      {fetchingHint ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <Lightbulb className="h-3.5 w-3.5" />}
                      <span>Get AI Hint</span>
                    </button>
                  </div>

                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-80 p-4 font-mono text-sm bg-[#0B0F19] border border-[#1F2A45] rounded-xl focus:outline-none focus:border-indigo-500 text-[#F3F4F6]"
                  />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-[#9CA3AF]">Language:</span>
                      <select
                        value={language}
                        onChange={handleLanguageChange}
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
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleRunCode}
                        disabled={running || submitting}
                        className="px-5 py-2 bg-[#1F2A45]/40 hover:bg-[#1F2A45]/80 border border-[#1F2A45] text-[#F3F4F6] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all disabled:opacity-50"
                      >
                        {running ? <Loader2 className="animate-spin h-4 w-4" /> : <Play className="h-4 w-4" />}
                        <span>Run Code</span>
                      </button>
                      <button
                        onClick={handleSubmitCode}
                        disabled={running || submitting}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all btn-glow-primary disabled:opacity-50"
                      >
                        {submitting ? <Loader2 className="animate-spin h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        <span>Submit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logs and AI Hint Sidebar */}
              <div className="space-y-6">
                {/* Console Logs */}
                <div className="glass-panel p-6 rounded-2xl flex flex-col h-64">
                  <h4 className="text-sm font-bold mb-3 flex items-center gap-1.5">
                    <Terminal className="h-4.5 w-4.5 text-[#9CA3AF]" />
                    <span>Compiler Logs</span>
                  </h4>
                  <div className="flex-1 bg-[#0B0F19] border border-[#1F2A45] rounded-xl p-3 font-mono text-xs overflow-y-auto text-glow text-cyan-400 leading-relaxed whitespace-pre-wrap">
                    {runLogs || "Logs will appear here once you run code..."}
                  </div>
                </div>

                {/* AI Hint Box */}
                {hintData && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-6 rounded-2xl border-indigo-500/30 bg-indigo-600/5 space-y-4"
                  >
                    <h4 className="text-sm font-bold text-indigo-400 flex items-center gap-1.5">
                      <Lightbulb className="h-4.5 w-4.5 animate-pulse" />
                      <span>Gemini Coaching Clue</span>
                    </h4>
                    <p className="text-xs text-[#F3F4F6] font-semibold leading-relaxed">
                      {hintData.hint}
                    </p>
                    <p className="text-xs text-[#9CA3AF] leading-relaxed border-t border-[#1F2A45] pt-3">
                      {hintData.explanation}
                    </p>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            <div className="xl:col-span-3 glass-panel p-12 rounded-2xl text-center space-y-4">
              <Code2 className="h-16 w-16 text-[#1F2A45] mx-auto animate-pulse" />
              <div>
                <h3 className="text-lg font-bold">No Problem Selected</h3>
                <p className="text-sm text-[#9CA3AF] max-w-sm mx-auto mt-1">
                  Select a category challenge from the sidebar list to open the code compiler workstation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
