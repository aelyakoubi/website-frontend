// LogoutTimer.jsx

import { useEffect } from 'react';
//import { logoutUser } from '../FrontLogin/AuthUtils'; // Adjust the import path as needed

const LogoutTimer = () => {
  let logoutTimer;

  const startLogoutTimer = () => {
    console.log("Starting logout timer");
    logoutTimer = setTimeout(() => {
      console.log("Logging out user due to inactivity");
      logoutUser();
    }, 15 * 60 * 1000); // 15 minutes in milliseconds
  };

  const resetLogoutTimer = () => {
    console.log("Resetting logout timer");
    clearTimeout(logoutTimer);
    startLogoutTimer();
  };

  useEffect(() => {
    startLogoutTimer();

    // Reset timer on user activity
    const resetTimerOnActivity = () => {
      resetLogoutTimer();
    };

    document.addEventListener('click', resetTimerOnActivity);
    document.addEventListener('mousemove', resetTimerOnActivity);
    document.addEventListener('keypress', resetTimerOnActivity);

    return () => {
      // Clean up event listeners
      document.removeEventListener('click', resetTimerOnActivity);
      document.removeEventListener('mousemove', resetTimerOnActivity);
      document.removeEventListener('keypress', resetTimerOnActivity);
    };
  }, []);

  return null; // Since this component doesn't render anything, return null
};

export default LogoutTimer;
