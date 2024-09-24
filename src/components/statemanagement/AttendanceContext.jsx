import React, { createContext, useState, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [attendanceRecords, setAttendanceRecords] = useState(() => {
    // Initialize attendance records from local storage or empty array if none exists
    const storedAttendanceRecords = localStorage.getItem('attendanceRecords');
    return storedAttendanceRecords ? JSON.parse(storedAttendanceRecords) : [];
  });

  const isMobile = useSelector((state) => state.ui?.isMobile);

  useEffect(() => {
    // Save attendance records to local storage whenever they change
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

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