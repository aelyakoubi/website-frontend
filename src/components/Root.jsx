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
        <Outlet /> {/* EventsPage.jsx renders here */}
      </Box>

      {/* Footer */}
      <Box as='footer' width='100%'>
        <Footer />
      </Box>
    </Flex>
  );
};
