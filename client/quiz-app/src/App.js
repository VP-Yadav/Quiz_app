import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [summary, setSummary] = useState(null);

  const fetchQuestions = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/questions', { subject: selectedCategory });
      setQuestions(response.data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleAnswer = (option) => {
    const isCorrect = option === questions[currentIndex].correctAnswer;
    setUserAnswers([...userAnswers, { question: questions[currentIndex].question, selected: option, correct: isCorrect }]);
    if (isCorrect) setScore(score + 1);
    setCurrentIndex(currentIndex + 1);
  };

  const fetchSummary = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/summary', { userAnswers });
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  useEffect(() => {
    if (currentIndex === questions.length && questions.length > 0) {
      fetchSummary();
    }
  }, [currentIndex]);

  return (
    <div className="quiz-app">
      <h1>Quiz App</h1>
      {!summary ? (
        <>
          <select onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">Select Category</option>
            <option value="Computer Networks">Computer Networks</option>
            <option value="Web Technology">Web Technology</option>
            <option value="Artificial Intelligence">Artificial Intelligence</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Software Project Management">Software Project Management</option>
          </select>
          <button onClick={fetchQuestions}>Start Quiz</button>
          {questions.length > 0 && currentIndex < questions.length ? (
            <div>
              <h2>{questions[currentIndex].question}</h2>
              {questions[currentIndex].options.map((option, index) => (
                <button key={index} onClick={() => handleAnswer(option)}>{option}</button>
              ))}
            </div>
          ) : currentIndex >= questions.length ? (
            <div>
              <h2>Your score: {score}</h2>
              <p>Generating summary...</p>
            </div>
          ) : (
            <p>Select a category to start the quiz!</p>
          )}
        </>
      ) : (
        <div>
          <h2>Summary</h2>
          <p>{summary.text}</p>
          <h3>Suggestions for Improvement</h3>
          <p>{summary.suggestions}</p>
        </div>
      )}
    </div>
  );
};

export default App;
