const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * POST /api/match
 * Body: { resumeText, jobDescription, jobTitle, company }
 * Returns: { matchScore, strengths, gaps, verdict, tips }
 */
router.post('/', async (req, res) => {
  const { resumeText, jobDescription, jobTitle, company } = req.body;

  if (!resumeText || !jobDescription) {
    return res.status(400).json({ message: 'resumeText and jobDescription are required.' });
  }

  const prompt = `You are an expert technical recruiter and resume analyst. Evaluate how well the candidate's resume matches the job posting below.

JOB TITLE: ${jobTitle || 'Software Engineer'}
COMPANY: ${company || 'Unknown'}

JOB DESCRIPTION / REQUIREMENTS:
${jobDescription}

CANDIDATE RESUME:
${resumeText}

Analyse the match and respond ONLY with a valid JSON object (no markdown, no extra text) in this exact shape:
{
  "matchScore": <integer 0-100>,
  "verdict": "<one of: Strong Match | Good Match | Partial Match | Weak Match>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "gaps": ["<gap 1>", "<gap 2>", "<gap 3>"],
  "tips": ["<actionable tip 1>", "<actionable tip 2>"]
}

Scoring guide:
85-100 → Strong Match (meets almost all requirements)
65-84  → Good Match (meets most key requirements)
40-64  → Partial Match (meets some requirements, notable gaps)
0-39   → Weak Match (significant gaps vs requirements)

Be honest and specific. Strengths and gaps must reference actual skills/experience mentioned (or missing) in the resume relative to the job requirements.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    });

    const raw = message.content[0]?.text || '';
    // Strip any accidental markdown fences
    const clean = raw.replace(/```json|```/gi, '').trim();
    const result = JSON.parse(clean);
    res.json(result);
  } catch (err) {
    console.error('Resume match error:', err.message);
    res.status(500).json({ message: 'AI analysis failed.', error: err.message });
  }
});

module.exports = router;
