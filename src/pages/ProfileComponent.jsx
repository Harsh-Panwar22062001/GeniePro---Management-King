import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import * as faceapi from '@vladmandic/face-api';

const ProfileInfo = () => {
  const { users } = useSelector((state) => state.auth);
  const [currentUser, setCurrentUser] = useState(null);
  const [image, setImage] = useState(null);
  const [employeeId, setEmployeeId] = useState('');
  const [status, setStatus] = useState('');
  const imageUploadRef = useRef(null);

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const usersArray = JSON.parse(storedUsers);
      const loggedInUser = localStorage.getItem('loggedInUser');
      if (loggedInUser) {
        const currentUserData = usersArray.find((user) => user.user_email === JSON.parse(loggedInUser).user_email);
        setCurrentUser(currentUserData);
      }
    }

    // Load face-api models
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model');
      await faceapi.nets.faceLandmark68Net.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model');
      await faceapi.nets.faceRecognitionNet.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model');
    };
    loadModels();
  }, []);

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleEmployeeIdChange = (event) => {
    setEmployeeId(event.target.value);
  };

  const getFaceEncoding = async (image) => {
    const img = await faceapi.bufferToImage(image);
    const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    if (!detections) {
      throw new Error("No face detected");
    }
    return detections.descriptor;
  };

  const handleScan = async () => {
    if (!image || !employeeId) {
      alert("Please select an image and enter Employee ID.");
      return;
    }

    setStatus("Processing face encoding...");

    try {
      const faceEncodings = await getFaceEncoding(image);

      const formData = new FormData();
      const imageName = `${employeeId}.jpg`;

      formData.append('file', image, imageName);
      formData.append('user_addhar', employeeId);
      formData.append('user_img', imageName);
      formData.append('user_face_data', JSON.stringify(Array.from(faceEncodings)));

      await updateUserFaceData(formData);

      // Update currentUser with the uploaded image URL
      const updatedCurrentUser = { ...currentUser, user_img: `https://workpanel.in/office_app/face_api/uploads/${imageName}` };
      setCurrentUser(updatedCurrentUser);

    } catch (error) {
      console.error('Error processing face encoding:', error);
      setStatus("Error processing face encoding.");
    }
  };

  const updateUserFaceData = async (formData) => {
    try {
      const response = await fetch('https://workpanel.in/office_app/face_api/face_api.php', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        console.log('User face data updated successfully');
        setStatus("User face data updated successfully.");
      } else {
        console.error('Error updating face data:', data.msg);
        setStatus(`Error updating face data: ${data.msg}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus(`Error: ${error.message}`);
    }
  };

  if (!currentUser) {
    return <div className="text-center text-gray-600">Loading profile information...</div>;
  }

  const infoItems = [
    { label: 'Email', value: currentUser.user_email },
    { label: 'Mobile', value: currentUser.user_mob },
    { label: 'Aadhar Number', value: currentUser.user_addhar },
    { label: 'PAN Number', value: currentUser.user_pan },
    { label: 'Address', value: currentUser.user_add },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8">
        <div className="flex flex-col items-center">
            {currentUser && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-purple-500 mb-4 shadow-lg"
              >
                {currentUser.user_img ? (
                  <img src={currentUser.user_img} alt={currentUser.user_fname} className="w-32 h-32 rounded-full" />
                ) : (
                  currentUser.user_fname.charAt(0).toUpperCase()
                )}
              </motion.div>
            )}
            <h2 className="text-3xl font-bold text-white mb-2">{`${currentUser.user_fname} ${currentUser.user_lname}`}</h2>
            <p className="text-white text-opacity-80">Employee Code: {currentUser.user_ecode}</p>
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {infoItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-4 rounded-lg shadow transition-all duration-300 hover:shadow-md"
              >
                <h3 className="text-sm font-semibold text-gray-600 mb-1">{item.label}</h3>
                <p className="text-gray-800">{item.value}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Update Profile Photo</h3>
            <div className="flex flex-col space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={imageUploadRef}
                className="hidden"
              />
              <button
                onClick={() => imageUploadRef.current.click()}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Select Image
              </button>
              {image && (
      <p className="text-sm text-gray-600 mb-4">{image.name}</p>
    )}
              <input
                type="text"
                placeholder="Enter Employee ID"
                value={employeeId}
                onChange={handleEmployeeIdChange}
                className="border rounded px-3 py-2"
              />
              <button
                onClick={handleScan}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
              >
                Scan and Update
              </button>
              {status && <p className="text-sm text-gray-600">{status}</p>}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileInfo;