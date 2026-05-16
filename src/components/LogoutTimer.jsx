// src/components/LogoutTimer.jsx
//
// Logt de gebruiker automatisch uit na 15 minuten inactiviteit.
// Werkt voor zowel Auth0 gebruikers als normale login gebruikers (localStorage token).

import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const TIMEOUT_MS = 15 * 60 * 1000; // 15 minuten

const LogoutTimer = () => {
  const { isAuthenticated: isAuth0Authenticated, logout: auth0Logout } = useAuth0();
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const hasLocalToken = () => !!localStorage.getItem('token');
  const isLoggedIn = isAuth0Authenticated || hasLocalToken();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    if (isAuth0Authenticated) {
      auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    } else {
      navigate('/');
    }
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(handleLogout, TIMEOUT_MS);
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    resetTimer();

    const events = ['click', 'mousemove', 'keypress'];
    events.forEach((e) => document.addEventListener(e, resetTimer));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((e) => document.removeEventListener(e, resetTimer));
    };
  }, [isAuth0Authenticated]);

  return null;
};

export default LogoutTimer;
