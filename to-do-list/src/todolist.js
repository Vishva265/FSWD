import React, { useState, useEffect } from 'react';
import './TodoApp.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const TodoApp = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');


  // Load from localStorage
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) setTasks(storedTasks);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim() === '') return;

    if (editIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editIndex].text = task;
      setTasks(updatedTasks);
      setEditIndex(null);
    } else {
      setTasks([...tasks, { text: task, completed: false }]);
    }

    setTask('');
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const editTask = (index) => {
    setTask(tasks[index].text);
    setEditIndex(index);
  };

  const toggleComplete = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const clearTasks = () => {
    setTasks([]);
    setTask('');
    setEditIndex(null);
  };

  const filteredTasks = tasks
  .filter((t) => t.text.toLowerCase().includes(searchQuery.toLowerCase()))
  .filter((t) => {
    if (filter === 'completed') return t.completed;
    if (filter === 'pending') return !t.completed;
    return true; // all
  });


  return (
    <div className="todo-container">
      <h2>Get Things Done!</h2>

      <div className="input-section">
        <input
          type="text"
          placeholder="What is the task today?"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={addTask}>{editIndex !== null ? 'Update' : 'Add Task'}</button>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="filter-buttons">
  <button
    className={filter === 'all' ? 'active' : ''}
    onClick={() => setFilter('all')}
  >
    All
  </button>
  <button
    className={filter === 'pending' ? 'active' : ''}
    onClick={() => setFilter('pending')}
  >
    Pending
  </button>
  <button
    className={filter === 'completed' ? 'active' : ''}
    onClick={() => setFilter('completed')}
  >
    Completed
  </button>
</div>



      <div className="task-list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((t, index) => (
            <div className="task-item" key={index}>
              <div
  onClick={() => toggleComplete(index)}
  className={`task-text ${t.completed ? 'completed' : ''}`}
>
  <strong>{t.text}</strong>
  <div className={`status ${t.completed ? 'done' : 'pending'}`}>
    {t.completed ? 'Completed' : ' Pending'}
  </div>
</div>

              <div className="icons">
                <FaEdit onClick={() => editTask(index)} />
                <FaTrash onClick={() => deleteTask(index)} />
              </div>
            </div>
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </div>

      {tasks.length > 0 && (
        <button className="clear-btn" onClick={clearTasks}>
          Clear All Tasks
        </button>
      )}
    </div>
  );
};

export default TodoApp;
