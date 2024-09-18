import React, { useState, Fragment, useRef } from "react";
import { Transition } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom"; 
import { Toaster } from "sonner";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TaskMaster from "./components/task/taskmaster";
import Sidebar from "./components/Sidebar";
import AddTask from "./components/task/AddTask";
import UpdateTask from "./components/task/UpdateTask";
import EditTask from "./components/task/EditTask";
import Header from './pages/header';
import PlannedLeave from "./components/attendance/PlannedLeave";
import UrgentLeaveForm from "./components/attendance/UrgentLeave";
import WfhForm from "./components/attendance/WorkFromHome";
import LeaveMaster from "./components/attendance/LeaveMaster";
import { TaskProvider } from './components/statemanagement/TaskContext';
import { LeaveProvider } from './components/statemanagement/LeaveContext';  // Add this line
import AttendanceReport from "./components/attendance/AttendanceReport";
import AttendanceMaster from "./components/attendance/AttendanceMaster";
import { AttendanceProvider } from "./components/statemanagement/AttendanceContext";
import AddExpense from "./components/expense/AddExpense";
import { ExpenseProvider } from "./components/statemanagement/ExpenseContext";
import ExpenseMaster from "./components/expense/ExpenseMaster";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import WelcomePage from "./pages/LandingPage";
import Trash from "./pages/Trash";
import Register from "./pages/Register";

const theme = createTheme(); 

function App() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar is open by default
  console.log("isSidebarOpen:", isSidebarOpen);
  

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return user ? (
    <div className='w-full h-screen flex flex-col md:flex-row'>
      <Header toggleSidebar={toggleSidebar} />
      {/* Sidebar for Desktop */}
      <div className='w-64 h-screen bg-white sticky top-0 hidden md:block'>
        <Sidebar open={isSidebarOpen} toggleSidebar={toggleSidebar}  onCloseSidebar={closeSidebar} />
      </div>
      {/* Sidebar for Mobile */}
      <MobileSidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar}  setIsSidebarOpen={setIsSidebarOpen}   onCloseSidebar={closeSidebar} />
      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto ${isSidebarOpen ? 'md:pl-52' : 'md:pl-16'}`}>
        <div className='p-4 2xl:px-10'>
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
}

const MobileSidebar = ({ isSidebarOpen, closeSidebar,toggleSidebar, setIsSidebarOpen ,onCloseSidebar }) => {
  return (
    <Transition
      show={isSidebarOpen}
      as={Fragment}
      enter='transition-opacity duration-700'
      enterFrom='opacity-0'
      enterTo='opacity-100'
      leave='transition-opacity duration-700'
      leaveFrom='opacity-100'
      leaveTo='opacity-0'
    >
      <div
        className={`md:hidden w-full h-full bg-black/40 transition-all duration-700 transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={closeSidebar}
      >
        <div className='bg-white w-3/4 h-full'>
          <div className='w-full flex justify-end px-5 mt-5'>
            <button onClick={() => {
              closeSidebar();
              setIsSidebarOpen(false); // Update isSidebarOpen state
            }}>
              <IoClose size={25} />
            </button>
          </div>
          <div className='-mt-10'>
          <Sidebar open={isSidebarOpen} toggleSidebar={toggleSidebar} onCloseSidebar={onCloseSidebar} />
          </div>
        </div>
      </div>
    </Transition>
  );
};

