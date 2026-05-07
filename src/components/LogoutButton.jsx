// LogoutButton.jsx
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@chakra-ui/react';

const LogoutButton = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
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
