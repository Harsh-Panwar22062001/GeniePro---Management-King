import React, { useState } from "react";
import { Button, TextField, Typography, Box, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Container, Grid, Paper, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { styled } from "@mui/system";
import { keyframes } from "@mui/system";
import { useTasks } from '../../components/statemanagement/TaskContext';
import { AutoAwesome, CalendarToday, Person, Flag, Star } from '@mui/icons-material';
import axios from 'axios';
import moment from 'moment';
import { names, projects, prioritySelect } from '../../assets/userdata';

// Define animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.005); }
  100% { transform: scale(1); }
`;

// Styled components
const AnimatedCard = styled(Card)(({ theme }) => ({
  animation: `${fadeIn} 0.5s ease-out`,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius * 2,
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  '& > svg': {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

const EditTask = () => {
  const { tasks, updateTask } = useTasks();
  const [selectedTask, setSelectedTask] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = (task) => {
    setSelectedTask(task);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
  };

  const handleFieldChange = (field) => (event) => {
    setSelectedTask(prevTask => ({
      ...prevTask,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async () => {
    if (selectedTask) {
      try {
        const assignedEmployee = names.find(emp => emp.emp_id === selectedTask.assignedTo);
        const jsonData = {
          header: "app_task_edit",
          data: {
            task_id: selectedTask.id,
            task_emp_id: selectedTask.assignedTo,
            task_name: selectedTask.name,
            task_project_id: selectedTask.projectName,
            task_start_date: moment(selectedTask.createdDate).format('MM/DD/YYYY'),
            task_end_date: moment(selectedTask.endDate).format('MM/DD/YYYY'),
            task_priority: selectedTask.priority,
            task_points: selectedTask.points,
            task_description: selectedTask.description || ""
          }
        };

        const response = await axios.post('https://workpanel.in/office_app/update_data/edit_task.php', jsonData);

        if (response.data.success === true) {
          updateTask({...selectedTask, assignedTo: assignedEmployee.name});
          setAlertMessage("Task updated successfully!");
          setAlertSeverity("success");
          handleCloseDialog();
        } else {
          setAlertMessage(`Failed to Edit task. Server response: ${JSON.stringify(response.data)}`);
          setAlertSeverity("error");
        }
      } catch (error) {
        console.error("Error updating task:", error);
        setAlertMessage(`An error occurred: ${error.message}`);
        setAlertSeverity("error");
      }

      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 5000);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: '30px' }}>
      <Box py={5}>
        <StyledPaper elevation={3}>
          <Typography variant="h4" gutterBottom color="secondary">
            Tasks
          </Typography>

          {alertVisible && (
            <Alert severity={alertSeverity} sx={{ mb: 2, mt: 2 }}>
              {alertMessage}
            </Alert>
          )}

          <Grid container spacing={3}>
            {tasks.map(task => (
              <Grid item xs={12} sm={6} md={4} key={task.id}>
                <AnimatedCard>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">{task.name}</Typography>
                    <IconWrapper>
                      <AutoAwesome fontSize="small" />
                      <Typography variant="body2">Project: {task.projectName}</Typography>
                    </IconWrapper>
                    <IconWrapper>
                      <CalendarToday fontSize="small" />
                      <Typography variant="body2">Created: {task.createdDate}</Typography>
                    </IconWrapper>
                    <IconWrapper>
                      <CalendarToday fontSize="small" />
                      <Typography variant="body2">End: {task.endDate}</Typography>
                    </IconWrapper>
                    <IconWrapper>
                      <Person fontSize="small" />
                      <Typography variant="body2">Assigned: {task.assignedTo}</Typography>
                    </IconWrapper>
                    <IconWrapper>
                      <Flag fontSize="small" />
                      <Typography variant="body2">Priority: {task.priority}</Typography>
                    </IconWrapper>
                    <IconWrapper>
                      <Star fontSize="small" />
                      <Typography variant="body2">Points: {task.points}</Typography>
                    </IconWrapper>
                    <Button
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      onClick={() => handleOpenDialog(task)}
                      sx={{ mt: 2 }}
                    >
                      Edit Task
                    </Button>
                  </CardContent>
                </AnimatedCard>
              </Grid>
            ))}
          </Grid>
        </StyledPaper>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          {selectedTask && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Task Name"
                    value={selectedTask.name}
                    onChange={handleFieldChange('name')}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="assigned-to-label">Assigned To</InputLabel>
                    <Select
                      labelId="assigned-to-label"
                      value={selectedTask.assignedTo}
                      onChange={handleFieldChange('assignedTo')}
                      label="Assigned To"
                    >
                      {names.map(name => (
                        <MenuItem key={name.emp_id} value={name.emp_id}>{name.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Created Date"
                    type="date"
                    value={selectedTask.createdDate}
                    onChange={handleFieldChange('createdDate')}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="End Date"
                    type="date"
                    value={selectedTask.endDate}
                    onChange={handleFieldChange('endDate')}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="priority-label">Priority</InputLabel>
                    <Select
                      labelId="priority-label"
                      value={selectedTask.priority}
                      onChange={handleFieldChange('priority')}
                      label="Priority"
                    >
                      {prioritySelect.map(priority => (
                        <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Points"
                    value={selectedTask.points}
                    onChange={handleFieldChange('points')}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EditTask;