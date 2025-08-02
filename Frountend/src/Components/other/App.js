// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from '../Front_page/Login';
// import ForgetPassword from '../Front_page/ForgetPassword';
// import Dashboard from '../Dashboard/Dashboard';
// import HrDashboard from '../Dashboard/HrDashboard';
// import ItDashboard from '../Dashboard/ItDashboard';
// import NewUserForm from '../Admin/NewUserForm';
// import PrivateRoute from '../other/ProtectedRoute';
// import SimStatusReg from '../HR_Region/SimStatusReg.js';
// import Userlist from '../Admin/userlist';
// import SimRequest from '../HR_common/SimRequest.js';
// import HODeactivationReq from '../IT_HO/DeactivationRequest/HODeactivationReq.js';
// import HOReqInitiation from '../IT_HO/ActivationRequest/HOReqInitiation.js';
// import HOSubmitRequest from '../IT_HO/ActivationRequest/HOSubmitRequest.js';
// import SwapSim from '../HR_HO/SwapRequest/SwapSim.js';
// import SwapRequestSubmit from '../IT_HO/SwapRequest/SwapRequestSubmit.js';
// import BulkUpload from '../IT_HO/Bulk upload/bulkupload.js';
// import SimTracker from '../other/simtracker.js';
// import Regionalrequest from '../HR_HO/regionalrequest.js';  
// // import ChangePassword from './ChangePassword.js';
// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   const handleLogin = (status) => {
//     setIsAuthenticated(status);
//   };

//   console.log('App rendered, isAuthenticated:', isAuthenticated);

//   return (
//     <Router>
//       <div>
//         <Routes>
//           <Route path="/" element={<Login onLogin={handleLogin} />} />
//           <Route path="/forget-password" element={<ForgetPassword />} />

//           <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/hrDashboard" element={<HrDashboard />} />
//             <Route path="/itDashboard" element={<ItDashboard />} />
//             <Route path="/NewUserForm" element={<NewUserForm />} />
//             <Route path="/HOReqInitiation" element={<HOReqInitiation />} />
//             <Route path="/SimStatusReg" element={<SimStatusReg />} />
//             <Route path="/userlist" element={<Userlist />} />
//             <Route path="/simrequest" element={<SimRequest />} />
//             <Route path="/HODeactivationReq" element={<HODeactivationReq />} />
//             <Route path="/SwapSim" element={<SwapSim />} />
//             <Route path="/HOSubmitRequest" element={<HOSubmitRequest />} />
//             <Route path="/SwapRequestSubmit" element={<SwapRequestSubmit />} />
//             <Route path="/bulkUpload" element={<BulkUpload />} />
//             <Route path="/Simtracker" element={<SimTracker />} />
//             <Route path="/regionalrequest" element={<Regionalrequest />} />
//             {/* <Route path="/ChangePassword" element={<ChangePassword />} /> */}
//           </Route>
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;







import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../Front_page/Login';
import ForgetPassword from '../Front_page/ForgetPassword';
import Dashboard from '../Dashboard/Dashboard';
import HrDashboard from '../Dashboard/HrDashboard';
import ItDashboard from '../Dashboard/ItDashboard';
import NewUserForm from '../Admin/NewUserForm';
import PrivateRoute from '../other/ProtectedRoute';
import SimStatusReg from '../HR_Region/SimStatusReg.js';
import Userlist from '../Admin/userlist';
import SimRequest from '../HR_common/SimRequest.js';
import HODeactivationReq from '../IT_HO/DeactivationRequest/HODeactivationReq.js';
import HOReqInitiation from '../IT_HO/ActivationRequest/HOReqInitiation.js';
import HOSubmitRequest from '../IT_HO/ActivationRequest/HOSubmitRequest.js';
import SwapSim from '../HR_HO/SwapRequest/SwapSim.js';
import SwapRequestSubmit from '../IT_HO/SwapRequest/SwapRequestSubmit.js';
import BulkUpload from '../IT_HO/Bulk upload/bulkupload.js';
import SimTracker from '../other/simtracker.js';
import Regionalrequest from '../HR_HO/regionalrequest.js';  

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleLogin = (status) => {
    setIsAuthenticated(status);

    if (status) {
      // Start session timer on login
      resetSessionTimer();
    } else {
      // Clear timer and session on logout
      clearSessionTimer();
    }
  };

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.clear(); // Clear user data from localStorage
    window.location.href = '/'; // Redirect to login page
  }, []);

  const clearSessionTimer = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }, [timeoutId]);

  const resetSessionTimer = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timer for 30 minutes (1,800,000ms)
    const newTimeoutId = setTimeout(() => {
      handleLogout();
    }, 1800000);

    setTimeoutId(newTimeoutId);
  }, [timeoutId, handleLogout]);

  useEffect(() => {
    if (isAuthenticated) {
      const events = ['mousemove', 'keydown', 'scroll', 'click'];
      events.forEach((event) => window.addEventListener(event, resetSessionTimer));

      return () => {
        events.forEach((event) => window.removeEventListener(event, resetSessionTimer));
        clearSessionTimer();
      };
    }
  }, [isAuthenticated, resetSessionTimer, clearSessionTimer]);

  

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/forget-password" element={<ForgetPassword />} />

          <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
          
           
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hrDashboard" element={<HrDashboard />} />
            <Route path="/itDashboard" element={<ItDashboard />} />
            <Route path="/NewUserForm" element={<NewUserForm />} />
            <Route path="/HOReqInitiation" element={<HOReqInitiation />} />
            <Route path="/SimStatusReg" element={<SimStatusReg />} />
            <Route path="/userlist" element={<Userlist />} />
            <Route path="/simrequest" element={<SimRequest />} />
            <Route path="/HODeactivationReq" element={<HODeactivationReq />} />
            <Route path="/SwapSim" element={<SwapSim />} />
            <Route path="/HOSubmitRequest" element={<HOSubmitRequest />} />
            <Route path="/SwapRequestSubmit" element={<SwapRequestSubmit />} />
            <Route path="/bulkUpload" element={<BulkUpload />} />
            <Route path="/Simtracker" element={<SimTracker />} />
            <Route path="/regionalrequest" element={<Regionalrequest />} />
            
          </Route>
           
        </Routes>
      </div>
    </Router>
  );
}

export default App;
