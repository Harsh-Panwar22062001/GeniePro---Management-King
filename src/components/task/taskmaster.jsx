import React, { useState, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Button,
  Grid,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  styled,
  useTheme,
  TextField,
} from "@mui/material";
import {
  Search as SearchIcon,
  AddCircleOutline as AddIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Flag as FlagIcon,
  Star as StarIcon,
  Comment as CommentIcon,
  Download as DownloadIcon, 
} from "@mui/icons-material";
import { useTasks } from "../../components/statemanagement/TaskContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import html2canvas from "html2canvas"; 

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
  "&:hover": {
    boxShadow: "0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
    transform: "translateY(-5px)",
  },
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
  color: theme.palette.common.white,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: theme.palette.primary.light,
    },
    "&:hover fieldset": {
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.dark,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
  border: 0,
  borderRadius: 3,
  boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
  color: "white",
  height: 48,
  padding: "0 30px",
  transition: "all 0.3s",
  "&:hover": {
    background: "linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)",
    boxShadow: "0 6px 10px 4px rgba(33, 203, 243, .3)",
  },
}));

const TaskMaster = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { tasks } = useTasks();
  const theme = useTheme();

  const cardRef = useRef(null); // Ref to the card for screenshot capture

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return theme.palette.warning.main;
      case "in progress":
        return theme.palette.info.main;
      case "completed":
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const handleDownload = async (taskId) => {
    const taskCard = document.getElementById(`task-${taskId}`);
    if (taskCard) {
      const canvas = await html2canvas(taskCard);
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `task-${taskId}.png`;
      link.click();
    }
  };

  return (
    <Box
      p={4}
      sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh", marginTop: "30px" }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <StyledTextField
          variant="outlined"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: "action.active", mr: 1 }} />
            ),
          }}
          sx={{
            flex: 1,
            maxWidth: "1200px",
            backgroundColor: "white",
            borderRadius: "4px",
            
                 margin:"6px"
          }}
        />
        <StyledButton
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/add-task"
        >
          Add Task
        </StyledButton>
      </Box>
      <Grid container spacing={3}>
        {tasks
          .filter((task) =>
            task.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StyledCard id={`task-${task.id}`} ref={cardRef}>
                  <StyledCardHeader
                    title={task.name}
                    titleTypographyProps={{ variant: "h6" }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <EventIcon
                        fontSize="small"
                        color="action"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2">
                        {new Date(task.endDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <PersonIcon
                        fontSize="small"
                        color="action"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2">{task.assignedTo}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <CommentIcon
                        fontSize="small"
                        color="action"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2" noWrap>
                        {task.latestRemark || "No remarks"}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mt={2}>
                      <Chip
                        icon={<FlagIcon />}
                        label={task.priority}
                        size="small"
                        color={
                          task.priority.toLowerCase() === "high"
                            ? "error"
                            : task.priority.toLowerCase() === "medium"
                            ? "warning"
                            : "success"
                        }
                      />
                      <Chip
                        icon={<StarIcon />}
                        label={`${task.points} pts`}
                        size="small"
                        color="primary"
                      />
                      <Chip
                        label={task.status}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(task.status),
                          color: "white",
                        }}
                      />
                    </Box>
                    {task.imageUrls && task.imageUrls.length > 0 && (
                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        {task.imageUrls.map((url, index) => (
                          <Box
                            key={index}
                            sx={{
                              width: 100,
                              height: 100,
                              overflow: "hidden",
                              borderRadius: 1,
                            }}
                          >
                            <img
                              src={url}
                              alt={`Task Image ${index}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                    <Tooltip title="Download Screenshot">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleDownload(task.id)}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                    {/* <Tooltip title="Update Task">
                      <IconButton component={Link} to={`/update-task/${task.id}`} color="primary" size="small">
                        <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                          <PersonIcon />
                        </Avatar>
                      </IconButton>
                    </Tooltip> */}
                  </CardActions>
                </StyledCard>
              </motion.div>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default TaskMaster;
