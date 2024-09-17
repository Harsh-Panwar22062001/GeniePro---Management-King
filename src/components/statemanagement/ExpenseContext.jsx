// LeaveContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { useSelector } from 'react-redux';

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const isMobile = useSelector((state) => state.ui?.isMobile);

  const addExpense = (newExpense) => {
    setExpenses((prevExpenses) => [...prevExpenses, { ...newExpense, id: Date.now() }]);
  };

  const updateExpense = (updatedExpense) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) => (expense.id === updatedExpense.id ? updatedExpense : expense))
    );
  };

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, updateExpense, isMobile }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => useContext(ExpenseContext);