// main.jsx
import { Auth0Provider } from '@auth0/auth0-react';
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LogoutTimer from './components/LogoutTimer'; // Ensure this path is correct
import { Root } from './components/Root';
import AboutUsPage from './pages/AboutUsPage';
import CallbackPage from './pages/CallbackPage';
import ContactPage from './pages/ContactPage';
import { EventPage } from './pages/EventPage';
import { EventsPage } from './pages/EventsPage';
import SignUpPage from './pages/SignUpPage';
import UserAccountPage from './pages/UserAccountPage'; // Import the UserAccountPage component

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <EventsPage />,
      },
      {
        path: '/signup', // Adding the route for sign-up
        element: <SignUpPage />, // Render SignUpPage component
      },
      {
        path: '/contact', // Contact route
        element: <ContactPage />,
      },
      {
        path: '/about', // About us route
        element: <AboutUsPage />,
      },
      {
        path: '/event/:eventId',
        element: <EventPage />,
      },
      {
        path: '/useraccount', // User account route
        element: <UserAccountPage />,
      },
      {
        path: '/callback', // Auth0 callback route
        element: <CallbackPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/callback`,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      }}
    >
      <ChakraProvider>
        <LogoutTimer />
        <RouterProvider router={router} />
      </ChakraProvider>
    </Auth0Provider>
  </React.StrictMode>
);
