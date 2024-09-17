import React, { useState } from "react";
import { MdOutlineAddTask, MdTaskAlt, MdSettings, MdExpandMore } from "react-icons/md";
import AddTaskIcon from '../../public/Images/coordinator.png';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Collapse, 
  Typography, 
  IconButton,
  styled
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSidebar } from "../redux/slices/authSlice";

const StyledSidebar = styled(Box)(({ theme }) => ({
  width: 330,
  height: "100vh",
  position: "fixed",
  top: 0,
  left: 0,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  overflowY: "auto",
  zIndex: theme.zIndex.drawer + 2,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(0.5),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  ...(active && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
}));

const linkData = [
  {
    label: "Task Management",
    link: "#",
    icon: <MdOutlineAddTask />,
    subLinks: [
      { label: "Task Master", link: "/task-master" },
      { label: "Add Task", link: "/add-task" },
      { label: "Update Task", link: "/update-task" },
      { label: "Edit Task", link: "/edit-task" },
    ],
  },
  {
    label: "Attendance Management",
    link: "#",
    icon: <MdTaskAlt />,
    subLinks: [

           
      { label: "Attendance Master", link: "/attendance-master" },
      { label: "Attendance-Report", link: "/attendance-report" },
       { label: "Leave Master", link: "/leave-master" },
      { label: "Planned-Leave", link: "/planned-leave" },
      { label: "Apply for Urgent Leave", link: "/urgent-leave" },
      { label: "Apply for WFH", link: "/apply-wfh" },
     
    ],
  },

  {
    label: "Expense Management",
    link: "#",
    icon: <MdTaskAlt />,
    subLinks: [

           
      { label: "Expense  master", link: "/expense-master" },
      { label: "Add expense", link: "/add-expense" },
  
    ],
  },
  {
    label: "Trash",
    link: "/trashed",
    icon: <MdOutlineAddTask />,
  },
];
const Sidebar = ({ open, toggleSidebar,  onCloseSidebar }) => {
  const { user } = useSelector((state) => state.auth);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const dispatch = useDispatch();
  const location = useLocation();

  const path = location.pathname.split("/")[1];
  const sidebarLinks = user?.isAdmin ? linkData : linkData.slice(0, 3);

  const closeSidebar = () => {
    console.log("Close sidebar called");
    dispatch(setOpenSidebar(false));
  };

  const NavLink = ({ el }) => {
    const isActive = path === el.link.split("/")[1];
    const hasSubLinks = el.subLinks && el.subLinks.length > 0;
    const isOpen = openSubMenu === el.label;
  
    const handleLinkClick = () => {
      if (hasSubLinks) {
        setOpenSubMenu(isOpen ? null : el.label);
      } else {
        closeSidebar(); // Close sidebar when a link is clicked
      }
    };
  
    const handleSubLinkClick = () => {
      console.log("handleSubLinkClick called");
      onCloseSidebar(); // Close sidebar when a sublink is clicked
    };

    return (
      <>
        <StyledListItem
          button
          component={Link}
          to={el.link}
          active={isActive ? 1 : 0}
          onClick={handleLinkClick}
        >
          <ListItemIcon>{el.icon}</ListItemIcon>
          <ListItemText primary={el.label} />
          {hasSubLinks && (
            <IconButton
              size="small"
              sx={{
                transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                transition: (theme) =>
                  theme.transitions.create("transform", {
                    duration: theme.transitions.duration.shortest,
                  }),
              }}
            >
              <MdExpandMore />
            </IconButton>
          )}
        </StyledListItem>
        {hasSubLinks && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {el.subLinks.map((subLink) => (
                <StyledListItem
                  key={subLink.label}
                  button
                  component={Link}
                  to={subLink.link}
                  onClick={handleSubLinkClick}
                  active={path === subLink.link.split("/")[1] ? 1 : 0}
                  sx={{ pl: 4 }}
                >
                  <ListItemText primary={subLink.label} />
                </StyledListItem>
              ))}
            </List>
          </Collapse>
        )}
      </>
    );
  };

  return (
    <StyledSidebar>
     <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider", display: "flex", alignItems: "center", gap: 1 }}>
     <img 
      src={AddTaskIcon} 
      alt="Add Task Icon" 
      style={{ width: '24px', height: '24px', color: "#2196F3" }} 
    />
  <Typography
    variant="h6"
    component="div"
    sx={{
      fontSize: "24px",
      fontWeight: 700,
      letterSpacing: "0.5px",
      background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
      fontFamily: "'Poppins', sans-serif",
      display: { xs: 'none', sm: 'block' },
    }}
  >
    GeniePro
  </Typography>
</Box>


      <List sx={{ p: 2 }}>
        {sidebarLinks.map((link) => (
          <NavLink el={link} key={link.label} />
        ))}
      </List>

      <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, p: 2, borderTop: 1, borderColor: "divider" }}>
        <StyledListItem  button component={Link} to="/settings"   onClick={closeSidebar}>
          <ListItemIcon>
            <MdSettings />
          </ListItemIcon>
          <ListItemText primary="Settings"  />
        </StyledListItem>
      </Box>
    </StyledSidebar>
  );
};

