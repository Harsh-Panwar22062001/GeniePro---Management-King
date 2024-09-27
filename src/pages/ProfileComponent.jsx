import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Box,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';

const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(3, 0),
  borderRadius: '15px',
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  marginBottom: theme.spacing(2),
}));

const ProfileInfo = () => {
  const { userData: initialUserData } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState(initialUserData); // Define userData state

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  if (!userData) {
    return <Typography>Loading profile information...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <ProfilePaper elevation={3}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <LargeAvatar>{userData.user_fname.charAt(0).toUpperCase()}</LargeAvatar>
          <Typography variant="h4">{`${userData.user_fname} ${userData.user_lname}`}</Typography>
          <Typography variant="subtitle1" color="textSecondary">Employee Code: {userData.user_ecode}</Typography>
        </Box>
        <Divider />
        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Email</Typography>
            <Typography variant="body1">{userData.user_email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Mobile</Typography>
            <Typography variant="body1">{userData.user_mob}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">Aadhar Number</Typography>
            <Typography variant="body1">{userData.user_addhar}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">PAN Number</Typography>
            <Typography variant="body1">{userData.user_pan}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Address</Typography>
            <Typography variant="body1">{userData.user_add}</Typography>
          </Grid>
        </Grid>
      </ProfilePaper>
    </Container>
  );
};

export default ProfileInfo;