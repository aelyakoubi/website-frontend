// src/components/LogoutButton.jsx

import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const { isAuthenticated: isAuth0Authenticated, logout: auth0Logout } = useAuth0();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Verwijder eigen JWT altijd
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Als ook Auth0 sessie actief is, ook daar uitloggen
    if (isAuth0Authenticated) {
      auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    } else {
      navigate('/');
    }
  };

  return (
    <Button
      onClick={handleLogout}
      colorScheme='red'
      position='absolute'
      top='20'
      right='20'
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