export default Sidebar;
























































































































































































// import React, { useState } from "react";
// import { MdOutlineAddTask, MdTaskAlt, MdSettings, MdExpandMore } from "react-icons/md";
// import AddTaskIcon from '../../public/Images/coordinator.png';
// import { 
//   Box, 
//   List, 
//   ListItem, 
//   ListItemIcon, 
//   ListItemText, 
//   Collapse, 
//   Typography, 
//   IconButton,
//   styled
// } from "@mui/material";
// import { Link, useLocation } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { setOpenSidebar } from "../redux/slices/authSlice";

// const StyledSidebar = styled(Box)(({ theme }) => ({
//   width: 330,
//   height: "100vh",
//   position: "fixed",
//   top: 0,
//   left: 0,
//   backgroundColor: theme.palette.background.paper,
//   boxShadow: theme.shadows[3],
//   overflowY: "auto",
//   zIndex: theme.zIndex.drawer + 2,
//   transition: theme.transitions.create(["width", "margin"], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.enteringScreen,
//   }),
// }));

// const StyledListItem = styled(ListItem)(({ theme, active }) => ({
//   borderRadius: theme.shape.borderRadius,
//   marginBottom: theme.spacing(0.5),
//   "&:hover": {
//     backgroundColor: theme.palette.action.hover,
//   },
//   ...(active && {
//     backgroundColor: theme.palette.primary.main,
//     color: theme.palette.primary.contrastText,
//     "&:hover": {
//       backgroundColor: theme.palette.primary.dark,
//     },
//   }),
// }));

// const linkData = [
//   {
//     label: "Task Management",
//     link: "#",
//     icon: <MdOutlineAddTask />,
//     subLinks: [
//       { label: "Task Master", link: "/task-master" },
//       { label: "Add Task", link: "/add-task" },
//       { label: "Update Task", link: "/update-task" },
//       { label: "Edit Task", link: "/edit-task" },
//     ],
//   },
//   {
//     label: "Attendance Management",
//     link: "#",
//     icon: <MdTaskAlt />,
//     subLinks: [

           
//       { label: "Attendance Master", link: "/attendance-master" },
//       { label: "Attendance-Report", link: "/attendance-report" },
//        { label: "Leave Master", link: "/leave-master" },
//       { label: "Planned-Leave", link: "/planned-leave" },
//       { label: "Apply for Urgent Leave", link: "/urgent-leave" },
//       { label: "Apply for WFH", link: "/apply-wfh" },
     
//     ],
//   },

//   {
//     label: "Expense Management",
//     link: "#",
//     icon: <MdTaskAlt />,
//     subLinks: [

           
//       { label: "Expense  master", link: "/expense-master" },
//       { label: "Add expense", link: "/add-expense" },
  
