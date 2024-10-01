import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { TextField, Button, Typography, Box, ToggleButton, ToggleButtonGroup , Snackbar , Alert} from "@mui/material";

const Login = () => {
  // const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('user');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  const handleLoginTypeChange = (event, newLoginType) => {
    if (newLoginType !== null) {
      setLoginType(newLoginType);
    }
  };

  const submitHandler = async (data) => {
    const { email, password } = data;
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(u => u.user_email === email && u.password === password);

    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      setSnackbar({ open: true, message: 'Login successful!', severity: 'success' });
      navigate('/landingpage')
      window.location.reload();
      
      setTimeout(() => {
        if (loginType === 'admin') {
          navigate("/admin-dashboard");
        } else {
          navigate("/landingpage");
        }
      }, 1500);
    } else {
      setSnackbar({ open: true, message: 'Invalid email or password', severity: 'error' });
    }
  };


  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]'>
      <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
        {/* left side */}
        <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
          <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
          <span className='flex flex-wrap gap-1 py-1 px-3 border rounded-full text-sm md:text-base border-gray-300 text-gray-600 mt-16 md:mt-0'>
  <span className='text-blue-700 font-bold'>
    GeniePro
  </span>
  <span className='text-gray-600'>
    - Manage all your Work in one place!
  </span>
</span>


 
            <p className='flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700'>
              <span>Cloud-Based</span>
              <span>Work Manager</span>
            </p>

            <div className='cell'>
              <div className='circle rotate-in-up-left'></div>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center'>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className='form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14'
          >
            <div className=''>
              <Typography variant="h4" color="primary" align="center">
                Welcome back!
              </Typography>
              <Typography variant="body1" color="textSecondary" align="center">
                Keep all your credentials safe.
              </Typography>
            </div>

            <ToggleButtonGroup
              color="primary"
              value={loginType}
              exclusive
              onChange={handleLoginTypeChange}
              aria-label="Login Type"
              fullWidth
            >
              <ToggleButton value="user">User</ToggleButton>
              <ToggleButton value="admin">Admin</ToggleButton>
            </ToggleButtonGroup>

            <div className='flex flex-col gap-y-5'>
              <TextField
                placeholder='email@example.com'
                type='email'
                label='Email Address'
                variant='outlined'
                fullWidth
                {...register("email", {
                  required: "Email Address is required!",
                })}
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
              />
              <TextField
                placeholder='your password'
                type='password'
                label='Password'
                variant='outlined'
                fullWidth
                {...register("password", {
                  required: "Password is required!",
                })}
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ""}
              />

              <Typography
                variant="body2"
                color="textSecondary"
                align="center"
                className='hover:text-blue-600 hover:underline cursor-pointer'
              >
                Forget Password?
              </Typography>

              <Button
                type='submit'
                variant='contained'
                color='primary'
                fullWidth
                style={{ height: 40 }}
              >
                {loginType === 'admin' ? 'Admin Login' : 'User Login'}
              </Button>

              <Typography variant="body2" color="textSecondary" align="center">
  Don't have an account?{' '}
  <span
    onClick={() => navigate('/register')}
    style={{ cursor: 'pointer', color: '#1976d2', textDecoration: 'underline' }}
  >
    Register here
  </span>
</Typography>

            </div>
          </form>


          <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
        </div>
      </div>
    </div>
  );
};

export default Login;






































































































// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { TextField, Button, Typography, Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
// import { getAuth, sendSignInLinkToEmail, signInWithEmailLink, isSignInWithEmailLink } from "./../config/firebase";

// const Login = () => {
//   const { user } = useSelector((state) => state.auth);
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const navigate = useNavigate();
//   const [loginType, setLoginType] = useState('user');
//   const [isVerified, setIsVerified] = useState(false);

//   const auth = getAuth();
//   const actionCodeSettings = {
//     url: 'http://localhost:3001/verify-email',
//     handleCodeInApp: true,
//   };

