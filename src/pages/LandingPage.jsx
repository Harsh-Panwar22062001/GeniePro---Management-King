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
import { useTasks } from '../components/statemanagement/TaskContext';



const LandingPage = () => {
  const { latestTask } = useTasks();}

// Array of thoughts to rotate through
const thoughts = [
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    bg: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)",
    text: "#ffffff"
  },
  {
    quote: "जीवन की सबसे बड़ी खोज यह है कि आप कौन हैं और आप क्या बनना चाहते हैं।",
    author: "महात्मा गांधी",
    bg: "linear-gradient(135deg, #FCCF31 0%, #F55555 100%)",
    text: "#ffffff"
  },
  {
    quote: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    author: "भगवद् गीता 2.47",
    meaning: "अर्थ: कर्म करने का अधिकार तुम्हारा है, लेकिन उसके फल में कभी नहीं। कर्म के फल के लिए कभी काम मत करो, और न ही कर्म न करने में तुम्हारी आसक्ति हो।",
    bg: "linear-gradient(135deg, #13547A 0%, #80D0C7 100%)",
    text: "#ffffff"
  },
  {
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    bg: "linear-gradient(135deg, #FF61D2 0%, #FE9090 100%)",
    text: "#ffffff"
  },
  {
    quote: "सफलता की कुंजी यह है कि अपने सपनों को किसी और के डर से बड़ा बना दो।",
    author: "अज्ञात",
    bg: "linear-gradient(135deg, #C2E59C 0%, #64B3F4 100%)",
    text: "#1a1a1a"
  },
  {
    quote: "योगस्थ: कुरु कर्माणि सङ्गं त्यक्त्वा धनंजय।\nसिद्ध्यसिद्ध्यो: समो भूत्वा समत्वं योग उच्यते॥",
    author: "भगवद् गीता 2.48",
    meaning: "अर्थ: हे धनंजय, योग में स्थित होकर, आसक्ति को त्यागकर और सफलता और असफलता में समान भाव रखते हुए अपने कर्तव्यों का पालन करो। इस समत्व को योग कहा जाता है।",
    bg: "linear-gradient(135deg, #00DBDE 0%, #FC00FF 100%)",
    text: "#ffffff"
  },
  {
    quote: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt",
    bg: "linear-gradient(135deg, #F09819 0%, #EDDE5D 100%)",
    text: "#1a1a1a"
  },
  {
    quote: "जीवन एक यात्रा है, जिसे हमें हर पल जीना चाहिए और हर क्षण का आनंद लेना चाहिए।",
    author: "अज्ञात",
    bg: "linear-gradient(135deg, #F761A1 0%, #8C1BAB 100%)",
    text: "#ffffff"
  },
  {
    quote: "युक्त: कर्मफलं त्यक्त्वा शान्तिमाप्नोति नैष्ठिकीम्।\nअयुक्त: कामकारेण फले सक्तो निबध्यते॥",
    author: "भगवद् गीता 5.12",
    meaning: "अर्थ: जो व्यक्ति कर्मों के फल को त्याग देता है, वह शांति प्राप्त करता है। जो व्यक्ति कामना से प्रेरित होकर फल में आसक्त होता है, वह बंधन में पड़ जाता है।",
    bg: "linear-gradient(135deg, #43CBFF 0%, #9708CC 100%)",
    text: "#ffffff"
  },
  {
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    bg: "linear-gradient(135deg, #5EFCE8 0%, #736EFE 100%)",
    text: "#1a1a1a"
  },
  {
    quote: "हर दिन एक नई शुरुआत है, अपने सपनों को साकार करने का एक नया मौका।",
    author: "अज्ञात",
    bg: "linear-gradient(135deg, #FFF720 0%, #3CD500 100%)",
    text: "#1a1a1a"
  },
  {
    quote: "श्रेयान्स्वधर्मो विगुण: परधर्मात्स्वनुष्ठितात्।\nस्वधर्मे निधनं श्रेय: परधर्मो भयावह:॥",
    author: "भगवद् गीता 3.35",
    meaning: "अर्थ: अपना धर्म, चाहे वह गुणहीन हो, दूसरे के अच्छी तरह से किए गए धर्म से श्रेष्ठ है। अपने धर्म में मरना भी कल्याणकारी है; दूसरे का धर्म भयावह होता है।",
    bg: "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)",
    text: "#ffffff"
  }
];
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

  height: '100%', // Ensures the card takes full height of the grid item
  minHeight: '370px', // Set a minimum height for the card
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
}));

const NewsCardMedia = styled(CardMedia)({
  height: 140,
});

const ThoughtCard = styled(Card)(({ theme, bgcolor, textcolor }) => ({
  position: 'relative',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: theme.shadows[4],
  padding: theme.spacing(3),
  textAlign: 'center',
  color: textcolor, // Use the text color from the thoughts array
  background: bgcolor, // Use the background from the thoughts array
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
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  flexWrap: 'wrap',
  '& .heart-icon': {
    fontSize: '16px',
    color: '#FF69B4',
    margin: '0 4px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem', // Set a larger font size for mobile screens
    }
  },
  
  '& .footer-text-container': {
    [theme.breakpoints.down('sm')]: {
      width: '100%', // Set a fixed width for mobile screens
      whiteSpace: 'nowrap', // Prevent text from wrapping to the next line
     // Hide any overflowing text
      fontSize: '1rem',
      maxWidth:'100%',
      textOverflow: 'ellipsis', // Add an ellipsis to indicate truncated text
    },
    
  },
  '& .footer-link': {
    fontSize: '1rem',
    fontWeight: 400,
    color: '#333',
    margin: '0 4px',
    textDecoration: 'none',
    transition: 'color 0.3s ease-in-out',
    '&:hover': {
      color: '#2196F3',
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
  const [news, setNews] = useState([]);
  const [currentThoughtIndex, setCurrentThoughtIndex] = useState(0);
  const [bgColor, setBgColor] = useState('');
  const [textColor, setTextColor] = useState('');
  const { latestTask } = useTasks();


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
    try {
      const response = await axios.get('https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=874bf0eeb9834ef68e013438bd204a16');
      setNews(response.data.articles.slice(0, 8));
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

       
      </Grid>
      <Grid item xs={12} md={4} mt={6}>
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
        <Footer>
  <Box className="footer-text-container">
    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Crafted with <Heart className="heart-icon" size={16} /> by{' '}
      <a href="https://www.driftdevelopers.com/" target="_blank" rel="noopener noreferrer" className="footer-link">
        Drift Developers
      </a>{' '}
      ,
      <span className="footer-text">Chandigarh</span>
    </Typography>
  </Box>
</Footer>
    </Box>
  );
};

export default WelcomePage;