//     ],
//   },
//   {
//     label: "Trash",
//     link: "/trashed",
//     icon: <MdOutlineAddTask />,
//   },
// ];
// const Sidebar = () => {
//   const { user } = useSelector((state) => state.auth);
//   const [openSubMenu, setOpenSubMenu] = useState(null);
//   const dispatch = useDispatch();
//   const location = useLocation();

//   const path = location.pathname.split("/")[1];
//   const sidebarLinks = user?.isAdmin ? linkData : linkData.slice(0, 3);

//   const closeSidebar = () => {
//     console.log("Close sidebar called");
//     dispatch(setOpenSidebar(false));
//   };

//   const NavLink = ({ el }) => {
//     const isActive = path === el.link.split("/")[1];
//     const hasSubLinks = el.subLinks && el.subLinks.length > 0;
//     const isOpen = openSubMenu === el.label;
  
//     return (
//       <>
//         <StyledListItem
//           button
//           component={Link}
//           to={el.link}
//           active={isActive ? 1 : 0}
//           onClick={() => {
//             if (hasSubLinks) {
//               setOpenSubMenu(isOpen ? null : el.label);
//             } else {
//               closeSidebar(); 
//             }
//           }}
//         >
//           <ListItemIcon>{el.icon}</ListItemIcon>
//           <ListItemText primary={el.label} />
//           {hasSubLinks && (
//             <IconButton
//               size="small"
//               sx={{
//                 transform: isOpen ? "rotate(180deg)" : "rotate(0)",
//                 transition: (theme) =>
//                   theme.transitions.create("transform", {
//                     duration: theme.transitions.duration.shortest,
//                   }),
//               }}
//             >
//               <MdExpandMore />
//             </IconButton>
//           )}
//         </StyledListItem>
//         {hasSubLinks && (
//           <Collapse in={isOpen} timeout="auto" unmountOnExit>
//             <List component="div" disablePadding>
//               {el.subLinks.map((subLink) => (
//                 <StyledListItem
//                   key={subLink.label}
//                   button
//                   component={Link}
//                   to={subLink.link}
//                   onClick={() => {
//                     closeSidebar(); // Close sidebar when a sublink is clicked
//                   }}
//                   active={path === subLink.link.split("/")[1] ? 1 : 0}
//                   sx={{ pl: 4 }}
//                 >
//                   <ListItemText primary={subLink.label} />
//                 </StyledListItem>
//               ))}
//             </List>
//           </Collapse>
//         )}
//       </>
//     );
//   };
//   return (
//     <StyledSidebar>
//      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider", display: "flex", alignItems: "center", gap: 1 }}>
//      <img 
//       src={AddTaskIcon} 
//       alt="Add Task Icon" 
//       style={{ width: '24px', height: '24px', color: "#2196F3" }} 
//     />
//   <Typography
//     variant="h6"
//     component="div"
//     sx={{
//       fontSize: "24px",
//       fontWeight: 700,
//       letterSpacing: "0.5px",
//       background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
//       WebkitBackgroundClip: "text",
//       WebkitTextFillColor: "transparent",
//       textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
//       fontFamily: "'Poppins', sans-serif",
//       display: { xs: 'none', sm: 'block' },
//     }}
//   >
//     GeniePro
//   </Typography>
// </Box>


//       <List sx={{ p: 2 }}>
//         {sidebarLinks.map((link) => (
//           <NavLink el={link} key={link.label} />
//         ))}
//       </List>

//       <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, p: 2, borderTop: 1, borderColor: "divider" }}>
//         <StyledListItem  button component={Link} to="/settings"   onClick={closeSidebar}>
//           <ListItemIcon>
//             <MdSettings />
//           </ListItemIcon>
//           <ListItemText primary="Settings"  />
//         </StyledListItem>
//       </Box>
//     </StyledSidebar>
//   );
// };

// export default Sidebar;
