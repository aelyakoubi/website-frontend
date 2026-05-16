// Navigation.jsx
import { useAuth0 } from '@auth0/auth0-react';
import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Link,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);

const Navigation = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <Box bg='gray.900' p={3} width='100%' boxShadow='md'>
      <Flex
        as='nav'
        justify='space-between'
        align='center'
        maxW='container.xl'
        mx='auto'
      >
        <Box
          color='white'
          fontSize='xl'
          fontWeight='bold'
          as={RouterLink}
          to='/'
          _hover={{ textDecoration: 'none', opacity: 0.9 }}
        >
          www.MAX-EVENTS.com
        </Box>

        <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
          <NavLinks />
        </HStack>

        <IconButton
          display={{ base: 'flex', md: 'none' }}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          onClick={onToggle}
          variant='ghost'
          color='white'
          _hover={{ bg: 'gray.700' }}
          aria-label='Toggle menu'
        />

        {isOpen && (
          <MotionBox
            ref={menuRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3 }}
            position='fixed'
            top={0}
            right={0}
            width='60vw'
            height='100vh'
            bg='gray.800'
            boxShadow='lg'
            p={6}
            zIndex={20}
          >
            <IconButton
              icon={<CloseIcon />}
              onClick={onClose}
              variant='ghost'
              color='white'
              _hover={{ bg: 'gray.700' }}
              aria-label='Close menu'
              position='absolute'
              top={4}
              right={4}
            />
            <VStack align='start' spacing={6} mt={12}>
              <NavLinks onMobileClick={onClose} />
            </VStack>
          </MotionBox>
        )}
      </Flex>
    </Box>
  );
};

const NavLinks = ({ onMobileClick }) => {
  const {
    isAuthenticated: isAuth0Authenticated,
    logout: auth0Logout,
    user,
    isLoading: auth0Loading,
  } = useAuth0();
  const navigate = useNavigate();

  // Check localStorage token for regular login users
  const [hasLocalToken, setHasLocalToken] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check token on mount and when storage changes
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      setHasLocalToken(!!token);
      setIsCheckingAuth(false);

      // Debug logging
      console.log('Token check:', {
        hasToken: !!token,
        hasUserData: !!userData,
        auth0Authenticated: isAuth0Authenticated,
      });
    };

    checkToken();

    // Listen for storage changes (login/logout in other tabs)
    const handleStorage = () => {
      checkToken();
    };

    window.addEventListener('storage', handleStorage);

    // Custom event for login/logout within the same tab
    const handleAuthChange = () => {
      checkToken();
    };

    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, [isAuth0Authenticated]);

  // User is logged in if Auth0 session is active OR localStorage token exists
  const isLoggedIn = isAuth0Authenticated || hasLocalToken;

  // Don't render until we've checked authentication
  if (auth0Loading || isCheckingAuth) {
    return null; // Or return a loading spinner
  }

  const handleLogout = () => {
    // Remove JWT token
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setHasLocalToken(false);

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('auth-change'));

    // If Auth0 session is active, logout from there too
    if (isAuth0Authenticated) {
      auth0Logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      });
    } else {
      navigate('/');
    }
  };

  const handleLinkClick = () => {
    if (onMobileClick) {
      onMobileClick();
    }
  };

  return (
    <>
      <Link
        as={RouterLink}
        to='/'
        color='white'
        _hover={{ textDecoration: 'underline', color: 'teal.200' }}
        onClick={handleLinkClick}
      >
        Home
      </Link>

      <Link
        as={RouterLink}
        to='/about'
        color='white'
        _hover={{ textDecoration: 'underline', color: 'teal.200' }}
        onClick={handleLinkClick}
      >
        About Us
      </Link>

      <Link
        as={RouterLink}
        to='/contact'
        color='white'
        _hover={{ textDecoration: 'underline', color: 'teal.200' }}
        onClick={handleLinkClick}
      >
        Contact
      </Link>

      {isLoggedIn ? (
        <>
          <Link
            as={RouterLink}
            to='/useraccount'
            color='white'
            _hover={{ textDecoration: 'underline', color: 'teal.200' }}
            display='flex'
            alignItems='center'
            title='My Account'
            onClick={handleLinkClick}
          >
            <FaUserCircle size='24px' />
          </Link>

          <Button
            color='white'
            variant='link'
            onClick={handleLogout}
            _hover={{ textDecoration: 'underline', color: 'teal.200' }}
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <Link
            as={RouterLink}
            to='/'
            color='white'
            _hover={{ textDecoration: 'underline', color: 'teal.200' }}
            onClick={(e) => {
              handleLinkClick();
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('open-login-modal'));
            }}
          >
            Login
          </Link>

          <Link
            as={RouterLink}
            to='/signup'
            color='white'
            _hover={{ textDecoration: 'underline', color: 'teal.200' }}
            onClick={handleLinkClick}
          >
            Sign Up
          </Link>
        </>
      )}
    </>
  );
};

export default Navigation;
