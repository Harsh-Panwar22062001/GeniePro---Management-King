import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Search, Calendar } from "lucide-react";
import { useAttendance } from "../../components/statemanagement/AttendanceContext";

const AttendanceMaster = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { attendanceRecords } = useAttendance();

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const filteredAttendanceRecords = attendanceRecords.filter((record) => {
    const nameMatch = record.name.toLowerCase().includes(searchTerm.toLowerCase());
    const dateMatch = filterType === "all" || (startDate && endDate && 
      new Date(record.startDate) >= new Date(startDate) && new Date(record.startDate) <= new Date(endDate));
    const statusMatch = statusFilter === "all" || record.attendanceStatus === statusFilter;
    return nameMatch && dateMatch && statusMatch;
  });

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    if (e.target.value === "all") {
      setStartDate("");
      setEndDate("");
    }
  };

  return (
    <Box p={4} mt={8}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          variant="outlined"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: <Search size={20} style={{ marginRight: 8 }} />,
          }}
        />
        <Box display="flex" alignItems="center">
          <FormControl variant="outlined" style={{ minWidth: 120, marginRight: 16 }}>
            <InputLabel>Filter By</InputLabel>
            <Select value={filterType} onChange={handleFilterChange} label="Filter By">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="date">Date Range</MenuItem>
            </Select>
          </FormControl>
          {filterType === "date" && (
            <>
              <TextField
                type="date"
                label="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                style={{ marginRight: 16 }}
              />
              <TextField
                type="date"
                label="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                style={{ marginRight: 16 }}
              />
            </>
          )}
          <FormControl variant="outlined" style={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="present">Present</MenuItem>
              <MenuItem value="absent">Absent</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAttendanceRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.name}</TableCell>
                <TableCell>{formatDate(record.startDate)}</TableCell>
                <TableCell>{formatDate(record.endDate)}</TableCell>
                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      backgroundColor: record.attendanceStatus === "present" ? "green" : "red",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {record.attendanceStatus}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AttendanceMaster;