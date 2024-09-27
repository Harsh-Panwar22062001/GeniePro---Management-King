import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Box,
  TextField,
  useTheme,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch } from "react-icons/fa";
import { useAttendance } from '../../components/statemanagement/AttendanceContext';
import { styled } from "@mui/material/styles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import PrintableAttendanceReport from '../Print/PrintAttendance'; 

const getCardStyle = (theme) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[10],
  },
});

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(1.5),
  fontSize: "1rem",
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  "&:focus": {
    outline: "none",
    borderColor: theme.palette.primary.main,
  },
}));

const AttendanceMaster = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const { attendanceRecords } = useAttendance();
  const theme = useTheme();
  const [showPrintableReport, setShowPrintableReport] = useState(false);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredAttendanceRecords = attendanceRecords.filter((record) => {
    if (filterType === "all") {
      return record.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (filterType === "date") {
      const recordDate = new Date(record.startDate);
      return (
        recordDate >= startDate &&
        recordDate <= endDate &&
        record.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  });

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    if (e.target.value === "all") {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handlePrintReport = () => {
    setShowPrintableReport(true);
  };

  return (
    <Box p={4} sx={{ marginTop: "32px" }}>
      {showPrintableReport ? (
        <PrintableAttendanceReport
          filteredRecords={filteredAttendanceRecords}
          onClose={() => setShowPrintableReport(false)}
        />
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box display="flex" justifyContent="center" mb={6}>
              <TextField
                variant="outlined"
                placeholder="Search attendance records..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <FaSearch style={{ marginRight: 8, color: theme.palette.text.secondary }} />
                  ),
                }}
                sx={{
                  width: "100%",
                  maxWidth: "500px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "50px",
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: theme.shadows[2],
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      boxShadow: theme.shadows[4],
                    },
                    "&.Mui-focused": {
                      boxShadow: theme.shadows[6],
                    },
                  },
                }}
              />
              <Box ml={2}>
                <FormControl>
                  <InputLabel id="filter-label">Filter By</InputLabel>
                  <Select
                    labelId="filter-label"
                    value={filterType}
                    onChange={handleFilterChange}
                    label="Filter By"
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="date">Date</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              {filterType === "date" && (
                <Box ml={2}>
                  <StyledDatePicker
                    selected={startDate}
                    onChange={handleStartDateChange}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Start Date"
                  />
                  <StyledDatePicker
                    selected={endDate}
                    onChange={handleEndDateChange}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="End Date"
                  />
                </Box>
              )}
            </Box>
          </motion.div>
          <Grid container spacing={3}>
            <AnimatePresence>
              {filteredAttendanceRecords.map((record) => (
                <Grid item xs={12} sm={6} md={4} key={record.id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card sx={getCardStyle(theme)}>
                      <CardHeader
                        title={record.name}
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                          textAlign: "center",
                          padding: theme.spacing(2),
                        }}
                      />
                      <CardContent>
                        {[
                          { label: "Start Date", value: record.startDate },
                          { label: "End Date", value: record.endDate },
                          { label: "Attendance Status", value: record.attendanceStatus },
                        ].map((item, index) => (
                          <Typography
                            key={index}
                            variant="body2"
                            gutterBottom
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              borderBottom: index !== 2 ? `1px solid ${theme.palette.divider}` : "none",
                              py: 1,
                            }}
                          >
                            <strong>{item.label}:</strong>
                            <span>{item.value}</span>
                          </Typography>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
          <Box mt={4} display="flex" justifyContent="center">
            <Button variant="contained" color="primary" onClick={handlePrintReport}>
              Generate Printable Report
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AttendanceMaster;