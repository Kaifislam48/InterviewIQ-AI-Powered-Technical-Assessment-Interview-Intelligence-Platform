const learningPlanRepository = require('../repositories/LearningPlanRepository');
const codingChallengeRepository = require('../repositories/CodingChallengeRepository');
const resumeRepository = require('../repositories/ResumeRepository');
const interviewRepository = require('../repositories/InterviewRepository');
const geminiService = require('./gemini.service');

const getOrCreatePlan = async (userId, forceRecreate = false) => {
  // 1. Check existing plan
  const existingPlan = await learningPlanRepository.findByUserId(userId);
  if (existingPlan && !forceRecreate) {
    return existingPlan;
  }

  // 2. Gather candidate profile summary for the Gemini prompt
  const latestResume = await resumeRepository.findLatestByUserId(userId);
  const latestInterview = await interviewRepository.findLatestByUserId(userId);

  let summary = `Candidate has registered.`;
  if (latestResume) {
    summary += ` ATS Resume Score: ${latestResume.atsScore}/100. Strengths: ${latestResume.strengths.join(', ')}. Weaknesses: ${latestResume.weaknesses.join(', ')}. Missing skills: ${latestResume.missingSkills.join(', ')}.`;
  }
  if (latestInterview && latestInterview.status === 'completed') {
    summary += ` Latest Mock Interview Score for ${latestInterview.role}: ${latestInterview.overallScore}/100. Feedback: ${latestInterview.overallFeedback}.`;
  }

  // 3. Request roadmap from Gemini
  const aiPlan = await geminiService.generateLearningPlan(summary);

  // 4. Resolve practice challenges by category in Mongoose
  // Find challenges to link dynamically to study roadmap
  const allChallenges = await codingChallengeRepository.findAll({});
  
  const weeklyRoadmapFormatted = [];
  
  for (let week of aiPlan.weeklyRoadmap) {
    // Attempt to match challenges based on theme keywords or default to first 2 challenges
    const matchedChallengeIds = [];
    allChallenges.forEach((challenge) => {
      // Simple match: if the challenge category matches any keyword in week theme or topics
      const categoryLower = challenge.category.toLowerCase();
      const themeLower = week.theme.toLowerCase();
      const match = themeLower.includes(categoryLower) || week.topics.some(t => t.toLowerCase().includes(categoryLower));
      
      if (match && matchedChallengeIds.length < 2) {
        matchedChallengeIds.push(challenge._id);
      }
    });

    // Fallback: if no matches or not enough matches, fill up to 2 challenges from the available pool
    if (matchedChallengeIds.length < 2 && allChallenges.length > 0) {
      let idxOffset = 0;
      while (matchedChallengeIds.length < 2 && idxOffset < allChallenges.length) {
        const fallbackIndex = (week.weekNumber - 1 + idxOffset) % allChallenges.length;
        const fallbackId = allChallenges[fallbackIndex]._id;
        if (!matchedChallengeIds.includes(fallbackId)) {
          matchedChallengeIds.push(fallbackId);
        }
        idxOffset++;
      }
    }

    weeklyRoadmapFormatted.push({
      weekNumber: week.weekNumber,
      theme: week.theme,
      topics: week.topics,
      recommendedResources: week.recommendedResources,
      practiceChallenges: matchedChallengeIds,
      status: 'pending',
    });
  }

  // 5. Update/Create plan in Mongoose
  const plan = await learningPlanRepository.updateByUserId(userId, {
    weeklyRoadmap: weeklyRoadmapFormatted,
    weakAreas: aiPlan.weakAreas || [],
  });

  return plan;
};

const updateMilestoneStatus = async (userId, weekNumber, status) => {
  const plan = await learningPlanRepository.findByUserId(userId);
  if (!plan) {
    throw new Error('Learning plan not found');
  }

  const week = plan.weeklyRoadmap.find((w) => w.weekNumber === Number(weekNumber));
  if (week) {
    week.status = status;
    await plan.save();
  }

  return plan;
};

module.exports = {
  getOrCreatePlan,
  updateMilestoneStatus,
};
