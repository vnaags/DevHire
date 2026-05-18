const express = require('express');
const router = express.Router();

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

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    console.log('Gemini raw response:', JSON.stringify(data));

    if (!data.candidates || !data.candidates[0]) {
      return res.status(500).json({ message: 'Gemini API error', error: JSON.stringify(data) });
    }

    const raw = data.candidates[0].content.parts[0].text.trim();
    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
    res.json(parsed);

  } catch (err) {
    console.error('Match error:', err.message);
    res.status(500).json({ message: 'Error analysing resume', error: err.message });
  }
});

module.exports = router;