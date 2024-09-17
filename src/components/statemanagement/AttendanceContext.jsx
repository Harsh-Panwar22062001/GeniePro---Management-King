// AttendanceContext.js
import React, { createContext, useState, useContext } from 'react';
import { useSelector } from 'react-redux';

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const isMobile = useSelector((state) => state.ui?.isMobile);

  const addAttendanceRecord = (newRecord) => {
    setAttendanceRecords((prevRecords) => [...prevRecords, { ...newRecord, id: Date.now() }]);
  };

  return (
    <AttendanceContext.Provider value={{ attendanceRecords, addAttendanceRecord, isMobile }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => useContext(AttendanceContext);
