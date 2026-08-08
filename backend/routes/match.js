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

    console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);
    console.log('Making request to Groq...');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1024,
        response_format: { type: 'json_object' }
      })
    });

    console.log('Groq status:', response.status);

    const data = await response.json();
    console.log('Groq raw response:', JSON.stringify(data));

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ message: 'Groq API error', error: JSON.stringify(data) });
    }

    const raw = data.choices[0].message.content.trim();
    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
    res.json(parsed);

  } catch (err) {
    console.error('Match error:', err.message);
    res.status(500).json({ message: 'Error analysing resume', error: err.message });
  }
});

module.exports = router;