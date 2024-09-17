import React, { useState } from "react";
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
  FormHelperText
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { addDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { useLeaves } from '../../components/statemanagement/LeaveContext';

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

const PlannedLeave = () => {
  const { user } = useSelector((state) => state.auth);
  const { addLeaveRequest } = useLeaves(); 
  const [selectedDate, setSelectedDate] = useState(null);
  const [reason, setReason] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    date: "",
    reason: ""
  });

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = { name: "", date: "", reason: "" };

    if (!selectedName) {
      newErrors.name = "Please select a name";
      isValid = false;
    }

    if (!selectedDate) {
      newErrors.date = "Please select a date";
      isValid = false;
    }

    if (!reason.trim()) {
      newErrors.reason = "Please provide a reason for leave";
      isValid = false;
    } else if (reason.trim().length < 10) {
      newErrors.reason = "Reason should be at least 10 characters long";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newLeaveRequest = {
        name: selectedName,
        startDate: selectedDate ? selectedDate.toDateString() : "",
        reason: reason,
        leaveType: "Planned",
        numberOfDays: 1,
        status: "Pending",
      };

      addLeaveRequest(newLeaveRequest);
      setAlertVisible(true);

      // Reset form
      setSelectedName("");
      setSelectedDate(null);
      setReason("");

      setTimeout(() => {
        setAlertVisible(false);
      }, 3000);
    }
  };

  const isFutureDate = (date) => {
    return date > new Date();
  };

  // Random names for the dropdown
  const names = [
    "John Doe",
    "Jane Smith",
    "Michael Johnson",
    "Emily Brown",
    "David Wilson",
  ];

  return (
    <Container maxWidth="sm">
      <FormWrapper elevation={3}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" mb={4} align="center" fontWeight="bold" color="primary">
            Apply for Planned Leave
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal" error={!!errors.name}>
              <InputLabel id="name-select-label">Name</InputLabel>
              <StyledSelect
                labelId="name-select-label"
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
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
              <FormControl fullWidth margin="normal" error={!!errors.date}>
                <StyledDatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="MMMM d, yyyy"
                  filterDate={isFutureDate}
                  placeholderText="Select a future date"
                  minDate={addDays(new Date(), 1)}
                />
                {errors.date && <FormHelperText>{errors.date}</FormHelperText>}
              </FormControl>
            </StyledDatePickerContainer>

            <TextField
              label="Reason for Leave Application"
              multiline
              rows={4}
              fullWidth
              margin="normal"
              variant="outlined"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              error={!!errors.reason}
              helperText={errors.reason}
            />

            <Box mt={4} display="flex" justifyContent="center">
              <StyledButton
                type="submit"
                variant="contained"
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Apply for Leave
              </StyledButton>
            </Box>

            <AnimatePresence>
              {alertVisible && (
                <MotionBox
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <Alert
                    severity="success"
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
                      background: "linear-gradient(45deg, #4caf50 30%, #2196f3 90%)",
                      color: "white",
                      "& .MuiAlert-icon": {
                        color: "white",
                      },
                      "& .MuiIconButton-root": {
                        color: "white",
                      },
                      boxShadow: "0 3px 5px 2px rgba(76, 175, 80, .3)",
                      borderRadius: "8px",
                      marginTop: "16px",
                    }}
                  >
                    Applied Successfully!📧👍
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

export default PlannedLeave;
