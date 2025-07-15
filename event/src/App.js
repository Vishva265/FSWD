import React, { useState, useEffect } from 'react';
import './App.css';


function useCount(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(Math.max(0, count - 1));
  const reset = () => setCount(0);
  const incrementByFive = () => setCount(count + 5);
  
  return { count, increment, decrement, reset, incrementByFive };
}

function App() {
  
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  
  const userCounter = useCount(0);
  
  
  const [excellent, setExcellentCount] = useState(0);
  const [good, setGoodCount] = useState(0);
  const [average, setAverageCount] = useState(0);
  const [poor, setPoorCount] = useState(0);

  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  
 

 
  const handleFeedback = (type) => {
    if (type === 'excellent') setExcellentCount(prev => prev + 1);
    if (type === 'good') setGoodCount(prev => prev + 1);
    if (type === 'average') setAverageCount(prev => prev + 1);
    if (type === 'poor') setPoorCount(prev => prev + 1);
    userCounter.increment();
  };

  return (
    <div className="App">
      <div className="dashboard">
        <h1>Live Event Feedback Dashboard</h1>
        
       
        <div className="greeting-section">
          <h2>Welcome Setup</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter your surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>
          {firstName && surname && (
            <div className="greeting-message">
               Welcome, {firstName} {surname} !
            </div>
          )}
        </div>

        
        <div className="clock-section">
          <h2>Live Clock</h2>
          <div className="clock-display">
            {currentTime.toLocaleString()}
          </div>
        </div>

        
        <div className="feedback-section">
          <h2>Session Feedback</h2>
          <div className="feedback-buttons">
            <button onClick={() => handleFeedback('excellent')} className="excellent">
              Excellent
            </button>
            <button onClick={() => handleFeedback('good')} className="good">
              Good
            </button>
            <button onClick={() => handleFeedback('average')} className="average">
              Average
            </button>
            <button onClick={() => handleFeedback('poor')} className="poor">
              Poor
            </button>
          </div>
          
          <div className="feedback-results">
            <h3>Current Results:</h3>
            <div className="results-grid">
              <div className="result-item">
                <span>Excellent:</span>
                <span>{excellent}</span>
              </div>
              <div className="result-item">
                <span>Good:</span>
                <span>{good}</span>
              </div>
              <div className="result-item">
                <span>Average:</span>
                <span>{average}</span>
              </div>
              <div className="result-item">
                <span>Poor:</span>
                <span>{poor}</span>
              </div>
            </div>
          </div>
        </div>

        
        <div className="counter-section">
          <h2>Your Submission Counter</h2>
          <div className="counter-display">
            <span>Your submissions: </span>
            <span>{userCounter.count}</span>
          </div>
          <div className="counter-controls">
            <button onClick={userCounter.increment}>
              Increment
            </button>
            <button onClick={userCounter.decrement}>
              Decrement
            </button>
            <button onClick={userCounter.reset} className="reset">
              Reset
            </button>
            <button onClick={userCounter.incrementByFive}>
              +5
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 