import React from 'react';
import {
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Typography
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Person, Lock, Key } from '@mui/icons-material';

function Register() {
  return (
    <Container component="main" maxWidth="md" sx={{ mt: 8, mb: 4 }}>
      <Card sx={{ borderRadius: '25px' }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item md={6} xs={12} container direction="column" alignItems="center">
              <Typography variant="h4" component="h1" align="center" gutterBottom>
                Sign Up
              </Typography>

              <TextField
                label="Your Name"
                id="form1"
                type="text"
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Your Email"
                id="form2"
                type="email"
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Password"
                id="form3"
                type="password"
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        {/* <Visibility /> */}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Repeat your password"
                id="form4"
                type="password"
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Key />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        {/* <Visibility /> */}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

           

              <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
                Register
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
    </Container>
  );
}

export default Register;
