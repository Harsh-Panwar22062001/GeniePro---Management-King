import React from 'react';
import { Box, Typography, Card, CardContent, CardActions, Button, IconButton, Divider, TextField } from '@mui/material';
import { MdRestore, MdDeleteForever } from 'react-icons/md';
import { useTasks } from './../components/statemanagement/TaskContext'; // Adjust import based on your actual path

const Trashed = () => {
  const { tasks, restoreTask, deleteTask } = useTasks(); // Assuming you have these methods in your context

  const handleRestore = (task) => {
    restoreTask(task); // Restore task functionality
  };

  const handleDeleteForever = (task) => {
    deleteTask(task); // Delete task permanently functionality
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', mx: 'auto' , mt:'3rem' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Trashed Items
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search trashed items"
        sx={{ mb: 2 }}
      />

      {tasks.length === 0 ? (
        <Typography variant="h6" color="textSecondary">
          No trashed items.
        </Typography>
      ) : (
        tasks.map((task) => (
          <Card key={task.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{task.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                {task.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                color="primary"
                onClick={() => handleRestore(task)}
                startIcon={<MdRestore />}
              >
                Restore
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => handleDeleteForever(task)}
                startIcon={<MdDeleteForever />}
              >
                Delete Forever
              </Button>
            </CardActions>
          </Card>
        ))
      )}
    </Box>
  );
};

export default Trashed;
