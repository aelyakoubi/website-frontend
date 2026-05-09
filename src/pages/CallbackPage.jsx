// src/pages/CallbackPage.jsx
//
// AANGEPAST: Na succesvolle Auth0 OAuth login wordt de gebruiker gesynchroniseerd
// met de eigen backend via POST /auth/oauth-sync.
// De backend slaat de gebruiker op in de database en geeft een eigen JWT terug.
// Die JWT wordt opgeslagen in localStorage — precies zoals bij normale login.

import { useAuth0 } from '@auth0/auth0-react';
import { Box, Spinner, Text } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const CallbackPage = () => {
  const { isLoading, error, isAuthenticated, user } = useAuth0();
  const navigate = useNavigate();
  const synced = useRef(false); // Voorkomt dubbele sync bij React StrictMode

  useEffect(() => {
    if (isLoading) return;

    if (error) {
      console.error('Authentication error:', error);
      navigate('/');
      return;
    }

    if (isAuthenticated && user && !synced.current) {
      synced.current = true;

      // Stuur gebruikersdata naar de backend om op te slaan en JWT te ontvangen
      const syncUser = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/auth/oauth-sync`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                nickname: user.nickname,
                sub: user.sub,
              }),
            }
          );

          if (response.ok) {
            const { token, user: dbUser } = await response.json();
            // Sla JWT op in localStorage — zelfde als normale login
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(dbUser));
          } else {
            console.error('OAuth sync failed:', await response.json());
          }
        } catch (err) {
          console.error('OAuth sync error:', err);
        }

        // Redirect naar homepage na sync (ook als sync mislukt)
        navigate('/');
      };

      syncUser();
    }
  }, [isLoading, isAuthenticated, error, user, navigate]);

  return (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      height='100vh'
    >
      <Spinner size='xl' />
      <Text ml={4}>Completing login...</Text>
    </Box>
  );
};

export default CallbackPage;
