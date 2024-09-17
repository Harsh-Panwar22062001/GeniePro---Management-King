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
  AlertTitle,
  IconButton,
  FormHelperText 
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { differenceInDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { useAttendance } from '../../components/statemanagement/AttendanceContext';

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

const StyledDatePickerContainer = styled('div')({
  '& .react-datepicker-wrapper': {
    width: '100%',
  },
  '& .react-datepicker': {
    zIndex: 1000,
  },
  '& .react-datepicker-popper': {
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

const AttendanceReport = () => {
  const { user } = useSelector((state) => state.auth);
  const { addAttendanceRecord } = useAttendance();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [reason, setReason] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [alertVisible, setAlertVisible] = useState(false); 
  const [isFormValid, setIsFormValid] = useState(false); // Track form validity

  const [errors, setErrors] = useState({
    name: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  useEffect(() => {
    if (startDate && endDate) {
      const days = differenceInDays(endDate, startDate) + 1;
      setNumberOfDays(days);
    } else {
      setNumberOfDays(0);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    // Check if the form is valid by ensuring all fields are filled and no errors exist
    const isValid = 
      selectedName && startDate && endDate && reason && 
      !Object.values(errors).some(error => error !== "");
    setIsFormValid(isValid);
  }, [selectedName, startDate, endDate, reason, errors]);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date > endDate) {
      setEndDate(null);
    }
    validateField("startDate", date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    validateField("endDate", date);
  };

  const validateField = (field, value) => {
    let errorMessage = "";
    switch (field) {
      case "name":
        if (!value) errorMessage = "Name is required";
        break;
      case "startDate":
        if (!value) errorMessage = "Start date is required";
        break;
      case "endDate":
        if (!value) {
          errorMessage = "End date is required";
        } else if (startDate && value < startDate) {
          errorMessage = "End date must be after start date";
        }
        break;
      case "reason":
        if (!value.trim()) errorMessage = "Reason is required";
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [field]: errorMessage }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if there are any errors
    const hasErrors = Object.values(errors).some(error => error !== "");
    
    if (!hasErrors) {
      const newAttendanceRecord = {
        name: selectedName,
        startDate: startDate ? startDate.toDateString() : "",
        endDate: endDate ? endDate.toDateString() : "",
        numberOfDays,
        reason,
      };
      addAttendanceRecord(newAttendanceRecord);
      
      setAlertVisible(true);
      
      setTimeout(() => {
        setAlertVisible(false);
      }, 4000);

      // Reset form
      setSelectedName("");
      setStartDate(null);
      setEndDate(null);
      setReason("");
      setNumberOfDays(0);
    }
  };

  const names = ["John Doe", "Jane Smith", "Michael Johnson", "Emily Brown", "David Wilson"];

  return (
    <Container maxWidth="sm">
      <FormWrapper elevation={3}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" mb={4} align="center" fontWeight="bold" color="primary">
            Attendance Report
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal" error={!!errors.name}>
              <InputLabel id="name-select-label">Name</InputLabel>
              <StyledSelect
                labelId="name-select-label"
                value={selectedName}
                onChange={(e) => {
                  setSelectedName(e.target.value);
                  validateField("name", e.target.value);
                }}
                label="Name"
              >
                {names.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </StyledSelect>
              {errors.name && <FormHelperText>{errors.name}</FormHelperText>}
            </FormControl>

            <StyledDatePickerContainer>
              <FormControl fullWidth margin="normal" error={!!errors.startDate}>
                <StyledDatePicker
                  selected={startDate}
                  onChange={handleStartDateChange}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="MMMM d, yyyy"
                  placeholderText="Start Date"
                />
                {errors.startDate && <FormHelperText>{errors.startDate}</FormHelperText>}
              </FormControl>
            </StyledDatePickerContainer>

            <StyledDatePickerContainer>
              <FormControl fullWidth margin="normal" error={!!errors.endDate}>
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
                {errors.endDate && <FormHelperText>{errors.endDate}</FormHelperText>}
              </FormControl>
            </StyledDatePickerContainer>

            <TextField
              fullWidth
              margin="normal"
              label="Reason for leave"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                validateField("reason", e.target.value);
              }}
              multiline
              rows={3}
              error={!!errors.reason}
              helperText={errors.reason}
            />

            <AnimatePresence>
              {alertVisible && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Alert
                    severity="success"
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
                  >
                    <AlertTitle>Success</AlertTitle>
                    Attendance record submitted successfully!
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <Box mt={4} textAlign="center">
              <StyledButton type="submit" disabled={!isFormValid}>
                Submit
              </StyledButton>
            </Box>
          </Box>
        </MotionBox>
      </FormWrapper>
    </Container>
  );
};

export default AttendanceReport;
