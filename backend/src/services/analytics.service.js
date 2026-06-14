const interviewRepository = require('../repositories/InterviewRepository');
const resumeRepository = require('../repositories/ResumeRepository');
const assessmentRepository = require('../repositories/AssessmentRepository');
const codingSubmissionRepository = require('../repositories/CodingSubmissionRepository');
const mongoose = require('mongoose');

const getDashboardMetrics = async (userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // 1. Fetch latest Resume ATS Score
  const latestResume = await resumeRepository.findLatestByUserId(userId);
  const resumeScore = latestResume ? latestResume.atsScore : 0;

  // 2. Fetch Average Mock Interview Score
  const completedInterviews = await interviewRepository.countAll({ userId: userObjectId, status: 'completed' });
  const interviewsList = await interviewRepository.findByUserId(userId);
  let interviewScore = 0;
  if (completedInterviews > 0) {
    const sum = interviewsList
      .filter((i) => i.status === 'completed')
      .reduce((acc, curr) => acc + curr.overallScore, 0);
    interviewScore = Math.round(sum / completedInterviews);
  }

  // 3. Fetch Average Assessment Score
  const attempts = await assessmentRepository.findAttemptsByUserId(userId);
  let assessmentScore = 0;
  if (attempts.length > 0) {
    const sum = attempts.reduce((acc, curr) => acc + curr.score, 0);
    assessmentScore = Math.round(sum / attempts.length);
  }

  // 4. Fetch Submissions stats
  const totalSubmissions = await codingSubmissionRepository.countAll({ userId: userObjectId });
  const passedSubmissions = await codingSubmissionRepository.countAll({ userId: userObjectId, status: 'Passed' });

  // 5. Gather Recent Activity
  const recentActivities = [];
  
  // Take last 3 interviews
  interviewsList.slice(0, 3).forEach((i) => {
    recentActivities.push({
      id: i._id,
      type: 'interview',
      title: `AI Mock Interview for ${i.role}`,
      score: i.overallScore,
      status: i.status,
      date: i.createdAt,
    });
  });

  // Take last 3 assessments
  attempts.slice(0, 3).forEach((a) => {
    recentActivities.push({
      id: a._id,
      type: 'assessment',
      title: a.assessmentId ? a.assessmentId.title : 'Technical Assessment',
      score: a.score,
      status: a.passed ? 'passed' : 'failed',
      date: a.createdAt,
    });
  });

  // Sort activities by date descending
  recentActivities.sort((a, b) => new Date(b.date) - new Date(a.date));

  // 6. Formulate Skill Progress (mock chart data based on actual accomplishments)
  const skills = [
    { name: 'JavaScript', progress: 50 },
    { name: 'Python', progress: 30 },
    { name: 'Node.js', progress: 40 },
    { name: 'React', progress: 60 },
    { name: 'Data Structures', progress: 35 },
  ];

  if (passedSubmissions > 0) {
    skills[4].progress = Math.min(skills[4].progress + passedSubmissions * 10, 100);
  }

  // 7. Formulate weak areas dynamically from resume & interview scores
  const weakAreas = [];
  if (latestResume && latestResume.weaknesses) {
    weakAreas.push(...latestResume.weaknesses.slice(0, 2));
  }
  if (interviewScore > 0 && interviewScore < 70) {
    weakAreas.push('Mock Interview Communication & Context');
  }
  if (weakAreas.length === 0) {
    weakAreas.push('Dynamic Programming', 'System Scalability Design');
  }

  return {
    metrics: {
      interviewScore,
      assessmentScore,
      resumeScore,
      totalInterviews: interviewsList.length,
      totalSubmissions,
      codingAccuracy: totalSubmissions > 0 ? Math.round((passedSubmissions / totalSubmissions) * 100) : 0,
    },
    recentActivities: recentActivities.slice(0, 5),
    skillProgress: skills,
    weakAreas: [...new Set(weakAreas)],
    recommendedTopics: latestResume ? latestResume.recommendedTopics.slice(0, 3) : ['Arrays', 'NodeJS Basics', 'JWT Security'],
  };
};

module.exports = {
  getDashboardMetrics,
};
