import React, { createContext, useState, useContext } from 'react';
import { useSelector } from 'react-redux';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  // Ensure that state.ui.isMobile exists
  const isMobile = useSelector((state) => state.ui?.isMobile);

  const addTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, { ...newTask, id: Date.now() }]);
  };

  const updateTask = (updatedTask) => {
    console.log("Updating task:", updatedTask);
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };


  const latestTask = tasks[tasks.length - 1] || null;

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, isMobile , latestTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