//   const handleLoginTypeChange = (event, newLoginType) => {
//     if (newLoginType !== null) {
//       setLoginType(newLoginType);
//     }
//   };

//   const submitHandler = async (data) => {
//     const { email } = data;
//     if (!isVerified) {
//       try {
//         await sendSignInLinkToEmail(auth, email, actionCodeSettings);
//         window.localStorage.setItem('emailForSignIn', email);
//         alert("Verification link sent to your email. Please verify to proceed.");
//       } catch (error) {
//         console.error("Error sending verification email", error);
//       }
//     } else {
//       // handle login after verification
//       console.log("Email verified, logging in:", { ...data, loginType });
//       if (loginType === 'admin') {
//         navigate("/admin-dashboard");
//       } else {
//         navigate("/user-dashboard");
//       }
//     }
//   };

//   // Check if it's a sign-in email link (after clicking in the email)
//   const checkForEmailLink = () => {
//     if (isSignInWithEmailLink(auth, window.location.href)) {
//       let email = window.localStorage.getItem('emailForSignIn');
//       if (!email) {
//         // Ask the user for their email if not stored
//         email = window.prompt('Please provide your email for confirmation');
//       }
//       signInWithEmailLink(auth, email, window.location.href)
//         .then((result) => {
//           // Email is verified
//           setIsVerified(true);
//           alert("Email verified successfully! You can now log in.");
//         })
//         .catch((error) => {
//           console.error("Error verifying email", error);
//         });
//     }
//   };

//   React.useEffect(() => {
//     checkForEmailLink();
//   }, []);

//   return (
//     <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]'>
//       <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
//         <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
//           <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
//             <span className='flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base border-gray-300 text-gray-600'>
//               <span className='text-blue-700 font-bold'>
//                 GeniePro
//               </span>
//               <span className='text-gray-600'>
//                 - Manage all your Work in one place!
//               </span>
//             </span>

//             <p className='flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700'>
//               <span>Cloud-Based</span>
//               <span>Work Manager</span>
//             </p>
//           </div>
//         </div>

//         <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center'>
//           <form
//             onSubmit={handleSubmit(submitHandler)}
//             className='form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14'
//           >
//             <div className=''>
//               <Typography variant="h4" color="primary" align="center">
//                 Welcome back!
//               </Typography>
//               <Typography variant="body1" color="textSecondary" align="center">
//                 Keep all your credentials safe.
//               </Typography>
//             </div>

//             <ToggleButtonGroup
//               color="primary"
//               value={loginType}
//               exclusive
//               onChange={handleLoginTypeChange}
//               aria-label="Login Type"
//               fullWidth
//             >
//               <ToggleButton value="user">User</ToggleButton>
//               <ToggleButton value="admin">Admin</ToggleButton>
//             </ToggleButtonGroup>

//             <div className='flex flex-col gap-y-5'>
//               <TextField
//                 placeholder='email@example.com'
//                 type='email'
//                 label='Email Address'
//                 variant='outlined'
//                 fullWidth
//                 {...register("email", {
//                   required: "Email Address is required!",
//                 })}
//                 error={!!errors.email}
//                 helperText={errors.email ? errors.email.message : ""}
//               />
//               <TextField
//                 placeholder='your password'
//                 type='password'
//                 label='Password'
//                 variant='outlined'
//                 fullWidth
//                 {...register("password", {
//                   required: "Password is required!",
//                 })}
//                 error={!!errors.password}
//                 helperText={errors.password ? errors.password.message : ""}
//               />

//               <Typography
//                 variant="body2"
//                 color="textSecondary"
//                 align="center"
//                 className='hover:text-blue-600 hover:underline cursor-pointer'
//               >
//                 Forget Password?
//               </Typography>

//               <Button
//                 type='submit'
//                 variant='contained'
//                 color='primary'
//                 fullWidth
//                 style={{ height: 40 }}
//                 disabled={!isVerified}  // Disable button until email is verified
//               >
//                 {loginType === 'admin' ? 'Admin Login' : 'User Login'}
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
