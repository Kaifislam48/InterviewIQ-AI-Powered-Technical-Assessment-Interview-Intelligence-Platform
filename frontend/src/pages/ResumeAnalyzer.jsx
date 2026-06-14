import React, { useEffect, useState } from 'react';
import api from '../api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  History, 
  Tags,
  Loader2,
  Trash2
} from 'lucide-react';

export const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('strengths');
  const [dragOver, setDragOver] = useState(false);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/resume/history');
      setHistory(response.data.data);
      if (response.data.data.length > 0 && !currentAnalysis) {
        setCurrentAnalysis(response.data.data[0]);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setAnalyzing(true);
    try {
      const response = await api.post('/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Resume parsed and analyzed successfully!');
      setCurrentAnalysis(response.data.data);
      setFile(null);
      fetchHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Resume Analyzer</h1>
        <p className="text-[#9CA3AF] text-sm mt-1">
          Upload your resume in PDF/DOCX to receive an automated ATS score and improvement tips from Gemini.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload widget */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-4">Upload Resume</h3>
            
            <form onSubmit={handleUpload} className="space-y-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  dragOver 
                    ? 'border-indigo-500 bg-indigo-500/10' 
                    : 'border-[#1F2A45] hover:border-indigo-500/40 bg-[#0B0F19]/40'
                }`}
              >
                <input
                  id="resume-file"
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label htmlFor="resume-file" className="cursor-pointer space-y-4 block">
                  <div className="mx-auto w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">
                      {file ? file.name : "Click to select or drag file here"}
                    </p>
                    <p className="text-xs text-[#9CA3AF] mt-1">
                      PDF, DOCX, TXT up to 5MB
                    </p>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={!file || analyzing}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl flex items-center justify-center space-x-2 transition-all btn-glow-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Analyzing ATS Keywords...</span>
                  </>
                ) : (
                  <span>Analyze Resume</span>
                )}
              </button>
            </form>
          </div>

          {/* Historical reviews list */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <History className="h-5 w-5 text-indigo-400" />
              <span>Parsing History</span>
            </h3>
            
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {history && history.length > 0 ? (
                history.map((h) => (
                  <div
                    key={h._id}
                    onClick={() => setCurrentAnalysis(h)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      currentAnalysis?._id === h._id
                        ? 'bg-indigo-600/15 border-indigo-500'
                        : 'bg-[#0B0F19]/40 border-[#1F2A45] hover:border-[#1F2A45]/80'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="truncate w-36">
                        <p className="text-sm font-semibold truncate">{h.fileName}</p>
                        <p className="text-xs text-[#9CA3AF] mt-1">
                          {new Date(h.createdAt).toLocaleDateString(undefined, { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        h.atsScore >= 80 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {h.atsScore}% ATS
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-sm text-[#9CA3AF]">
                  No past resumes uploaded yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Analysis detail panel */}
        <div className="lg:col-span-2 space-y-6">
          {currentAnalysis ? (
            <div className="glass-panel p-6 rounded-2xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-[#1F2A45]">
                <div>
                  <h3 className="text-xl font-bold">{currentAnalysis.fileName}</h3>
                  <p className="text-sm text-[#9CA3AF] mt-0.5">
                    Analyzed on {new Date(currentAnalysis.createdAt).toLocaleDateString(undefined, { 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#9CA3AF]">ATS Score:</span>
                  <div className={`px-4 py-2 rounded-xl text-lg font-bold ${
                    currentAnalysis.atsScore >= 80 
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}>
                    {currentAnalysis.atsScore}/100
                  </div>
                </div>
              </div>

              {/* Sub-tabs toggles */}
              <div className="flex border-b border-[#1F2A45] gap-1 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('strengths')}
                  className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
                    activeTab === 'strengths'
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent text-[#9CA3AF] hover:text-[#F3F4F6]'
                  }`}
                >
                  Key Strengths
                </button>
                <button
                  onClick={() => setActiveTab('weaknesses')}
                  className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
                    activeTab === 'weaknesses'
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent text-[#9CA3AF] hover:text-[#F3F4F6]'
                  }`}
                >
                  Weaknesses
                </button>
                <button
                  onClick={() => setActiveTab('improvements')}
                  className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
                    activeTab === 'improvements'
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent text-[#9CA3AF] hover:text-[#F3F4F6]'
                  }`}
                >
                  Suggested Improvements
                </button>
                <button
                  onClick={() => setActiveTab('skills')}
                  className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
                    activeTab === 'skills'
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent text-[#9CA3AF] hover:text-[#F3F4F6]'
                  }`}
                >
                  Missing Keywords
                </button>
              </div>

              {/* Tab Content */}
              <div className="py-4">
                {activeTab === 'strengths' && (
                  <ul className="space-y-4">
                    {currentAnalysis.strengths.map((str, i) => (
                      <li key={i} className="flex items-start space-x-3 text-sm">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-[#F3F4F6]">{str}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === 'weaknesses' && (
                  <ul className="space-y-4">
                    {currentAnalysis.weaknesses.map((weak, i) => (
                      <li key={i} className="flex items-start space-x-3 text-sm">
                        <AlertTriangle className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
                        <span className="text-[#F3F4F6]">{weak}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === 'improvements' && (
                  <ul className="space-y-4">
                    {currentAnalysis.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start space-x-3 text-sm">
                        <Lightbulb className="h-5 w-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span className="text-[#F3F4F6]">{imp}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === 'skills' && (
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs text-[#9CA3AF] uppercase tracking-wider font-semibold mb-3">Missing ATS Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {currentAnalysis.missingSkills.map((sk, i) => (
                          <span key={i} className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
                            <Tags className="h-3.5 w-3.5" />
                            <span>{sk}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-[#9CA3AF] uppercase tracking-wider font-semibold mb-3">Recommended Interview Prep Topics</p>
                      <div className="flex flex-wrap gap-2">
                        {currentAnalysis.recommendedTopics.map((top, i) => (
                          <span key={i} className="px-3 py-1.5 bg-[#0B0F19] border border-[#1F2A45] rounded-lg text-xs font-semibold text-[#F3F4F6]">
                            {top}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl text-center space-y-4">
              <FileText className="h-16 w-16 text-[#1F2A45] mx-auto animate-pulse" />
              <div>
                <h3 className="text-lg font-bold">No Analysis Selected</h3>
                <p className="text-sm text-[#9CA3AF] max-w-sm mx-auto mt-1">
                  Upload a resume to run the parsing model or select a past resume from history.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
