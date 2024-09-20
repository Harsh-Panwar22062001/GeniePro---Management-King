import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Container,
  Typography,
  useMediaQuery,
  TextField,
  Alert,
  IconButton,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { names , schools} from '../../assets/userdata';
import axios from "axios";


// Styled components
const FormWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
  background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
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




const AddExpense = () => {
  const [name, setName] = useState("");
  const [toSchool, setToSchool] = useState("");
  const [fromSchool, setFromSchool] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [time, setTime] = useState(null);
  const [amount, setAmount] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));





  // Validation logic
  
  const handleSubmit = async (e) => {
    e.preventDefault();

   if (!selectedName || !toSchool || !fromSchool || !selectedDate || !time || !amount) {
    setAlertMessage("Oops! You missed some fields. Please fill them out! 🎯");
    setAlertSeverity("error");
    setAlertVisible(true);
    return;
  }

    const formattedDate = dayjs(selectedDate).format("DD/MM/YYYY");
    const formattedTime = dayjs(time).format("HH:mm:ss");

    const selectedEmployee = names.find((name) => name.name === selectedName);
    const empId = selectedEmployee.emp_id;

    const jsonData = {
      header: "app_exp",
      data: {
        exp_emp_id: empId, // This is hardcoded as per the example
        exp_to: toSchool,
        exp_from: fromSchool,
        exp_date: formattedDate,
        exp_time: formattedTime,
        exp_amt: amount,
        exp_upload: "", // This field is empty as it's not part of the form
      },
    };

    try {
      const response = await axios.post(
        "https://workpanel.in/office_app/put_data/add_expense.php",
        jsonData
      );

      if (response.data.success) {
        setAlertMessage("Expense added successfully! 🎉");
        setAlertSeverity("success");
        
        // Reset form after success
        setName("");
        setToSchool("");
        setFromSchool("");
        setSelectedDate(null);
        setTime(null);
        setAmount("");
      } else {
        setAlertMessage("Failed to add expense. Please try again. 🤕");
        setAlertSeverity("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setAlertMessage("An error occurred. Please try again. 🤕");
      setAlertSeverity("error");
    }

    setAlertVisible(true);

    setTimeout(() => {
      setAlertVisible(false);
    }, 5000);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="md" sx={{ marginTop: "60px" }}>
        <FormWrapper elevation={3}>
          <Typography
            variant="h4"
            mb={4}
            align="center"
            fontWeight="bold"
            color="primary"
          >
            Expense Form
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
  <InputLabel id="name-select-label">Name</InputLabel>
  <Select
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
  </Select>
</FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel id="from-select-label">From</InputLabel>
              <Select
                labelId="from-select-label"
                value={fromSchool}
                onChange={(e) => setFromSchool(e.target.value)}
                label="From"
              >
                {schools.map((school) => (
                  <MenuItem key={school} value={school}>
                    {school}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel id="to-select-label">To</InputLabel>
              <Select
                labelId="to-select-label"
                value={toSchool}
                onChange={(e) => setToSchool(e.target.value)}
                label="To"
              >
                {schools.map((school) => (
                  <MenuItem key={school} value={school}>
                    {school}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box mt={2} mb={2}>
              <StyledDatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="MMMM d, yyyy"
                placeholderText="Select date"
              />
            </Box>

            <FormControl fullWidth margin="normal">
              <TimePicker
                value={time}
                onChange={(newValue) => setTime(newValue)}
                renderInput={(params) => <TextField {...params} label="Select Time" />}
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <TextField
                label="Amount (₹)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                InputProps={{
                  startAdornment: <Typography>₹</Typography>,
                }}
              />
            </FormControl>

            <Box mt={4} display="flex" justifyContent="center">
              <StyledButton type="submit" fullWidth={isMobile}>
                Submit
              </StyledButton>
            </Box>

            <AnimatePresence>
              {alertVisible && (
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.5 }}
                >
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
                        : "linear-gradient(45deg, #f44336 30%, #ff1744 90%)",
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
                    {alertMessage}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </FormWrapper>
      </Container>
    </LocalizationProvider>
  );
};

export default AddExpense;
