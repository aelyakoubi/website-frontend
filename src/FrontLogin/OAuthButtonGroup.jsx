import { useAuth0 } from '@auth0/auth0-react';
import { Button, ButtonGroup, VisuallyHidden } from '@chakra-ui/react';
import { GitHubIcon, GoogleIcon, MicrosoftIcon } from './ProviderIcons';

const providers = [
  { name: 'Google', icon: <GoogleIcon />, connection: 'google-oauth2' },
  { name: 'GitHub', icon: <GitHubIcon />, connection: 'github' },
  { name: 'Microsoft', icon: <MicrosoftIcon />, connection: 'windowslive' },
];

export const OAuthButtonGroup = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = (connection) => {
    loginWithRedirect({
      authorizationParams: {
        connection: connection,
      },
    });
  };

  return (
    <ButtonGroup variant='secondary' spacing='4'>
      {providers.map(({ name, icon, connection }) => (
        <Button key={name} flexGrow={1} onClick={() => handleLogin(connection)}>
          <VisuallyHidden>Sign in with {name}</VisuallyHidden>
          {icon}
        </Button>
      ))}
    </ButtonGroup>
  );
};
