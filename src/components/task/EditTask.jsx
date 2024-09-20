import React, { useState } from "react";
import { Button, TextField, Typography, Box, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Container, Grid, Paper ,Alert } from "@mui/material";
import { styled } from "@mui/system";
import { keyframes } from "@mui/system";
import { useTasks } from '../../components/statemanagement/TaskContext';
import { AutoAwesome, CalendarToday, Person, Flag, Star } from '@mui/icons-material';
import axios from 'axios';
import moment from 'moment';


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

const SaveButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  animation: `${pulse} 2s infinite`,
}));

const EditTask = () => {
  const { tasks, updateTask } = useTasks();
  const [selectedTask, setSelectedTask] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success"); 

  const handleSelectTask = (event) => {
    const taskId = event.target.value;
    const task = tasks.find(t => t.id === parseInt(taskId));
    setSelectedTask(task);
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

        console.log("Sending data:", JSON.stringify(jsonData, null, 2));
  
        console.log("Sending data to API:", jsonData);
  
        const response = await axios.post('https://workpanel.in/office_app/update_data/edit_task.php', jsonData);

      
  
        console.log("API Response:", response.data);
  
        if (response.data.success === true) {
          updateTask(selectedTask);
          setAlertMessage("Task updated successfully!");
          setAlertSeverity("success");
        } else {
          setAlertMessage(`Failed to Edit task. Server response: ${JSON.stringify(response.data)}`);
          setAlertSeverity("error");
        }
      } catch (error) {
        console.error("Error updating task:", error);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
          console.error("Error response headers:", error.response.headers);
          setAlertMessage(`Server error: ${error.response.data.message || error.response.statusText}`);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Error request:", error.request);
          setAlertMessage("No response received from server. Please try again.");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error message:", error.message);
          setAlertMessage(`An error occurred: ${error.message}`);
        }
        setAlertSeverity("error");
      }
  
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 5000); // Increased to 5 seconds for better visibility
      setSelectedTask(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: '30px' }}>

      <Box py={5}>
       
        
        <StyledPaper elevation={3}>
          <Typography variant="h4" gutterBottom color="secondary">
            Edit Task
          </Typography>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="select-task-label">Select Task</InputLabel>
            <Select
              labelId="select-task-label"
              value={selectedTask ? selectedTask.id : ""}
              onChange={handleSelectTask}
              label="Select Task"
            >
              {tasks.map(task => (
                <MenuItem key={task.id} value={task.id}>{task.name}</MenuItem>
              ))}
            </Select>
          </FormControl>



          {alertVisible && (
            <Alert severity={alertSeverity} sx={{ mb: 2, mt: 2 }}>
              {alertMessage}
            </Alert>
          )}

          {selectedTask && (
            <Box mt={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Task Name"
                    value={selectedTask.name}
                    onChange={handleFieldChange('name')}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="project-name-label">Project Name</InputLabel>
                    <Select
                      labelId="project-name-label"
                      value={selectedTask.projectName}
                      onChange={handleFieldChange('projectName')}
                      label="Project Name"
                    >
                      <MenuItem value="Project A">Project A</MenuItem>
                      <MenuItem value="Project B">Project B</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="assigned-to-label">Assigned To</InputLabel>
                    <Select
                      labelId="assigned-to-label"
                      value={selectedTask.assignedTo}
                      onChange={handleFieldChange('assignedTo')}
                      label="Assigned To"
                    >
                      <MenuItem value="User A">User A</MenuItem>
                      <MenuItem value="User B">User B</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Priority"
                    value={selectedTask.priority}
                    onChange={handleFieldChange('priority')}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Points"
                    value={selectedTask.points}
                    onChange={handleFieldChange('points')}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <SaveButton onClick={handleSubmit} variant="contained" color="primary" size="large" fullWidth>
                Save Changes
              </SaveButton>
            </Box>
          )}
        </StyledPaper>

        <Box mt={5}>
          <Typography variant="h4" gutterBottom color="secondary">
            All Tasks
          </Typography>
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
                      onClick={() => setSelectedTask(task)}
                      sx={{ mt: 2 }}
                    >
                      Edit Task
                    </Button>
                  </CardContent>
                </AnimatedCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default EditTask;
