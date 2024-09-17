import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Avatar,
  Tooltip
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FaSearch } from "react-icons/fa";
import FilterListIcon from '@mui/icons-material/FilterList';
import { useLeaves } from '../../components/statemanagement/LeaveContext';
import { motion, AnimatePresence } from "framer-motion";

const StyledCard = styled(motion(Card))(({ theme, leavetype }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  background: (() => {
    switch (leavetype) {
      case 'Urgent':
        return 'linear-gradient(45deg, #ffcdd2 30%, #ef9a9a 90%)';
      case 'Planned':
        return 'linear-gradient(45deg, #c8e6c9 30%, #a5d6a7 90%)';
      case 'WFH':
        return 'linear-gradient(45deg, #bbdefb 30%, #90caf9 90%)';
      default:
        return 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)';
    }
  })(),
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)',
  },
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.8)',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledChip = styled(Chip)(({ theme, customColor }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 'bold',
  color: theme.palette.getContrastText(customColor),
  backgroundColor: customColor,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
    '&.Mui-focused': {
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
    },
  },
}));

const LeaveMaster = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const { leaveRequests, updateLeaveRequest } = useLeaves();

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    handleFilterClose();
  };

  const filterLeaveRequests = () => {
    return leaveRequests
      .filter((request) => request.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((request) => selectedFilter === 'All' || request.leaveType === selectedFilter);
  };

  const handleApproval = (id, isApproved) => {
    updateLeaveRequest({ id, status: isApproved ? 'Approved' : 'Disapproved' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return '#4caf50';
      case 'Disapproved':
        return '#f44336';
      default:
        return '#ffa726';
    }
  };

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" mb={4} mt = {5} alignItems="center">
        <StyledTextField
          variant="outlined"
          placeholder="Search leave requests..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: <FaSearch style={{ marginRight: 8 }} />,
          }}
          sx={{ flex: 1, maxWidth: "300px" }}
        />
        <Box ml={2}>
          <Tooltip title="Filter leave requests">
            <IconButton onClick={handleFilterClick}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterClose}
          >
            <MenuItem onClick={() => handleFilterSelect('All')}>All</MenuItem>
            <MenuItem onClick={() => handleFilterSelect('Urgent')}>Urgent</MenuItem>
            <MenuItem onClick={() => handleFilterSelect('Planned')}>Planned</MenuItem>
            <MenuItem onClick={() => handleFilterSelect('WFH')}>WFH</MenuItem>
          </Menu>
        </Box>
      </Box>
      <AnimatePresence>
        <Grid container spacing={3}>
          {filterLeaveRequests().map((request) => (
            <Grid item xs={12} sm={6} md={4} key={request.id}>
              <StyledCard
                leavetype={request.leaveType}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StyledCardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {request.name.charAt(0)}
                    </Avatar>
                  }
                  title={<Typography variant="h6">{request.name}</Typography>}
                  subheader={request.leaveType}
                />
                <CardContent>
                  <Typography variant="body2" gutterBottom>
                    <strong>Reason:</strong> {request.reason}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Duration:</strong> {request.numberOfDays} day(s)
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>From:</strong> {request.startDate}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>To:</strong> {request.endDate}
                  </Typography>
                  <Box mt={2}>
                    <StyledChip
                      label={request.status || 'Pending'}
                      customColor={getStatusColor(request.status)}
                    />
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: "center", mt: 'auto' }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleApproval(request.id, true)}
                    disabled={request.status === 'Approved' || request.status === 'Disapproved'}
                  >
                    Approve
                  </Button>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={() => handleApproval(request.id, false)}
                    disabled={request.status === 'Approved' || request.status === 'Disapproved'}
                  >
                    Disapprove
                  </Button>
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </AnimatePresence>
    </Box>
  );
};

export default LeaveMaster;
