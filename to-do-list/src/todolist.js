import React, { useState } from 'react';
import './TodoApp.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const TodoApp = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const addTask = () => {
    if (task.trim() === '') return;

    if (editIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editIndex] = task;
      setTasks(updatedTasks);
      setEditIndex(null);
    } else {
      setTasks([...tasks, task]);
    }

    setTask('');
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const editTask = (index) => {
    setTask(tasks[index]);
    setEditIndex(index);
  };

  return (
    <div className="todo-container">
      <h2>Get Things Done !</h2>
      <div className="input-section">
        <input
          type="text"
          placeholder="What is the task today?"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={addTask}>{editIndex !== null ? 'Update' : 'Add Task'}</button>
      </div>

      <div className="task-list">
        {tasks.map((t, index) => (
          <div className="task-item" key={index}>
            <span>{t}</span>
            <div className="icons">
              <FaEdit onClick={() => editTask(index)} />
              <FaTrash onClick={() => deleteTask(index)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoApp;
