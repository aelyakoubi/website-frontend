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
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  FaSignInAlt,
  FaTrashAlt,
  FaUserCircle,
  FaUserEdit,
  FaUserPlus,
} from 'react-icons/fa';
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
    <Box
      bg='gray.900'
      p={3}
      width='100%'
      boxShadow='md'
      position='sticky'
      top={0}
      zIndex={1000}
    >
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
    loginWithRedirect,
  } = useAuth0();
  const navigate = useNavigate();
  const toast = useToast();

  // Check localStorage token for regular login users
  const [hasLocalToken, setHasLocalToken] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userName, setUserName] = useState('');

  // Check token on mount and when storage changes
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      setHasLocalToken(!!token);

      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUserName(parsedUser.username || parsedUser.email || 'User');
        } catch (e) {
          setUserName('User');
        }
      } else if (user) {
        setUserName(user.nickname || user.name || user.email || 'User');
      }

      setIsCheckingAuth(false);

      console.log('Auth state:', {
        hasToken: !!token,
        auth0Authenticated: isAuth0Authenticated,
        isLoggedIn: isAuth0Authenticated || !!token,
      });
    };

    checkToken();

    const handleStorage = () => {
      checkToken();
    };

    window.addEventListener('storage', handleStorage);

    const handleAuthChange = () => {
      checkToken();
    };

    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, [isAuth0Authenticated, user]);

  const isLoggedIn = isAuth0Authenticated || hasLocalToken;

  if (auth0Loading || isCheckingAuth) {
    return null;
  }

  const handleLogout = () => {
    // Remove JWT token
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setHasLocalToken(false);

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('auth-change'));

    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });

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

  const handleAccountClick = () => {
    if (isLoggedIn) {
      navigate('/useraccount');
    } else {
      // Show message that user needs to login
      toast({
        title: 'Login Required',
        description: 'Please login to access your account settings.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      });

      // Dispatch event to open login modal
      window.dispatchEvent(new CustomEvent('open-login-modal'));
    }
  };

  const handleUpdateAccount = () => {
    if (isLoggedIn) {
      navigate('/useraccount');
    } else {
      toast({
        title: 'Login Required',
        description: 'Please login to update your account.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      });
      window.dispatchEvent(new CustomEvent('open-login-modal'));
    }
  };

  const handleDeleteAccount = () => {
    if (isLoggedIn) {
      navigate('/useraccount');
      // Scroll to delete section after navigation
      setTimeout(() => {
        const deleteSection = document.getElementById('delete-account-section');
        if (deleteSection) {
          deleteSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      toast({
        title: 'Login Required',
        description: 'Please login to delete your account.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      });
      window.dispatchEvent(new CustomEvent('open-login-modal'));
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
        fontWeight='medium'
        _hover={{ textDecoration: 'underline', color: 'teal.200' }}
        onClick={handleLinkClick}
      >
        Home
      </Link>

      <Link
        as={RouterLink}
        to='/about'
        color='white'
        fontWeight='medium'
        _hover={{ textDecoration: 'underline', color: 'teal.200' }}
        onClick={handleLinkClick}
      >
        About Us
      </Link>

      <Link
        as={RouterLink}
        to='/contact'
        color='white'
        fontWeight='medium'
        _hover={{ textDecoration: 'underline', color: 'teal.200' }}
        onClick={handleLinkClick}
      >
        Contact
      </Link>

      {/* Account Menu - ALWAYS VISIBLE */}
      <Menu>
        <MenuButton
          as={Button}
          leftIcon={<FaUserCircle size='20px' />}
          colorScheme='teal'
          variant={isLoggedIn ? 'solid' : 'outline'}
          size='md'
          bg={isLoggedIn ? 'teal.500' : 'transparent'}
          _hover={{ bg: isLoggedIn ? 'teal.600' : 'gray.700' }}
          _active={{ bg: isLoggedIn ? 'teal.700' : 'gray.600' }}
        >
          {isLoggedIn ? userName || 'My Account' : 'Account'}
        </MenuButton>

        <MenuList bg='gray.800' borderColor='gray.700'>
          {isLoggedIn ? (
            <>
              <MenuItem
                icon={<FaUserEdit />}
                bg='gray.800'
                color='white'
                _hover={{ bg: 'gray.700' }}
                onClick={handleUpdateAccount}
              >
                <Text>Update Account Details</Text>
              </MenuItem>
              <MenuDivider borderColor='gray.700' />
              <MenuItem
                icon={<FaTrashAlt />}
                bg='gray.800'
                color='red.400'
                _hover={{ bg: 'gray.700', color: 'red.300' }}
                onClick={handleDeleteAccount}
              >
                <Text>Delete Account</Text>
              </MenuItem>
              <MenuDivider borderColor='gray.700' />
              <MenuItem
                onClick={handleLogout}
                bg='gray.800'
                color='white'
                _hover={{ bg: 'gray.700' }}
              >
                Logout
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem
                icon={<FaSignInAlt />}
                bg='gray.800'
                color='white'
                _hover={{ bg: 'gray.700' }}
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open-login-modal'));
                }}
              >
                <Text>Login to Your Account</Text>
              </MenuItem>
              <MenuDivider borderColor='gray.700' />
              <MenuItem
                icon={<FaUserPlus />}
                bg='gray.800'
                color='white'
                _hover={{ bg: 'gray.700' }}
                as={RouterLink}
                to='/signup'
                onClick={handleLinkClick}
              >
                <Text>Create New Account</Text>
              </MenuItem>
            </>
          )}
        </MenuList>
      </Menu>
    </>
  );
};

export default Navigation;
