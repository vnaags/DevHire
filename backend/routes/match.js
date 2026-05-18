const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post('/', async (req, res) => {
  try {
    const { resumeText, jobTitle, jobDescription, requirements } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ message: 'Resume text and job description are required' });
    }

    const prompt = `You are an expert recruiter. Analyse how well this resume matches the job and return a JSON object only.

JOB TITLE: ${jobTitle}
JOB DESCRIPTION: ${jobDescription}
REQUIREMENTS: ${(requirements || []).join(', ')}

RESUME:
${resumeText}

Respond ONLY with this JSON (no markdown, no extra text):
{
  "score": <number 0-100>,
  "verdict": "<one of: Strong Match | Good Match | Partial Match | Weak Match>",
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "summary": "<2-3 sentence summary>"
}`;

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    });

    const raw = message.content[0].text.trim();
    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
    res.json(parsed);

  } catch (err) {
    console.error('Match error:', err.message);
    res.status(500).json({ message: 'Error analysing resume', error: err.message });
  }
});

module.exports = router;