import React, { useState } from 'react';
import {
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Person, Lock } from '@mui/icons-material';
import axios from 'axios';

function Register() {
  const [user, setUser] = useState({
    user_fname: '',
    user_lname: '',
    user_email: '',
    user_mob: '',
    user_addhar: '',
    user_pan: '',
    user_ecode: '',
    user_add: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    user_fname: '',
    user_lname: '',
    user_email: '',
    user_mob: '',
    user_addhar: '',
    user_pan: '',
    user_ecode: '',
    user_add: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let error = '';
    switch (fieldName) {
      case 'user_fname':
        if (value.length < 3) {
          error = 'First name must be at least 3 characters long';
        }
        break;
      case 'user_lname':
        if (value.length < 3) {
          error = 'Last name must be at least 3 characters long';
        }
        break;
      case 'user_email':
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          error = 'Invalid email address';
        }
        break;
      case 'user_mob':
        if (!/^\d{10}$/.test(value)) {
          error = 'Invalid mobile number';
        }
        break;
      case 'user_addhar':
        if (!/^\d{12}$/.test(value)) {
          error = 'Invalid Aadhar number';
        }
        break;
      case 'user_pan':
        if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(value)) {
          error = 'Invalid PAN number';
        }
        break;
      case 'user_ecode':
        if (!/^[A-Z]{3}\d{4}$/.test(value)) {
          error = 'Invalid Employee code';
        }
        break;
      case 'user_add':
        if (value.length < 10) {
          error = 'Address must be at least 10 characters long';
        }
        break;
      case 'password':
        if (value.length < 8) {
          error = 'Password must be at least 8 characters long';
        }
        break;
      case 'confirmPassword':
        if (value !== user.password) {
          error = 'Passwords do not match';
        }
        break;
      default:
        break;
    }
    setErrors({ ...errors, [fieldName]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = Object.keys(errors).every((key) => errors[key] === '');
    if (isValid) {
      const jsonData = {
        header: "newuserdata",
        data: {
          user_fname: user.user_fname,
          user_lname: user.user_lname,
          user_email: user.user_email,
          user_mob: user.user_mob,
          user_addhar: user.user_addhar,
          user_pan: user.user_pan,
          user_ecode: user.user_ecode,
          user_add: user.user_add
        }
      };

      console.log('JSON data to be sent:', JSON.stringify(jsonData, null, 2));

      try {
        const response = await axios.post('https://workpanel.in/office_app/put_data/new_user_data.php', jsonData);
        if (response.data.success && response.data.msg === '1') {
          setSnackbar({ open: true, message: 'User registered successfully!', severity: 'success' });
        } else {
          setSnackbar({ open: true, message: 'Registration failed. Please try again.', severity: 'error' });
        }
      } catch (error) {
        console.error('Error during registration:', error);
        setSnackbar({ open: true, message: 'An error occurred. Please try again later.', severity: 'error' });
      }
    } else {
      setSnackbar({ open: true, message: 'Please correct the errors in the form.', severity: 'warning' });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Card sx={{ borderRadius: '25px' }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item md={6} xs={12} container direction="column" alignItems="center">
              <Typography variant="h4" component="h1" align="center" gutterBottom>
                Sign Up
              </Typography>

              {/* First Name */}
              <TextField
                label="First Name"
                name="user_fname"
                type="text"
                fullWidth
                margin="normal"
                placeholder="Enter your first name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
                value={user.user_fname}
                onChange={handleInputChange}
                error={errors.user_fname !== ''}
                helperText={errors.user_fname}
              />

              {/* Last Name */}
              <TextField
                label="Last Name"
                name="user_lname"
                type="text"
                fullWidth
                margin="normal"
                placeholder="Enter your last name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
                value={user.user_lname}
                onChange={handleInputChange}
                error={errors.user_lname !== ''}
                helperText={errors.user_lname}
              />

              {/* Email */}
              <TextField
                label="Email"
                name="user_email"
                type="email"
                fullWidth
                margin="normal"
                placeholder="Enter your email address"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
                value={user.user_email}
                onChange={handleInputChange}
                error={errors.user_email !== ''}
                helperText={errors.user_email}
              />

              {/* Mobile Number */}
              <TextField
                label="Mobile Number"
                name="user_mob"
                type="text"
                fullWidth
                margin="normal"
                placeholder="Enter a 10-digit mobile number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
                value={user.user_mob}
                onChange={handleInputChange}
                error={errors.user_mob !== ''}
                helperText={errors.user_mob}
              />

              {/* Aadhar Number */}
              <TextField
                label="Aadhar Number"
                name="user_addhar"
                type="text"
                fullWidth
                margin="normal"
                placeholder="Enter your 12-digit Aadhar number"
                value={user.user_addhar}
                onChange={handleInputChange}
                error={errors.user_addhar !== ''}
                helperText={errors.user_addhar}
              />

              {/* PAN Number */}
              <TextField
                label="PAN Number"
                name="user_pan"
                type="text"
                fullWidth
                margin="normal"
                placeholder="Enter your PAN (ABCDE1234F)"
                value={user.user_pan}
                onChange={handleInputChange}
                error={errors.user_pan !== ''}
                helperText={errors.user_pan}
              />

              {/* Employee Code */}
              <TextField
                label="Employee Code"
                name="user_ecode"
                type="text"
                fullWidth
                margin="normal"
                placeholder="Enter your employee code (ABC1234)"
                value={user.user_ecode}
                onChange={handleInputChange}
                error={errors.user_ecode !== ''}
                helperText={errors.user_ecode}
              />

              {/* Address */}
              <TextField
                label="Address"
                name="user_add"
                type="text"
                fullWidth
                margin="normal"
                placeholder="Enter your complete address"
                value={user.user_add}
                onChange={handleInputChange}
                error={errors.user_add !== ''}
                helperText={errors.user_add}
              />

              {/* Password */}
              <TextField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                placeholder="Enter a strong password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={user.password}
                onChange={handleInputChange}
                error={errors.password !== ''}
                helperText={errors.password}
              />

              {/* Confirm Password */}
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                placeholder="Re-enter your password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={user.confirmPassword}
                onChange={handleInputChange}
                error={errors.confirmPassword !== ''}
                helperText={errors.confirmPassword}
              />

              {/* Submit Button */}
              <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                Sign Up
              </Button>
            </Grid>
            <Grid item md={6} xs={12} container alignItems="center" justifyContent="center">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                alt="Registration"
                style={{ maxWidth: '100%', borderRadius: '10px' }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Register;
