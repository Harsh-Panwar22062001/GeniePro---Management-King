// AttendanceMaster.js
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Box,
  TextField,
  Slide,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { useAttendance } from '../../components/statemanagement/AttendanceContext';

const getCardStyle = () => ({
  backgroundColor: "#f5f5f5",
  border: "1px solid #ddd",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
  },
});

const AttendanceMaster = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { attendanceRecords } = useAttendance();

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredAttendanceRecords = attendanceRecords.filter((record) =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <TextField
          variant="outlined"
          placeholder="Search attendance records..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: <FaSearch style={{ marginRight: 8 }} />,
          }}
          sx={{
            flex: 1,
            maxWidth: "300px",
            marginTop:"30px"
          }}
        />
      </Box>
      <Grid container spacing={3}>
        {filteredAttendanceRecords.map((record) => (
          <Grid item xs={12} sm={6} md={4} key={record.id}>
            <Slide direction="up" in={true} mountOnEnter unmountOnExit>
              <Card sx={getCardStyle()}>
                <CardHeader
                  title={record.name}
                  sx={{ backgroundColor: "#f5f5f5", textAlign: "center" }}
                />
                <CardContent>
                  <Typography variant="body2" gutterBottom>
                    <strong>Time In:</strong> {record.timeIn || "Not recorded"}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Time Out:</strong> {record.timeOut || "Not recorded"}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Start Date:</strong> {record.startDate}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>End Date:</strong> {record.endDate}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Total Work Hours:</strong> {record.totalWorkHours || "Not calculated"}
                  </Typography>
                </CardContent>
              </Card>
            </Slide>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AttendanceMaster;
