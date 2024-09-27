import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Container,
  Alert,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { addDays, differenceInDays,format } from "date-fns";    
import { motion, AnimatePresence } from "framer-motion";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { names } from '../../assets/userdata';
import { useLeaves } from "../../components/statemanagement/LeaveContext";

import axios from "axios";

const FormWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
  marginTop: theme.spacing(8),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(6),
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.spacing(3),
  textTransform: "none",
  fontSize: "1rem",
  fontWeight: 600,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    transform: "translateY(-2px)",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
  },
}));

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

const StyledDatePickerContainer = styled("div")({
  "& .react-datepicker-wrapper": {
    width: "100%",
  },
  "& .react-datepicker": {
    zIndex: 1000,
  },
  "& .react-datepicker-popper": {
    zIndex: 1000,
  },
});

const StyledSelect = styled(Select)(({ theme }) => ({
  "& .MuiSelect-select": {
    padding: theme.spacing(1.5),
  },
}));

const MotionBox = styled(motion.div)({
  width: "100%",
});

const WfhForm = () => {
  const { user } = useSelector((state) => state.auth);
  const { addLeaveRequest } = useLeaves();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [reason, setReason] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState(""); // New state for alert message
  const [alertSeverity, setAlertSeverity] = useState("success"); // New state for alert severity

  useEffect(() => {
    if (startDate && endDate) {
      const days = differenceInDays(endDate, startDate) + 1;
      setNumberOfDays(days);
    } else {
      setNumberOfDays(0);
    }
  }, [startDate, endDate]);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date > endDate) {
      setEndDate(null);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingFields = [];
    if (!selectedName) missingFields.push("Name");
    if (!startDate) missingFields.push("Start Date");
    if (!endDate) missingFields.push("End Date");
    if (!reason) missingFields.push("Reason");

    if (missingFields.length > 0) {
      setAlertSeverity("error");
      setAlertMessage(`Please fill in the following fields: ${missingFields.join(", ")}`);
      setAlertVisible(true);
      return;
    }

    const newLeaveRequest = {
      name: selectedName,
      startDate: startDate ? startDate.toDateString() : "",
      endDate: endDate ? endDate.toDateString() : "",
      numberOfDays,
      reason,
      leaveType: "WFH",
      status: "Pending",
    };

    const jsonData = {
      header: "app_wfh",
      data: {
        wfh_emp_id: "emp001",
        wfh_strt_date: startDate ? format(startDate, "dd/MM/yyyy") : "",
        wfh_end_date: endDate ? format(endDate, "dd/MM/yyyy") : "",
        wfh_no_days: numberOfDays.toString(),
        wfh_reason: reason,
        wfh_file: "",
        wfh_type: "sick",
      },
    };

    try {
      const response = await axios.post("https://workpanel.in/office_app/put_data/apply_whf.php", jsonData);
  
      console.log("Raw server response:", response.data);
  
      let parsedData = response.data;
  
      console.log("Parsed server response:", parsedData);
  
      if (parsedData.success && parsedData.msg === "1") {
        addLeaveRequest(newLeaveRequest);
  
        setAlertSeverity("success");
        setAlertMessage("Applied Successfully!");
      } else {
        setAlertSeverity("error");
        setAlertMessage(`Failed to apply. Server response: ${JSON.stringify(parsedData)}`);
      }
    } catch (error) {
      console.error("Error applying leave:", error);
      setAlertSeverity("error");
      setAlertMessage(`An error occurred. Please try again. Error: ${error.message}`);
    }
  
    setAlertVisible(true);
  
    setTimeout(() => {
      setAlertVisible(false);
    }, 5000);
  };


  const namesList = names.map((name) => (
    name && (
      <MenuItem key={name} value={name}>
        {name}
      </MenuItem>
    )
  ));

  return (
    <Container maxWidth="sm">
      <FormWrapper elevation={3}>
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Typography variant="h4" mb={4} align="center" fontWeight="bold" color="primary">
            Apply for Work From Home
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="name-select-label">Name</InputLabel>
              <StyledSelect
  labelId="name-select-label"
  value={selectedName}
  onChange={(e) => setSelectedName(e.target.value)}
  label="Name"
>
{names.map((name) => (
  name.name && name.name.trim() !== "" && (
    <MenuItem key={name.emp_id} value={name.name}>
      {name.name}
    </MenuItem>
  )
))}
</StyledSelect>
            </FormControl>

            <StyledDatePickerContainer>
              <FormControl fullWidth margin="normal">
                <StyledDatePicker
                  selected={startDate}
                  onChange={handleStartDateChange}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="MMMM d, yyyy"
                  placeholderText="Start Date"
                />
              </FormControl>
            </StyledDatePickerContainer>

            <StyledDatePickerContainer>
              <FormControl fullWidth margin="normal">
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
              </FormControl>
            </StyledDatePickerContainer>

            <TextField
              label="Number of Days"
              fullWidth
              margin="normal"
              variant="outlined"
              value={numberOfDays}
              InputProps={{
                readOnly: true,
              }}
            />

            <TextField
              label="Reason for Work From Home Application"
              multiline
              rows={4}
              fullWidth
              margin="normal"
              variant="outlined"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <Box mt={4} display="flex" justifyContent="center">
              <StyledButton type="submit" variant="contained" component={motion.button} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Submit
              </StyledButton>
            </Box>

            {/* Success/Error Alert */}
            <AnimatePresence>
              {alertVisible && (
                <MotionBox initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.5 }}>
                  <Alert
                    severity={alertSeverity}
                    icon={<CheckCircleOutlineIcon fontSize="inherit" />}
                    action={
                      <IconButton aria-label="close" color="inherit" size="small" onClick={() => setAlertVisible(false)}>
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{
                      background: alertSeverity === "success"
                        ? "linear-gradient(45deg, #4caf50 30%, #2196f3 90%)"
                        : "linear-gradient(45deg, #f44336 30%, #e57373 90%)",
                      color: "white",
                      "& .MuiAlert-icon": { color: "white" },
                      "& .MuiIconButton-root": { color: "white" },
                      mt: 4,
                    }}
                  >
                    {alertMessage}
                  </Alert>
                </MotionBox>
              )}
            </AnimatePresence>
          </Box>
        </MotionBox>
      </FormWrapper>
    </Container>
  );
};

export default WfhForm;
