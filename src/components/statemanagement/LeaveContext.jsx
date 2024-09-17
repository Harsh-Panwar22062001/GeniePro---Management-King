// LeaveContext.js
import React, { createContext, useState, useContext } from 'react';
import { useSelector } from 'react-redux';

const LeaveContext = createContext();

export const LeaveProvider = ({ children }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  const isMobile = useSelector((state) => state.ui?.isMobile);

  const addLeaveRequest = (newRequest) => {
    setLeaveRequests((prevRequests) => [...prevRequests, { ...newRequest, id: Date.now() }]);
  };

  const updateLeaveRequest = (updatedRequest) => {
    setLeaveRequests((prevRequests) =>
      prevRequests.map((request) => (request.id === updatedRequest.id ? updatedRequest : request))
    );
  };

  return (
    <LeaveContext.Provider value={{ leaveRequests, addLeaveRequest, updateLeaveRequest, isMobile }}>
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeaves = () => useContext(LeaveContext);