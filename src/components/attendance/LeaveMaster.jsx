import React, { useState } from "react";
import axios from "axios";
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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FaSearch } from "react-icons/fa";
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import { useLeaves } from '../../components/statemanagement/LeaveContext';
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { differenceInDays, format } from "date-fns";

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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

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

  const handleEditClick = (leave) => {

    console.log('Start Date:', leave.startDate);
    console.log('End Date:', leave.endDate);

    const startDate = new Date(leave.startDate);
    const endDate = new Date(leave.endDate);
  
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error("Invalid start or end date");
      return;
    }
  
    setEditingLeave({
      ...leave,
      startDate,
      endDate,
    });
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setEditingLeave(null);
  };

  const handleEditSave = async () => {
    if (!editingLeave) return;

    const formattedStartDate = format(editingLeave.startDate, "dd/MM/yyyy");
    const formattedEndDate = format(editingLeave.endDate, "dd/MM/yyyy");

    const jsonData = {
      header: "edit_leave",
      data: {
        leave_id: editingLeave.id,
        leave_emp_id: editingLeave.empId || "",
        leave_strt_date: formattedStartDate,
        leave_end_date: formattedEndDate,
        leave_no_days: editingLeave.numberOfDays.toString(),
        leave_reason: editingLeave.reason,
        leave_file: editingLeave.leaveFile || "",
        leave_type: editingLeave.leaveType,
      },
    };

    console.log("Sending data:", JSON.stringify(jsonData, null, 2));

    try {
      const response = await axios.post('https://workpanel.in/office_app/update_data/edit_leave.php', jsonData);
      
      console.log("Raw server response:", response.data);

      if (response.data.success) {
        const updatedLeave = {
          ...editingLeave,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        };
        updateLeaveRequest(updatedLeave);
        handleEditClose();
        setSnackbar({ open: true, message: "Leave request updated successfully!", severity: "success" });
      } else {
        console.error("Failed to update leave:", response.data.msg);
        setSnackbar({ open: true, message: "Failed to update leave request. Please try again.", severity: "error" });
      }
    } catch (error) {
      console.error("Error updating leave:", error);
      setSnackbar({ open: true, message: "An error occurred while updating the leave request. Please try again.", severity: "error" });
    }
  };

  const handleEditChange = (field, value) => {
    setEditingLeave((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'startDate' || field === 'endDate') {
        updated.numberOfDays = differenceInDays(updated.endDate, updated.startDate) + 1;
      }
      return updated;
    });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box p={4}>
    <Box display="flex" justifyContent="space-between" mb={4} mt={5} alignItems="center">
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
                action={
                  <IconButton onClick={() => handleEditClick(request)}>
                    <EditIcon />
                  </IconButton>
                }
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

    <Dialog open={editDialogOpen} onClose={handleEditClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Leave Request</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          value={editingLeave?.name || ''}
          onChange={(e) => handleEditChange('name', e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Reason"
          value={editingLeave?.reason || ''}
          onChange={(e) => handleEditChange('reason', e.target.value)}
        />
        <Box mt={2}>
          <Typography variant="subtitle1">Start Date</Typography>
          <DatePicker
            selected={editingLeave?.startDate}
            onChange={(date) => handleEditChange('startDate', date)}
            selectsStart
            startDate={editingLeave?.startDate}
            endDate={editingLeave?.endDate}
            dateFormat="dd/MM/yyyy"
          />
        </Box>
        <Box mt={2}>
          <Typography variant="subtitle1">End Date</Typography>
          <DatePicker
            selected={editingLeave?.endDate}
            onChange={(date) => handleEditChange('endDate', date)}
            selectsEnd
            startDate={editingLeave?.startDate}
            endDate={editingLeave?.endDate}
            minDate={editingLeave?.startDate}
            dateFormat="dd/MM/yyyy"
          />
        </Box>
        <TextField
          fullWidth
          margin="normal"
          label="Number of Days"
          value={editingLeave?.numberOfDays || ''}
          InputProps={{ readOnly: true }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Leave Type"
          value={editingLeave?.leaveType || ''}
          onChange={(e) => handleEditChange('leaveType', e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleEditClose}>Cancel</Button>
        <Button onClick={handleEditSave} variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>

    <Snackbar
  open={snackbar.open}
  autoHideDuration={6000}
  onClose={handleSnackbarClose}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
>
  <Alert
    onClose={handleSnackbarClose}
    severity={snackbar.severity}
    sx={{ width: '100%' }}
  >
    {snackbar.message}
  </Alert>
</Snackbar>
  </Box>
);
};

export default LeaveMaster;
