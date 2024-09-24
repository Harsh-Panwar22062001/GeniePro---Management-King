import React, { createContext, useState, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';

const LeaveContext = createContext();

export const LeaveProvider = ({ children }) => {
  const [leaveRequests, setLeaveRequests] = useState(() => {
    // Initialize leave requests from local storage or empty array if none exists
    const storedLeaveRequests = localStorage.getItem('leaveRequests');
    return storedLeaveRequests ? JSON.parse(storedLeaveRequests) : [];
  });

  const isMobile = useSelector((state) => state.ui?.isMobile);

  useEffect(() => {
    // Save leave requests to local storage whenever they change
    localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

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