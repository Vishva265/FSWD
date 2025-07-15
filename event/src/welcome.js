import React, { useState } from 'react';
import './App.css'; // optional if you want custom styling

function App() {
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');



  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
     
      

      <h2>Welcome to CHARUSAT!!!</h2>

      <div style={{ margin: '20px' }}>
        <label>First Name: </label>
        <input 
          type="text" 
          value={firstName} 
          onChange={(e) => setFirstName(e.target.value)} 
        />
        <br /><br />
        <label>Last Name: </label>
        <input 
          type="text" 
          value={lastName} 
          onChange={(e) => setLastName(e.target.value)} 
        />
      </div>

      <h3>Welcome to {firstName} {lastName}</h3>
    
    </div>
  );
}

export default App;
