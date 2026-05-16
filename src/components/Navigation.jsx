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

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onToggle();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onToggle]);

  return (
    <Box bg='gray.900' p={3} width='100%'>
      <Flex
        as='nav'
        justify='space-between'
        align='center'
        maxW='container.xl'
        mx='auto'
      >
        <Box color='white' fontSize='xl' fontWeight='bold'>
          www.MAX-ONLINESHOP-EVENTS.com
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
            pos='fixed'
            top={0}
            right={0}
            w='60vw'
            h='100vh'
            bg='gray.800'
            boxShadow='lg'
            p={6}
            zIndex={20}
          >
            <IconButton
              icon={<CloseIcon />}
              onClick={onToggle}
              variant='ghost'
              color='white'
              _hover={{ bg: 'gray.700' }}
              aria-label='Close menu'
              position='absolute'
              top={4}
              right={4}
            />
            <VStack align='start' spacing={6}>
              <NavLinks />
            </VStack>
          </MotionBox>
        )}
      </Flex>
    </Box>
  );
};

const NavLinks = () => {
  const { isAuthenticated: isAuth0Authenticated, logout: auth0Logout } = useAuth0();
  const navigate = useNavigate();

  // Check localStorage token voor normale login gebruikers
  const [hasLocalToken, setHasLocalToken] = useState(
    () => !!localStorage.getItem('token')
  );

  // Luister naar storage wijzigingen (login/logout in andere tab)
  useEffect(() => {
    const handleStorage = () => {
      setHasLocalToken(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Gebruiker is ingelogd als Auth0 sessie actief is OF localStorage token aanwezig is
  const isLoggedIn = isAuth0Authenticated || hasLocalToken;

  const handleLogout = () => {
    // Verwijder eigen JWT altijd
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setHasLocalToken(false);

    // Als ook Auth0 sessie actief is, ook daar uitloggen
    if (isAuth0Authenticated) {
      auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <Link
        as={RouterLink}
        to='/'
        color='white'
        _hover={{ textDecoration: 'underline' }}
      >
        Home
      </Link>
      <Link
        as={RouterLink}
        to='/about'
        color='white'
        _hover={{ textDecoration: 'underline' }}
      >
        About Us
      </Link>
      <Link
        as={RouterLink}
        to='/contact'
        color='white'
        _hover={{ textDecoration: 'underline' }}
      >
        Contact
      </Link>
      {isLoggedIn ? (
        <>
          <Link
            as={RouterLink}
            to='/useraccount'
            color='white'
            _hover={{ textDecoration: 'underline' }}
          >
            <FaUserCircle size='24px' />
          </Link>
          <Button color='white' variant='link' onClick={handleLogout}>
            Logout
          </Button>
        </>
      ) : (
        <>
          {/* Login knop opent de LoginModal via de useDisclosure in Root/Navigation */}
          <Link
            as={RouterLink}
            to='/'
            color='white'
            _hover={{ textDecoration: 'underline' }}
            onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal'))}
          >
            Login
          </Link>
          <Link
            as={RouterLink}
            to='/signup'
            color='white'
            _hover={{ textDecoration: 'underline' }}
          >
            Sign Up
          </Link>
        </>
      )}
    </>
  );
};

export default Navbar;
