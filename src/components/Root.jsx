import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { Footer } from '../components/Footer';
import Navigation from '../components/Navigation';
import eventsBackgroundImage from '../components/eventsBackgroundImage.png';

export const Root = () => {
  return (
    <Flex
      direction='column'
      width='100%' // Use 100% instead of 100vw to avoid overflow
      minHeight='100vh'
      bgImage={`url(${eventsBackgroundImage})`}
      bgSize='cover'
      bgPosition='center'
      bgRepeat='no-repeat'
      overflowX='hidden' // Prevent horizontal scrolling
    >
      <LogoutTimer />{' '}
      {/* ✅ Moved LogoutTimer here, so it is active on all pages */}
      {/* This way, the LogoutTimer is active on all pages, not just the EventsPage */}
      {/* It will listen for user activity and log out after 15 minutes of inactivity, regardless of which page the user is on */}
      {/* This ensures a consistent and secure user experience across the entire application */}
      {/* Header */}
      <Box as='header' width='100%'>
        <Navigation />
      </Box>
      {/* Main Content */}
      <Box
        as='main'
        flex='1'
        width='100%'
        maxWidth='container.xl' // Constrain content width on large screens
        mx='auto' // Center the content horizontally
        mt={4}
        mb={8}
        fontWeight={800}
        fontStyle='bold'
        px={[4, 6, 8]} // Responsive padding
      >
        <Outlet />{' '}
        {/* EventsPage.jsx renders here, Children of this route
        get injected here*/}
      </Box>
      {/* Footer */}
      <Box as='footer' width='100%'>
        <Footer />
      </Box>
    </Flex>
  );
};
