
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup on component unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container">
      <h1 className="title">Welcome to CHARUSAT!!!!</h1>
      <h2 className="date">It is {currentTime.toLocaleDateString()}</h2>
      <h2 className="time">It is {currentTime.toLocaleTimeString()}</h2>
    </div>
  );
}   

export default App;
