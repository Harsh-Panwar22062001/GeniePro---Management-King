import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Box,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { names, schools } from '../../assets/userdata';
import axios from 'axios';

const EditExpense = ({ expense, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    exp_id: expense.id,
    exp_emp_id: '',
    exp_emp_name: '',
    exp_to: expense.toSchool,
    exp_from: expense.fromSchool,
    exp_date: dayjs(expense.selectedDate),
    exp_time: dayjs(expense.time),
    exp_amt: expense.amount,
    exp_upload: null
  });

  useEffect(() => {
    // Find the employee in the names array
    const employee = names.find(name => name.name === expense.name);
    if (employee) {
      setFormData(prevData => ({
        ...prevData,
        exp_emp_id: employee.emp_id,
        exp_emp_name: employee.name
      }));
    }
  }, [expense]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'exp_emp_id') {
      const selectedEmployee = names.find(emp => emp.emp_id === value);
      setFormData(prevData => ({
        ...prevData,
        exp_emp_id: value,
        exp_emp_name: selectedEmployee ? selectedEmployee.name : ''
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };



  const [previewImage, setPreviewImage] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
const [alertSeverity, setAlertSeverity] = useState('error');



  const handleDateChange = (date) => {
    setFormData(prevData => ({
      ...prevData,
      exp_date: date
    }));
  };

  const handleTimeChange = (time) => {
    setFormData(prevData => ({
      ...prevData,
      exp_time: time
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prevData => ({
        ...prevData,
        exp_upload: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const jsonData = {
      header: "app_exp_edit",
      data: {
        exp_id: formData.exp_id.toString(),
        exp_emp_id: formData.exp_emp_id,
        exp_to: formData.exp_to,
        exp_from: formData.exp_from,
        exp_date: formData.exp_date.format('DD/MM/YYYY'),
        exp_time: formData.exp_time.format('HH:mm:ss'),
        exp_amt: formData.exp_amt.toString(),
        exp_upload: formData.exp_upload ? formData.exp_upload.name : ''
      }
    };

    try {
      const response = await axios.post(
        "https://workpanel.in/office_app/update_data/edit_expense.php",
        jsonData
      );

      if (response.data.success) {
        onUpdate({...formData, name: formData.exp_emp_name});
        onClose();
      } else {
        // Handle error
        console.error("Failed to Edit Expense:", response.data);
      }
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Edit Expense</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Employee Name</InputLabel>
            <Select
              name="exp_emp_id"
              value={formData.exp_emp_id}
              onChange={handleChange}
              label="Employee Name"
            >
              {names.map((name) => (
                <MenuItem key={name.emp_id} value={name.emp_id}>
                  {name.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
         
          <FormControl fullWidth margin="dense">
            <InputLabel>To School</InputLabel>
            <Select
              name="exp_to"
              value={formData.exp_to}
              onChange={handleChange}
              label="To School"
            >
              {schools.map((school) => (
                <MenuItem key={school} value={school}>
                  {school}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>From School</InputLabel>
            <Select
              name="exp_from"
              value={formData.exp_from}
              onChange={handleChange}
              label="From School"
            >
              {schools.map((school) => (
                <MenuItem key={school} value={school}>
                  {school}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              value={formData.exp_date}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
            />
            <TimePicker
              label="Time"
              value={formData.exp_time}
              onChange={handleTimeChange}
              renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
            />
          </LocalizationProvider>
          <TextField
            fullWidth
            margin="dense"
            name="exp_amt"
            label="Amount"
            type="number"
            value={formData.exp_amt}
            onChange={handleChange}
          />
          <Box mt={2}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" component="span">
                Upload Image
              </Button>
            </label>
          </Box>
          {previewImage && (
            <Box mt={2}>
              <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
            </Box>
          )}
        </DialogContent>


        
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>


        
      </form>
    </Dialog>
  );
};

export default EditExpense;