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
import { Calendar, Clock, Sun ,Heart } from 'lucide-react';
import axios from 'axios';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjs from 'dayjs';
import { useMediaQuery } from '@mui/material';
import { useTasks } from '../components/statemanagement/TaskContext';
import { thoughtsList} from '..//assets/userdata';
import utc from 'dayjs/plugin/utc';
import { Link } from 'react-router-dom';
import timezone from 'dayjs/plugin/timezone';
import { useAttendance } from '../components/statemanagement/AttendanceContext';
// import { AvatarScene } from './AvatarScene';

dayjs.extend(utc);
dayjs.extend(timezone);



const LandingPage = () => {
  const { latestTask } = useTasks();}

// Array of thoughts to rotate through
const thoughts = thoughtsList;
// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
   paddingLeft: 3,
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
  height: 200, // Fixed height for all images
  objectFit: 'cover',
});

const NewsCardContent = styled(CardContent)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});


const ThoughtCard = styled(Card)(({ theme, bgcolor, textcolor }) => ({
  position: 'relative',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: theme.shadows[4],
  padding: theme.spacing(3),
  textAlign: 'center',
  color: textcolor, 
  background: bgcolor, 
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
}));

const Background = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(135deg, rgba(66, 134, 244, 0.8), rgba(244, 66, 157, 0.8))', // Vibrant gradient
  zIndex: 1,
}));

const Content = styled('div')(({ theme }) => ({
  position: 'relative',
  zIndex: 2, // Ensure content is above the background
  padding: theme.spacing(2),
}));


const Footer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  textAlign: 'center',
  '& .footer-content': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'nowrap',
    whiteSpace: 'nowrap',
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
      display: 'none'
    },
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
  },
  '& .heart-icon': {
    fontSize: '16px',
    color: '#FF69B4',
    margin: '0 4px',
    verticalAlign: 'middle',
    display: 'inline-flex',
  },
  '& .footer-text': {
    fontSize: '0.9rem',
    [theme.breakpoints.up('sm')]: {
      fontSize: '0.7rem',
    },
  },
  '& .footer-link': {
    fontSize: '0.9rem',
    fontWeight: 400,
    color: '#333',
    margin: '0 4px',
    textDecoration: 'none',
    transition: 'color 0.3s ease-in-out',
    '&:hover': {
      color: '#2196F3',
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: '1rem',
    },
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
  const { attendanceRecords } = useAttendance();
  const [news, setNews] = useState([]);
  const [currentThoughtIndex, setCurrentThoughtIndex] = useState(0);
  const [bgColor, setBgColor] = useState('');
  const [textColor, setTextColor] = useState('');
  const { latestTask } = useTasks();
  const isMobile = useMediaQuery('(max-width:600px)');


  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchNews();
    const thoughtInterval = setInterval(() => {
      setCurrentThoughtIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % thoughts.length;
        setBgColor(thoughts[newIndex].bg);
        setTextColor(thoughts[newIndex].text);
        return newIndex;
      });
    }, 10000);
    return () => {
      clearInterval(timer);
      clearInterval(thoughtInterval);
    };
  }, []);

  

  const fetchNews = async () => {
    const API_KEY = '5d03ea2ee3d51d0b75de4f6e1f5a49ff';
    const API_BASE_URL = 'https://gnews.io/api/v4/search';

    
  
    try {
      const response = await axios.get(API_BASE_URL, {
        params: {
          q: 'technology',      // Search query term (you can change this dynamically)
          token: API_KEY,       // API key parameter for GNews
          lang: 'en',           // Language of the news
          country: 'in',        // Country code (India)
          max: 100              // Limit to 100 articles
        }
      });
  
      console.log('API Response:', response.data);
  
      if (response.data && Array.isArray(response.data.articles)) {
        const newsData = response.data.articles;
  
        // Filter news that have title, description, and image
        const newsWithImages = newsData.filter(item =>
          item.title && 
          item.description && 
          item.image && 
          item.image.trim() !== '' // The 'image' field is used for news images in GNews API
        );
  
        // Display limited number of news items depending on device (mobile or desktop)
        const limitedNews = isMobile ? newsWithImages.slice(0, 3) : newsWithImages.slice(0, 8);
  
        setNews(limitedNews);  // Assuming you're storing the fetched news in state
  
        if (limitedNews.length === 0) {
          console.warn('No news items with images found');
        }
      } else {
        console.error('Unexpected API response structure:', response.data);
        setNews([]);  // Clear the news if no valid data
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews([]);  // Handle the error by setting empty news
    }
  };
  
  const formatDate = (dateString) => {
    return dayjs(dateString).tz('Asia/Kolkata').format('MMMM D, YYYY h:mm A');
  };
  

  const todayAttendance = attendanceRecords.filter(record => dayjs(record.startDate).isSame(currentTime, 'day'));

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


      {/* <Box sx={{ height: '300px', width: '100%', mb: 4 }}>
        <AvatarScene />
      </Box> */}

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
        <Card sx={{ margin: '20px', maxWidth: isMobile ? '100%' : '50%' }}>
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


{todayAttendance.length > 0 ? (
        <Card sx={{ margin: '20px', maxWidth: isMobile ? '100%' : '50%' }}>
          <CardContent>
            <Typography variant="h5">Today's Attendance</Typography>
            <Typography variant="body1"><strong>Name:</strong> {todayAttendance[0].name}</Typography>
            <Typography variant="body1"><strong>Attendance Status:</strong> {todayAttendance[0].attendanceStatus}</Typography>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="body1" sx={{ marginTop: '20px', color: 'red' }}>
          You have not marked today's attendance. <Link to="/attendance-report">Mark Attendance</Link>
        </Typography>
      )}



<Grid item xs={12} md={4} mt={6} mb={4}>
      <ThoughtCard 
  bgcolor={thoughts[currentThoughtIndex].bg} 
  textcolor={thoughts[currentThoughtIndex].text}
>
  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginBottom: 2 }}>
    Thought of the Day
  </Typography>
  <Typography variant="h6" sx={{ mb: 2,  lineHeight: 1.4 }}>
    "{thoughts[currentThoughtIndex].quote}"
  </Typography>
  {thoughts[currentThoughtIndex].meaning && (
    <Typography variant="body1" sx={{ mb: 2, fontStyle: 'normal', lineHeight: 1.4 }}>
      {thoughts[currentThoughtIndex].meaning}
    </Typography>
  )}
  <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
    - {thoughts[currentThoughtIndex].author}
  </Typography>
