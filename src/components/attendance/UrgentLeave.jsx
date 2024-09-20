import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { differenceInDays , format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { names } from '../../assets/userdata';
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { useLeaves } from "../../components/statemanagement/LeaveContext";

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
  "&:disabled": {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.grey[500],
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

const UrgentLeaveForm = () => {
  const { addLeaveRequest } = useLeaves();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [reason, setReason] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    if (startDate && endDate) {
      const days = differenceInDays(endDate, startDate) + 1;
      setNumberOfDays(days);
    } else {
      setNumberOfDays(0);
    }

    // Validate the form
    validateForm();
  }, [startDate, endDate, reason, selectedName]);

  const validateForm = () => {
    if (
      selectedName && // Check if name is selected
      startDate && // Check if start date is selected
      endDate && // Check if end date is selected
      reason.trim() !== "" && // Check if reason is provided
      startDate <= endDate // Ensure start date is before or same as end date
    ) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  };

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
    if (!formValid) return;

    const formattedStartDate = startDate ? format(startDate, "dd/MM/yyyy") : "";
    const formattedEndDate = endDate ? format(endDate, "dd/MM/yyyy") : "";


    const selectedEmployee = names.find((name) => name.name === selectedName);
    const empId = selectedEmployee.emp_id;

    const jsonData = {
      header: "app_leave",
      data: {
        leave_emp_id: empId, // Replace with actual employee ID
        leave_strt_date: formattedStartDate,
        leave_end_date: formattedEndDate,
        leave_no_days: numberOfDays.toString(),
        leave_reason: reason,
        leave_file: "", // You might want to handle file upload separately
        leave_type: "urgent"
      }
    };

    console.log("Sending data:", JSON.stringify(jsonData, null, 2));

    try {
      const response = await axios.post('https://workpanel.in/office_app/put_data/apply_leave.php', jsonData);
      
      console.log("Raw server response:", response.data);

      // Extract JSON from the response
      const jsonStartIndex = response.data.indexOf('{');
      const jsonEndIndex = response.data.lastIndexOf('}') + 1;
      const jsonString = response.data.slice(jsonStartIndex, jsonEndIndex);

      let parsedData;
      try {
        parsedData = JSON.parse(jsonString);
      } catch (error) {
        console.error("Error parsing response data:", error);
        parsedData = { success: false, msg: "Error parsing server response" };
      }

      console.log("Parsed server response:", parsedData);

      if (parsedData.success === true && parsedData.msg === "1") {
        setAlertMessage("Urgent leave applied successfully!");
        setAlertSeverity("success");
        
        addLeaveRequest({
          name: selectedName,
          startDate: startDate ? startDate.toDateString() : "",
          endDate: endDate ? endDate.toDateString() : "",
          numberOfDays,
          reason,
          leaveType: "Urgent",
          status: "Pending",
        });

        // Reset form
        setSelectedName("");
        setStartDate(null);
        setEndDate(null);
        setReason("");
        setNumberOfDays(0);
      } else {
        setAlertMessage(`Failed to apply leave. Please try again. Server response: ${JSON.stringify(parsedData)}`);
        setAlertSeverity("error");
      }
    } catch (error) {
      console.error("Error applying leave:", error);
      setAlertMessage(`An error occurred. Please try again. Error: ${error.message}`);
      setAlertSeverity("error");
    }

    setAlertVisible(true);

    setTimeout(() => {
      setAlertVisible(false);
    }, 5000);
  };

  const namesList = names.map((name) => (
    <MenuItem key={name} value={name}>
      {name}
    </MenuItem>
  ));


  return (
    <Container maxWidth="sm">
      <FormWrapper elevation={3}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            mb={4}
            align="center"
            fontWeight="bold"
            color="primary"
          >
            Apply for Urgent Leave
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
    <MenuItem key={name.emp_id} value={name.name}>
      {name.name}
    </MenuItem>
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
              label="Reason for Leave Application"
              multiline
              rows={4}
              fullWidth
              margin="normal"
              variant="outlined"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <Box mt={4} display="flex" justifyContent="center">
              <StyledButton
                type="submit"
                variant="contained"
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!formValid} // Disable button if form is not valid
              >
                Apply for Urgent Leave
              </StyledButton>
            </Box>
          </Box>

          <AnimatePresence>
            {alertVisible && (
              <Alert
                severity={alertSeverity}
                icon={<CheckCircleOutlineIcon fontSize="inherit" />}
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => setAlertVisible(false)}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{
                  background: alertSeverity === "success"
                    ? "linear-gradient(45deg, #4caf50 30%, #2196f3 90%)"
                    : "linear-gradient(45deg, #f44336 30%, #ff9800 90%)",
                  color: "white",
                  "& .MuiAlert-icon": {
                    color: "white",
                  },
                }}
                component={motion.div}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {alertMessage}
              </Alert>
            )}
          </AnimatePresence>
        </MotionBox>
      </FormWrapper>
    </Container>
  );
};

export default UrgentLeaveForm;
