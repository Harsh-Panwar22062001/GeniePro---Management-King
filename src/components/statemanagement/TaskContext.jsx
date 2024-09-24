import React, { createContext, useState, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    // Initialize tasks from local storage or empty array if none exists
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  const isMobile = useSelector((state) => state.ui?.isMobile);

  useEffect(() => {
    // Save tasks to local storage whenever they change
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

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
    <TaskContext.Provider value={{ tasks, addTask, updateTask, isMobile, latestTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);