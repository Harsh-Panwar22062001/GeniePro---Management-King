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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { addDays, differenceInDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
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
  const { user } = useSelector((state) => state.auth);
  const { addLeaveRequest } = useLeaves();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [reason, setReason] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLeaveRequest = {
      name: selectedName,
      startDate: startDate ? startDate.toDateString() : "", // Format the date
      endDate: endDate ? endDate.toDateString() : "", // Format the date
      numberOfDays,
      reason,
      leaveType: "Urgent",
      status: "Pending",
    };
    addLeaveRequest(newLeaveRequest);

    setAlertVisible(true); // Show alert

    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);
  };

  // Random names for the dropdown (you can replace this with actual user data)
  const names = [
    "John Doe",
    "Jane Smith",
    "Michael Johnson",
    "Emily Brown",
    "David Wilson",
  ];

  return (
    <Container maxWidth="sm" >

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
                  <MenuItem key={name} value={name}>
                    {name}
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
              >
                Apply for Urgent Leave
              </StyledButton>
            </Box>

            
          </Box>

          <AnimatePresence>
              {alertVisible && (
                
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
                
              )}
            </AnimatePresence>
        </MotionBox>
      </FormWrapper>
    </Container>
  );
};

export default UrgentLeaveForm;
