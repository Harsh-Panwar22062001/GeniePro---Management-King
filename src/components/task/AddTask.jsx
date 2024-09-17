import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  styled,
  IconButton,
  Alert,
  AlertTitle,
} from "@mui/material";
import { useTasks } from '../../components/statemanagement/TaskContext';
import { motion, AnimatePresence } from "framer-motion";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { AddCircleOutline, DateRange, AssignmentInd, Flag, Star, Description, Image, Cancel } from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'linear-gradient(145deg, #f0f4ff 0%, #e8eeff 100%)',
  borderRadius: theme.spacing(2),
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
  },
}));

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
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  transition: 'all 0.3s',
  '&:hover': {
    background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
    boxShadow: '0 5px 8px 2px rgba(33, 203, 243, .5)',
  },
}));

const ImageUploadButton = styled(Button)(({ theme }) => ({
  background: '#ff5722',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 87, 34, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  transition: 'all 0.3s',
  '&:hover': {
    background: '#e64a19',
    boxShadow: '0 5px 8px 2px rgba(255, 87, 34, .5)',
  },
}));

const ImagePreviewContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

const ImagePreview = styled('div')(({ theme }) => ({
  position: 'relative',
  width: 100,
  height: 100,
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: theme.shape.borderRadius,
  },
}));

const RemoveImageButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: -10,
  right: -10,
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.error.light,
  },
}));

const CustomSelect = styled(Select)(({ theme }) => ({
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

const AddTask = () => {
  const { addTask } = useTasks();
  const [taskName, setTaskName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("");
  const [points, setPoints] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);

  // Error states
  const [errors, setErrors] = useState({
    taskName: "",
    projectName: "",
    createdDate: "",
    endDate: "",
    assignedTo: "",
    priority: "",
    points: "",
    description: "",
  });

  const projectOptions = ["Project 1", "Project 2", "Project 3"];
  const assignedToOptions = ["SAHIL", "SHIVANGI", "HARSH", "RIYA"];
  const priorityOptions = ["High", "Medium", "Low"];

  const validate = () => {
    let isValid = true;
    let errors = {};

    if (!taskName) {
      errors.taskName = "Task Name is required.";
      isValid = false;
    }
    if (!projectName) {
      errors.projectName = "Project Name is required.";
      isValid = false;
    }
    if (!createdDate) {
      errors.createdDate = "Created Date is required.";
      isValid = false;
    }
    if (!endDate) {
      errors.endDate = "End Date is required.";
      isValid = false;
    }
    if (!assignedTo) {
      errors.assignedTo = "Assigned To is required.";
      isValid = false;
    }
    if (!priority) {
      errors.priority = "Priority is required.";
      isValid = false;
    }
    // if (!points) {
    //   errors.points = "Points are required.";
    //   isValid = false;
    // } 
     if (isNaN(points)) {
      errors.points = "Points must be a number.";
      isValid = false;
    }
    if (!description) {
      errors.description = "Description is required.";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const newTask = {
      name: taskName,
      projectName,
      createdDate,
      endDate,
      assignedTo,
      priority,
      points,
      description,
      imageUrls: images.map((img) => URL.createObjectURL(img.file)),
      status: "Pending",
      latestRemark: "",
      latestClientRemark: "",
    };
    addTask(newTask);

    setTaskName("");
    setProjectName("");
    setCreatedDate("");
    setEndDate("");
    setAssignedTo("");
    setPriority("");
    setPoints("");
    setDescription("");
    setImages([]);

    setAlertVisible(true);

    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '80px', marginBottom: '80px' }}>
      <StyledPaper elevation={10}>
        <Typography variant="h4" align="center" gutterBottom sx={{
          color: '#1976d2',
          fontWeight: 'bold',
          marginBottom: '30px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          <AddCircleOutline sx={{ marginRight: 1, verticalAlign: 'middle' }} />
          Add New Task
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Task Name"
                variant="outlined"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                InputProps={{
                  startAdornment: <AssignmentInd sx={{ color: 'action.active', mr: 1, my: 0.5 }} />,
                }}
                error={Boolean(errors.taskName)}
                helperText={errors.taskName}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Project Name</InputLabel>
                <CustomSelect
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  label="Project Name"
                  error={Boolean(errors.projectName)}
                >
                  {projectOptions.map((project) => (
                    <MenuItem key={project} value={project}>
                      {project}
                    </MenuItem>
                  ))}
                </CustomSelect>
                {errors.projectName && <Typography color="error">{errors.projectName}</Typography>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                type="date"
                variant="outlined"
                value={createdDate}
                onChange={(e) => setCreatedDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <DateRange sx={{ color: 'action.active', mr: 1, my: 0.5 }} />,
                }}
                error={Boolean(errors.createdDate)}
                helperText={errors.createdDate}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                type="date"
                variant="outlined"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <DateRange sx={{ color: 'action.active', mr: 1, my: 0.5 }} />,
                }}
                error={Boolean(errors.endDate)}
                helperText={errors.endDate}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Assigned To</InputLabel>
                <CustomSelect
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  label="Assigned To"
                  error={Boolean(errors.assignedTo)}
                >
                  {assignedToOptions.map((user) => (
                    <MenuItem key={user} value={user}>
                      {user}
                    </MenuItem>
                  ))}
                </CustomSelect>
                {errors.assignedTo && <Typography color="error">{errors.assignedTo}</Typography>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Priority</InputLabel>
                <CustomSelect
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  label="Priority"
                  error={Boolean(errors.priority)}
                >
                  {priorityOptions.map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      {priority}
                    </MenuItem>
                  ))}
                </CustomSelect>
                {errors.priority && <Typography color="error">{errors.priority}</Typography>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <StyledTextField
                fullWidth
                type="number"
                variant="outlined"
                label="Points"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                InputProps={{
                  startAdornment: <Star sx={{ color: 'action.active', mr: 1, my: 0.5 }} />,
                }}
                error={Boolean(errors.points)}
                helperText={errors.points}
              />
            </Grid>

            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                InputProps={{
                  startAdornment: <Description sx={{ color: 'action.active', mr: 1, my: 0.5 }} />,
                }}
                error={Boolean(errors.description)}
                helperText={errors.description}
              />
            </Grid>

            <Grid item xs={12}>
              <ImageUploadButton
                variant="contained"
                component="label"
                startIcon={<Image />}
              >
                Upload Images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => {
                    if (e.target.files) {
                      setImages([...images, ...Array.from(e.target.files)]);
                    }
                  }}
                />
              </ImageUploadButton>

              <ImagePreviewContainer>
                {images.map((file, index) => (
                  <ImagePreview key={index}>
                    <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} />
                    <RemoveImageButton
                      size="small"
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                    >
                      <Cancel fontSize="small" />
                    </RemoveImageButton>
                  </ImagePreview>
                ))}
              </ImagePreviewContainer>
            </Grid>

            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <StyledButton type="submit">Add Task</StyledButton>
            </Grid>
          </Grid>
        </form>

        <AnimatePresence>
              {alertVisible && (
                
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
                
              )}
            </AnimatePresence>
      </StyledPaper>
    </Container>
  );
};

export default AddTask;
