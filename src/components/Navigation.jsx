import React from 'react';
import { Box, Flex, HStack, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <Box bg="gray.900" p={3} w="100vw">
      <Flex as="nav" justify="space-between">
        <HStack spacing={4}>
          <Link as={RouterLink} to="/" px={2} py={1} rounded="md" _hover={{ bg: "gray.700" }} color="white" textDecoration="underline">
            Home
          </Link>
          <Link as={RouterLink} to="/about" px={2} py={1} rounded="md" _hover={{ bg: "gray.700" }} color="white" textDecoration="underline">
            About Us
          </Link>
          <Link as={RouterLink} to="/contact" px={2} py={1} rounded="md" _hover={{ bg: "gray.700" }} color="white" textDecoration="underline">
            Contact
          </Link>
          <Link as={RouterLink} to="/signup" px={2} py={1} rounded="md" _hover={{ bg: "gray.700" }} color="white" textDecoration="underline">
            Sign Up
          </Link>
          <Link as={RouterLink} to="/useraccount" px={2} py={1} rounded="md" _hover={{ bg: "gray.700" }} color="white" textDecoration="underline">
            User Account
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;

