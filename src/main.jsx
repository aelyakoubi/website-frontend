// main.jsx
import { Auth0Provider } from '@auth0/auth0-react';
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Root } from './components/Root';
import AboutUsPage from './pages/AboutUsPage';
import CallbackPage from './pages/CallbackPage';
import ContactPage from './pages/ContactPage';
import { EventPage } from './pages/EventPage';
import { EventsPage } from './pages/EventsPage';
import SignUpPage from './pages/SignUpPage';
import UserAccountPage from './pages/UserAccountPage';

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
        path: '/signup',
        element: <SignUpPage />,
      },
      {
        path: '/contact',
        element: <ContactPage />,
      },
      {
        path: '/about',
        element: <AboutUsPage />,
      },
      {
        path: '/event/:eventId',
        element: <EventPage />,
      },
      {
        path: '/useraccount',
        element: <UserAccountPage />,
      },
      {
        path: '/callback',
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
      }}
    >
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </Auth0Provider>
  </React.StrictMode>
);
