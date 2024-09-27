import React, { useState, useEffect } from 'react';
import { 
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Typography, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAttendance } from '../../components/statemanagement/AttendanceContext';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
});

const PrintableAttendanceReport = () => {
  const { attendanceRecords } = useAttendance();
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [stats, setStats] = useState({ present: 0, absent: 0 });

  useEffect(() => {
    const filtered = attendanceRecords.filter(record => {
      const nameMatch = record.name.toLowerCase().includes(nameFilter.toLowerCase());
      const dateMatch = startDate && endDate && filterType === 'date' ?
        startDate <= new Date(record.startDate) && new Date(record.startDate) <= endDate : true;
      return nameMatch && dateMatch;
    });

    setFilteredRecords(filtered);

    const presentCount = filtered.filter(record => record.attendanceStatus === 'Present').length;
    const absentCount = filtered.filter(record => record.attendanceStatus === 'Absent').length;
    setStats({ present: presentCount, absent: absentCount });
  }, [attendanceRecords, nameFilter, startDate, endDate, filterType]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Attendance Report</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .stats { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>Attendance Report</h1>
          <div class="stats">
            <h2>Statistics</h2>
            <p>Present: ${stats.present}</p>
            <p>Absent: ${stats.absent}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredRecords.map(record => `
                <tr>
                  <td>${record.name}</td>
                  <td>${dateFormatter.format(new Date(record.startDate))}</td>
                  <td>${dateFormatter.format(new Date(record.endDate))}</td>
                  <td>${record.attendanceStatus}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={3} className="print-container" sx={{ p: 4, m: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Attendance Report
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }} className="no-print">
          <TextField
            label="Filter by Name"
            variant="outlined"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="filter-type-label">Filter Type</InputLabel>
            <Select
              labelId="filter-type-label"
              value={filterType}
              label="Filter Type"
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="date">Date Range</MenuItem>
            </Select>
          </FormControl>
          {filterType === 'date' && (
            <>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                renderInput={(params) => <TextField {...params} />}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                renderInput={(params) => <TextField {...params} />}
              />
            </>
          )}
          <Button variant="contained" color="primary" onClick={handlePrint}>
            Print Report
          </Button>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>Statistics</Typography>
          <Typography>Present: {stats.present}</Typography>
          <Typography>Absent: {stats.absent}</Typography>
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="attendance table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.name}</TableCell>
                  <TableCell>{dateFormatter.format(new Date(record.startDate))}</TableCell>
                  <TableCell>{dateFormatter.format(new Date(record.endDate))}</TableCell>
                  <TableCell>{record.attendanceStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </LocalizationProvider>
  );
};

export default PrintableAttendanceReport;