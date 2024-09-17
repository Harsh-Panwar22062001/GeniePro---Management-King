import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  TextField,
} from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import { Calendar, Clock, Sun } from 'lucide-react';
import axios from 'axios';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjs from 'dayjs';
import { useTasks } from '../components/statemanagement/TaskContext';


const LandingPage = () => {
  const { latestTask } = useTasks();}

// Array of thoughts to rotate through
const thoughts = [
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Success is not the key to happiness. Happiness is the key to success.", author: "Albert Schweitzer" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" }
];

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
}));

const AnimatedTypography = styled(motion(Typography))({
  marginBottom: '1.4rem',
  fontWeight: 700,
  fontSize: '3rem',
  background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
  backgroundSize: '400% 400%',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: '$gradient 15s ease infinite',
  '@keyframes gradient': {
    '0%': {
      backgroundPosition: '0% 50%',
    },
    '50%': {
      backgroundPosition: '100% 50%',
    },
    '100%': {
      backgroundPosition: '0% 50%',
    },
  },
});

const IconWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: '#f0f4ff',
  marginBottom: '1rem',
});

const NewsCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: theme.shadows[2],
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
}));

const NewsCardMedia = styled(CardMedia)({
  height: 140,
});

const ThoughtCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: theme.shadows[4],
  background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c0fe 100%)',
  padding: theme.spacing(3),
  textAlign: 'center',
  color: '#fff',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
}));


// const CardContent = styled(Card)(({ theme }) => ({
//   borderRadius: '12px',
//   boxShadow: theme.shadows[4],
//   background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c0fe 100%)',
//   padding: theme.spacing(3),
//   textAlign: 'center',
//   color: '#fff',
//   transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
//   '&:hover': {
//     transform: 'translateY(-5px)',
//     boxShadow: theme.shadows[6],
//   },
// }));

const WelcomePage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [news, setNews] = useState([]);
  const [currentThoughtIndex, setCurrentThoughtIndex] = useState(0);
  const { latestTask } = useTasks();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchNews();
    const thoughtInterval = setInterval(() => {
      setCurrentThoughtIndex((prevIndex) => (prevIndex + 1) % thoughts.length);
    }, 10000); // Change thought every 10 seconds
    return () => {
      clearInterval(timer);
      clearInterval(thoughtInterval);
    };
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get('https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=874bf0eeb9834ef68e013438bd204a16');
      setNews(response.data.articles.slice(0, 3));
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, mt: 4 }}>
      <AnimatedTypography
        sx={{
          background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
          fontFamily: "'Poppins', sans-serif",
        }}
        variant="h2"
        gutterBottom
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome to GeniePro
      </AnimatedTypography>

      <Typography
        variant="h5"
        gutterBottom
         
        sx={{
          mb: 4,
          maxWidth: '2900px',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 400,
          fontSize: '1.3rem',
          lineHeight: 1.6,
          color: '#333',
          textAlign: 'center',
          background: 'linear-gradient(to right, #6a11cb, #2575fc)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        Empower your workflow with GeniePro - the all-in-one solution for task management, attendance tracking, and expense reporting.
      </Typography>

      {latestTask ? (
        <Card sx={{ margin: '20px' , maxWidth:'50%' }}>
          <CardContent>
            <Typography variant="h5">Latest Task</Typography>
            <Typography variant="body1"><strong>Task Name:</strong> {latestTask.name}</Typography>
            <Typography variant="body1"><strong>Assigned To:</strong> {latestTask.assignedTo}</Typography>
            <Typography variant="body1"><strong>Status:</strong> {latestTask.status}</Typography>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="body1" sx={{ marginTop: '20px' }}>
          No tasks added yet.
        </Typography>
      )}

      <Grid container spacing={3}>
        {/* Date and Time */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <IconWrapper>
              <Clock size={24} color="#3f51b5" />
            </IconWrapper>
            <Typography variant="h6" gutterBottom>
              {currentTime.toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
            <Typography variant="h4">
              {currentTime.toLocaleTimeString()}
            </Typography>
          </StyledPaper>
        </Grid>

        {/* Calendar */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <IconWrapper>
              <Calendar size={24} color="#4caf50" />
            </IconWrapper>
            <Typography variant="h6" gutterBottom>
              Calendar
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDatePicker
                displayStaticWrapperAs="desktop"
                openTo="day"
                value={dayjs(currentTime)}
                onChange={() => {}}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </StyledPaper>
        </Grid>

        {/* Tech News */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Latest Tech News
          </Typography>
          <Grid container spacing={3}>
            {news.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <NewsCard>
                  {item.urlToImage && (
                    <NewsCardMedia
                      component="img"
                      image={item.urlToImage}
                      alt="News Image"
                    />
                  )}
                  <CardContent>
                    <Typography variant="subtitle1" component="h2" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </NewsCard>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Thought of the Day */}
        <Grid item xs={12} md={4}>
          <ThoughtCard>
            <Typography variant="h6" gutterBottom>
              Thought of the Day
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              "{thoughts[currentThoughtIndex].quote}"
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              - {thoughts[currentThoughtIndex].author}
            </Typography>
          </ThoughtCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WelcomePage;
