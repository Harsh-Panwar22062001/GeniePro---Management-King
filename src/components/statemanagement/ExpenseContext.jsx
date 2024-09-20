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
      prevExpenses.map((expense) => {
        if (expense.id === updatedExpense.exp_id) {
          return {
            ...expense,
            name: updatedExpense.exp_emp_id,
            toSchool: updatedExpense.exp_to,
            fromSchool: updatedExpense.exp_from,
            selectedDate: updatedExpense.exp_date,
            time: updatedExpense.exp_time,
            amount: updatedExpense.exp_amt,
            upload: updatedExpense.exp_upload,
          };
        }
        return expense;
      })
    );
  };

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, updateExpense, isMobile }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => useContext(ExpenseContext);