import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  InputBase,
  useMediaQuery,
  Badge,
  Avatar,
  Tooltip,
  Button,
  Divider,
} from "@mui/material";
import { styled, useTheme, alpha } from "@mui/material/styles";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HomeIcon from "@mui/icons-material/Home"; // Import HomeIcon
import { useSelector, useDispatch } from "react-redux";
import { setOpenSidebar } from "../redux/slices/authSlice"; // Ensure this path is correct
import { useNavigate } from "react-router-dom"; // For navigation
import AddTaskIcon from '../../public/Images/coordinator.png';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.1)",
  minHeight: 70,
  zIndex: theme.zIndex.drawer + 1,
  position: "fixed",
  width: useMediaQuery(theme.breakpoints.down('sm')) ? "100%" : `calc(100% - 330px)`,
  marginLeft: useMediaQuery(theme.breakpoints.down('sm')) ? 0 : 260,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
  },
}));

const Header = ({ toggleSidebar }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const { user, userData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSidebarOpen = useSelector((state) => state.auth.openSidebar);
  const [userDataState, setUserData] = useState({}); 


  useEffect(() => {
    const storedUserData = localStorage.getItem('loggedInUser');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleSettingMenu = () => {
    navigate("/settings");
    handleMenuClose();
  }

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchorEl(null);
  };

  const handleSidebarToggle = () => {
    dispatch(setOpenSidebar(!isSidebarOpen));
    if (toggleSidebar) toggleSidebar();
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    handleMenuClose();
    navigate("/login");
  };

  const handleHomeClick = () => {
    navigate("/landingpage");
  };

  const handleProfileClick = () => {
    navigate("/profile");
    handleMenuClose();
  };

  const isMenuOpen = Boolean(anchorEl);
  const isNotificationMenuOpen = Boolean(notificationAnchorEl);

  return (
    <StyledAppBar>
      <Toolbar sx={{ minHeight: 70, justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isMobile ? (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleSidebarToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            isSidebarOpen && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="close sidebar"
                onClick={handleSidebarToggle}
                sx={{ mr: 2 }}
              >
                <CloseIcon />
              </IconButton>
            )
          )}
        </Box>

        <Search   sx={{ display: 'flex', alignItems: 'center' }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search tasks..."
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>

        {isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '68px' }}>
            <img 
              src={AddTaskIcon} 
              alt="Add Task Icon" 
              style={{ width: '24px', height: '24px', color: "#2196F3" }} 
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontSize: "20px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              GeniePro
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="home"
            onClick={handleHomeClick}
            sx={{ mr: 1 }}
          >
            <HomeIcon />
          </IconButton>

          {!isMobile && (
            <>
              <Tooltip title="Notifications">
                <IconButton color="inherit" onClick={handleNotificationMenuOpen} sx={{ mr: 1 }}>
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title="Help">
                <IconButton color="inherit" sx={{ mr: 1 }}>
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>
            </>
          )}

<Tooltip title="Profile">
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleProfileMenuOpen}
        >
          {userDataState && userDataState.user_fname ? ( // Check if userDataState exists
            <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
              {userDataState.user_fname.charAt(0).toUpperCase()}
            </Avatar>
          ) : (
            <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
              U
            </Avatar>
          )}
        </IconButton>
      </Tooltip>


        </Box>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
         <MenuItem onClick={() => navigate("/profileinfo")}>Profile</MenuItem>
          <MenuItem onClick={handleMenuClose}>My Tasks</MenuItem>
          <MenuItem onClick={handleSettingMenu}>Settings</MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>

        <Menu
          anchorEl={notificationAnchorEl}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={isNotificationMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>New task assigned</MenuItem>
          <MenuItem onClick={handleMenuClose}>Task deadline approaching</MenuItem>
          <MenuItem onClick={handleMenuClose}>Team meeting reminder</MenuItem>
          <Divider />
          <MenuItem onClick={handleMenuClose}>
            <Typography variant="body2" color="text.secondary">
              See all notifications
            </Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
