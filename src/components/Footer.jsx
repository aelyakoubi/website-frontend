import React from 'react';
import { Box, Text, HStack, Link } from '@chakra-ui/react';

export const Footer = () => {
  return (
    <Box as="footer" bg="gray.800" color="white" px={10} textAlign="center" w="100vw" >
      <HStack justify="center" spacing={8} mb={4}>
        <Link href="/" _hover={{ color: 'teal.300' }}>
          Home
        </Link>
        <Link href="/about" _hover={{ color: 'teal.300' }}>
          About Us
        </Link>
        <Link href="/contact" _hover={{ color: 'teal.300' }}>
          Contact
        </Link>
      </HStack>
      <Text>
        &copy; {new Date().getFullYear()} Website. All Rights Reserved.
      </Text>
    </Box>
  );
};

export default Footer;
