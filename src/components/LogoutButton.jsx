// LogoutButton.jsx
import React from 'react';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Clear userId from localStorage as well
    navigate('/'); // Redirect to the home page or login page
  };

  return (
    <Button onClick={handleLogout} colorScheme="red" position="absolute" top="3" right="0">
      Logout
    </Button>
  );
};

export default LogoutButton;
