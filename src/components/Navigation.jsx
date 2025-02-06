import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Link,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React, { useEffect, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const MotionBox = motion(Box);

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const menuRef = useRef();

  // Close the menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onToggle(); // Close the menu when clicking outside
      }
    };

    // Add the event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
        {/* Logo or Branding */}
        <Box color='white' fontSize='xl' fontWeight='bold'>
          www.MAX-ONLINESHOP-EVENTS.com
        </Box>

        {/* Desktop Menu */}
        <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
          <NavLinks />
        </HStack>

        {/* Mobile Menu Button */}
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          onClick={onToggle}
          variant='ghost'
          color='white'
          _hover={{ bg: 'gray.700' }}
          aria-label='Toggle menu'
        />

        {/* Mobile Menu */}
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
            {/* Close Button inside the mobile menu */}
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

// Navigation Links Component
const NavLinks = () => (
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
    <Link
      as={RouterLink}
      to='/signup'
      color='white'
      _hover={{ textDecoration: 'underline' }}
    >
      Sign Up
    </Link>
    <Link
      as={RouterLink}
      to='/useraccount'
      color='white'
      _hover={{ textDecoration: 'underline' }}
    >
      <FaUserCircle size='24px' />
    </Link>
  </>
);

export default Navbar;