function MainApp() {
  return (
    <ThemeProvider theme={theme}>
      <TaskProvider>
        <LeaveProvider>
          <AttendanceProvider>
            <ExpenseProvider>
            <main className="w-full min-h-screen bg-[#f3f4f6]">
            <Routes>
            <Route path="/" element={<App />}>
            <Route index element={<WelcomePage />} />
                <Route index element={<TaskMaster />} />
                <Route path="/task-master" element={<TaskMaster />} />
                <Route path="/add-task" element={<AddTask />} />
                <Route path="/update-task" element={<UpdateTask />} />
                <Route path="/edit-task" element={<EditTask />} />
                <Route path="/planned-leave" element={<PlannedLeave />} />
                <Route path="/urgent-leave" element={<UrgentLeaveForm />} />
                <Route path="/apply-wfh" element={<WfhForm />} />
                <Route path="/leave-master" element={<LeaveMaster />} />
                <Route path="attendance-report" element={<AttendanceReport/>} />
                <Route path="/attendance-master" element={<AttendanceMaster/>} />
                <Route path="/add-expense" element={<AddExpense/>} />
                <Route path="/expense-master" element={<ExpenseMaster/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/settings" element={<Settings/>} />
                <Route path="trashed" element={<Trash/>} />
                <Route path="landingpage" element={<WelcomePage/>} />


              </Route>
            </Routes>
          </main>

            </ExpenseProvider>

       
          </AttendanceProvider>
          
        </LeaveProvider>
      </TaskProvider>
      <Toaster richColors />
    </ThemeProvider>
  );
}

export default MainApp;
















































































































































































// import React, { useState, Fragment, useRef } from "react";
// import { Transition } from "@headlessui/react";
// import { IoClose } from "react-icons/io5";
// import { useSelector } from "react-redux";
// import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom"; 
// import { Toaster } from "sonner";
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import TaskMaster from "./components/task/taskmaster";
// import Sidebar from "./components/Sidebar";
// import AddTask from "./components/task/AddTask";
// import UpdateTask from "./components/task/UpdateTask";
// import EditTask from "./components/task/EditTask";
// import Header from './pages/header';
// import PlannedLeave from "./components/attendance/PlannedLeave";
// import UrgentLeaveForm from "./components/attendance/UrgentLeave";
// import WfhForm from "./components/attendance/WorkFromHome";
// import LeaveMaster from "./components/attendance/LeaveMaster";
// import { TaskProvider } from './components/statemanagement/TaskContext';
// import { LeaveProvider } from './components/statemanagement/LeaveContext';  // Add this line
// import AttendanceReport from "./components/attendance/AttendanceReport";
// import AttendanceMaster from "./components/attendance/AttendanceMaster";
// import { AttendanceProvider } from "./components/statemanagement/AttendanceContext";
// import AddExpense from "./components/expense/AddExpense";
// import { ExpenseProvider } from "./components/statemanagement/ExpenseContext";
// import ExpenseMaster from "./components/expense/ExpenseMaster";
// import Login from "./pages/Login";
// import Settings from "./pages/Settings";
// import WelcomePage from "./pages/LandingPage";
// import Trash from "./pages/Trash";
// import Register from "./pages/Register";

// const theme = createTheme(); 

// function App() {
//   const { user } = useSelector((state) => state.auth);
//   const location = useLocation();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar is open by default
//   console.log("isSidebarOpen:", isSidebarOpen);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const closeSidebar = () => {
//     setIsSidebarOpen(false);
//   };

//   return user ? (
//     <div className='w-full h-screen flex flex-col md:flex-row'>
//       <Header toggleSidebar={toggleSidebar} />
//       {/* Sidebar for Desktop */}
//       <div className='w-64 h-screen bg-white sticky top-0 hidden md:block'>
//         <Sidebar open={isSidebarOpen} toggleSidebar={toggleSidebar} />
//       </div>
//       {/* Sidebar for Mobile */}
//       <MobileSidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />
//       {/* Main Content */}
//       <div className={`flex-1 overflow-y-auto ${isSidebarOpen ? 'md:pl-52' : 'md:pl-16'}`}>
//         <div className='p-4 2xl:px-10'>
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   ) : (
//     <Navigate to='/login' state={{ from: location }} replace />
//   );
// }

// const MobileSidebar = ({ isSidebarOpen, closeSidebar }) => {
//   return (
//     <Transition
//       show={isSidebarOpen}
//       as={Fragment}
//       enter='transition-opacity duration-700'
//       enterFrom='opacity-0'
//       enterTo='opacity-100'
//       leave='transition-opacity duration-700'
//       leaveFrom='opacity-100'
//       leaveTo='opacity-0'
//     >
//       <div
//         className={`md:hidden w-full h-full bg-black/40 transition-all duration-700 transform ${
//           isSidebarOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//         onClick={closeSidebar}
//       >
//         <div className='bg-white w-3/4 h-full'>
//           <div className='w-full flex justify-end px-5 mt-5'>
//             <button onClick={() => {
//               closeSidebar();
//               setIsSidebarOpen(false); // Update isSidebarOpen state
//             }}>
//               <IoClose size={25} />
//             </button>
//           </div>
//           <div className='-mt-10'>
//             <Sidebar />
//           </div>
//         </div>
//       </div>
//     </Transition>
//   );
// };

// function MainApp() {
//   return (
//     <ThemeProvider theme={theme}>
//       <TaskProvider>
//         <LeaveProvider>
//           <AttendanceProvider>
//             <ExpenseProvider>
//             <main className="w-full min-h-screen bg-[#f3f4f6]">
//             <Routes>
//             <Route path="/" element={<App />}>
//             <Route index element={<WelcomePage />} />
//                 <Route index element={<TaskMaster />} />
//                 <Route path="/task-master" element={<TaskMaster />} />
//                 <Route path="/add-task" element={<AddTask />} />
//                 <Route path="/update-task" element={<UpdateTask />} />
//                 <Route path="/edit-task" element={<EditTask />} />
//                 <Route path="/planned-leave" element={<PlannedLeave />} />
//                 <Route path="/urgent-leave" element={<UrgentLeaveForm />} />
//                 <Route path="/apply-wfh" element={<WfhForm />} />
//                 <Route path="/leave-master" element={<LeaveMaster />} />
//                 <Route path="attendance-report" element={<AttendanceReport/>} />
//                 <Route path="/attendance-master" element={<AttendanceMaster/>} />
//                 <Route path="/add-expense" element={<AddExpense/>} />
//                 <Route path="/expense-master" element={<ExpenseMaster/>} />
//                 <Route path="/login" element={<Login/>} />
//                 <Route path="/register" element={<Register/>} />
//                 <Route path="/settings" element={<Settings/>} />
//                 <Route path="trashed" element={<Trash/>} />
//                 <Route path="landingpage" element={<WelcomePage/>} />


//               </Route>
//             </Routes>
//           </main>

//             </ExpenseProvider>

       
//           </AttendanceProvider>
          
//         </LeaveProvider>
//       </TaskProvider>
//       <Toaster richColors />
//     </ThemeProvider>
//   );
// }

// export default MainApp;