</ThoughtCard>
        </Grid>

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
      <Box sx={{
        width: '100%',
        overflowX: 'auto',
        '& .MuiStaticDatePicker-table': {
          width: '100%',
          tableLayout: 'fixed',
          borderCollapse: 'collapse',
          marginLeft: '-50px', // Shift the table to the left
          paddingLeft: 0, // Remove padding from the left side
          transform: 'scale(1.5)',
        },
        '& .MuiStaticDatePicker-table th, .MuiStaticDatePicker-table td': {
          whiteSpace: 'nowrap',
          // overflow: 'hidden',
          textOverflow: 'ellipsis',
          padding: '0 4px',
          minWidth: '40px', // Set a minimum width for the columns
        },
        '& .MuiStaticDatePicker-table th:first-child, .MuiStaticDatePicker-table td:first-child': {
          paddingLeft: 0,
        },
        '& .MuiStaticDatePicker-table th:last-child, .MuiStaticDatePicker-table td:last-child': {
          paddingRight: 0,
        },
        '& .MuiStaticDatePicker-table th:nth-child(7), .MuiStaticDatePicker-table td:nth-child(7)': {
          display: 'table-cell',
        },
        '& .MuiStaticDatePicker-table th:nth-child(8), .MuiStaticDatePicker-table td:nth-child(8)': {
          display: 'table-cell',
        },
      }}>
        <StaticDatePicker
          displayStaticWrapperAs="desktop"
          openTo="day"
          value={dayjs(currentTime)}
          onChange={() => {}}
          renderInput={(params) => <TextField {...params} />}
        />
      </Box>
    </LocalizationProvider>
  </StyledPaper>
</Grid>
         {/* Tech News */}
      <Grid item xs={12} md={12}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Latest Tech News
        </Typography>
        <Grid container spacing={3}>
          {news.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <NewsCard>
                <NewsCardMedia
                  component="img"
                  image={item.image}
                  alt={item.title}
                />
                <NewsCardContent>
                  <Typography variant="subtitle1" component="h2" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {item.description}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" paragraph>
                    Published: {formatDate(item.published_at)}
                  </Typography>
                  <Link href={item.url} target="_blank" rel="noopener noreferrer">
                    Read more
                  </Link>
                </NewsCardContent>
              </NewsCard>
            </Grid>
          ))}
        </Grid>
      </Grid>

       
      </Grid>
      
        <Footer>
        <Box className="footer-text-container">
      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
        Crafted with <Heart className="heart-icon" /> by
        <a href="https://www.driftdevelopers.com/" target="_blank" rel="noopener noreferrer" className="footer-link">
          Drift Developers
        </a>
        , Chandigarh
      </Typography>
    </Box>
</Footer>
    </Box>
  );
};

export default WelcomePage;
