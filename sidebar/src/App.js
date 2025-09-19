import React, { useState } from 'react';
import './Sidebar.css'; // You can customize this or use inline styles

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="container">
      <button className="menu-btn" onClick={toggleSidebar}>
        &#9776;
      </button>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </div>

      <div className="content">
        <h1>Welcome to My Website</h1>
        <p>This is the main content of the webpage.</p>
      </div>
    </div>
  );
}

export default App;
