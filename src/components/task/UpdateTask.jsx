import React, { useState } from "react";
import {
  Button, TextField, Typography, Box, Card, CardContent, CardActions, IconButton,
  FormControl, InputLabel, Select, MenuItem, Tooltip, Grid, Chip, Avatar,
  styled, useTheme ,   Alert ,
} from "@mui/material";
import { Edit, Assignment, DateRange, Person, Flag, Star, Update } from "@mui/icons-material";
import { useTasks } from '../../components/statemanagement/TaskContext';
import { motion , AnimatePresence } from 'framer-motion';

const StyledCard = styled(Card)(({ theme }) => ({
  width: 340,
  margin: theme.spacing(1),
  boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)',
  '&:hover': {
    boxShadow: '0 16px 70px -12.125px rgba(0,0,0,0.3)',
  },
  transition: '0.3s',
  borderRadius: theme.spacing(2),
}));

const StyledCardContent = styled(CardContent)({
  padding: '16px 24px',
});

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.dark,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  transition: 'all 0.3s',
  '&:hover': {
    background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
    boxShadow: '0 5px 8px 2px rgba(255, 105, 135, .5)',
  },
}));

const UpdateTask = () => {
  const { tasks, updateTask } = useTasks();
  const [selectedTask, setSelectedTask] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const theme = useTheme();

  const handleEditClick = (task) => {
    setSelectedTask(task);
  };

  const handleStatusChange = (event) => {
    setSelectedTask(prevTask => ({
      ...prevTask,
      status: event.target.value
    }));
  };

  const handleSubmit = () => {
    if (selectedTask) {
      updateTask(selectedTask);
      setSelectedTask(null);
    }

    setAlertVisible(true); // Show alert

    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);

  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return theme.palette.warning.main;
      case 'In Progress': return theme.palette.info.main;
      case 'Completed': return theme.palette.success.main;
      default: return theme.palette.grey[500];
    }
  };

  return (
    <Box p={3} sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom style={{ marginTop: '30px', fontWeight: 'bold', color: theme.palette.primary.main }}>
        Update Task
      </Typography>
      
      <Grid container spacing={3}>
        {tasks.map(task => (
          <Grid item xs={12} sm={6} md={4} key={task.id}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
             
              <StyledCard>
                <StyledCardContent>
                  <Typography variant="h6" gutterBottom>{task.name}</Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Assignment fontSize="small" color="action" />
                    <Typography variant="body2" ml={1}>{task.projectName}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <DateRange fontSize="small" color="action" />
                    <Typography variant="body2" ml={1}>{task.endDate}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="body2" ml={1}>{task.assignedTo}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Chip
                      icon={<Flag fontSize="small" />}
                      label={task.priority}
                      size="small"
                      color={task.priority === 'High' ? 'error' : task.priority === 'Medium' ? 'warning' : 'success'}
                    />
                    <Chip
                      icon={<Star fontSize="small" />}
                      label={`${task.points} pts`}
                      size="small"
                      color="primary"
                    />
                    <Chip
                      label={task.status}
                      size="small"
                      style={{ backgroundColor: getStatusColor(task.status), color: 'white' }}
                    />
                  </Box>
                </StyledCardContent>
                <CardActions>
                  <Tooltip title="Edit Task">
                    <IconButton onClick={() => handleEditClick(task)} color="primary">
                      <Edit />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </StyledCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {selectedTask && (
        <Box mt={5} p={3} sx={{ backgroundColor: 'white', borderRadius: theme.shape.borderRadius, boxShadow: 3 }}>
          <Typography variant="h5" gutterBottom color="primary">Edit Task Details</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                label="Task Name"
                value={selectedTask.name}
                InputProps={{ readOnly: true, startAdornment: <Assignment color="action" sx={{ mr: 1 }} /> }}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                label="Project Name"
                value={selectedTask.projectName}
                InputProps={{ readOnly: true, startAdornment: <Assignment color="action" sx={{ mr: 1 }} /> }}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                label="Created Date"
                value={selectedTask.createdDate}
                InputProps={{ readOnly: true, startAdornment: <DateRange color="action" sx={{ mr: 1 }} /> }}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                label="End Date"
                value={selectedTask.endDate}
                InputProps={{ readOnly: true, startAdornment: <DateRange color="action" sx={{ mr: 1 }} /> }}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                label="Assigned To"
                value={selectedTask.assignedTo}
                InputProps={{ readOnly: true, startAdornment: <Person color="action" sx={{ mr: 1 }} /> }}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                label="Priority"
                value={selectedTask.priority}
                InputProps={{ readOnly: true, startAdornment: <Flag color="action" sx={{ mr: 1 }} /> }}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField
                label="Points"
                value={selectedTask.points}
                InputProps={{ readOnly: true, startAdornment: <Star color="action" sx={{ mr: 1 }} /> }}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="status-label">Task Status</InputLabel>
                <Select
                  labelId="status-label"
                  value={selectedTask.status}
                  onChange={handleStatusChange}
                  startAdornment={<Update color="action" sx={{ mr: 1 }} />}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <StyledButton onClick={handleSubmit} variant="contained" fullWidth>
                Update Task
              </StyledButton>
            </Grid>

            <AnimatePresence>
              {alertVisible && (
                <MotionBox
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <Alert
                    severity="success"
                    icon={<CheckCircleOutlineIcon fontSize="inherit" />}
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => setAlertVisible(false)}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{
                      background: "linear-gradient(45deg, #4caf50 30%, #2196f3 90%)",
                      color: "white",
                      "& .MuiAlert-icon": {
                        color: "white",
                      },
                      "& .MuiIconButton-root": {
                        color: "white",
                      },
                      boxShadow: "0 3px 5px 2px rgba(76, 175, 80, .3)",
                      borderRadius: "8px",
                      marginTop: "16px",
                    }}
                  >
                    
                    Applied Successfully!📧👍
                  </Alert>
                </MotionBox>
              )}
            </AnimatePresence>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default UpdateTask;
