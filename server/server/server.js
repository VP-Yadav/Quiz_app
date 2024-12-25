// MERN Quiz App with AI API Integration
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());


// Initialize OpenAI
const openai = new OpenAI({
  apiKey: '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', // Replace with your OpenAI API key
});

// Fetch Questions from AI API
app.post('/api/questions', async (req, res) => {
  const { subject } = req.body;
  console.log('test ' +  subject);
  try {
    const completion = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct', // Replace with your desired model
      prompt: `Generate 10 multiple-choice questions on ${subject}. Include options, correct answers, and explanations.`,
      max_tokens: 500,
      temperature: 0,
    });

    // Parse the response for the questions
    const questions = JSON.parse(completion.choices[0].text.trim());
    console.log("questions" + JSON.stringify( questions))
    res.status(200).json({ questions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions', error: error.message });
  }
});

// Generate Summary and Suggestions
app.post('/api/summary', async (req, res) => {
  const { userAnswers } = req.body;
  try {
    const completion = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: `Analyze these quiz answers: ${JSON.stringify(userAnswers)}. Provide a summary and suggest areas for improvement.`,
      max_tokens: 300,
      temperature: 0,
    });

    const summary = completion.choices[0].text.trim();
    res.status(200).json({ summary });
  } catch (error) {
    res.status(500).json({ message: 'Error generating summary', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
