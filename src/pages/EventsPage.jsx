import {
  Button,
  Container,
  Flex,
  Heading,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddEvent } from '../components/AddEvent';
import { EventList } from '../components/EventList'; // Import EventList
import { EventSearch } from '../components/EventSearch';
import { LoginModal } from '../components/LoginModal'; // Import LoginModal
import LogoutButton from '../components/LogoutButton';
import LogoutTimer from '../components/LogoutTimer';
import { isAuthenticated } from '../FrontLogin/AuthUtils';
import { Logo } from '../FrontLogin/Logo';

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  const fetchEvents = async () => {
    try {
      // Only include token if the user is authenticated
      const token = isAuthenticated() ? localStorage.getItem('token') : null;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/events`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}), // Add token if it exists
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setEvents(data);
        setFilteredEvents(data);
      } else {
        console.error('Fetched events data is not an array', data);
        setFilteredEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setFilteredEvents([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include Bearer token in headers
          },
        }
      );
      const data = await response.json();
      setCategories(data);
      console.log('Fetched Categories:', data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const userIsAuthenticated = isAuthenticated();
  const userId = userIsAuthenticated
    ? JSON.parse(localStorage.getItem('user'))?.id
    : null;

  const handleEventClick = (eventId) => {
    if (userIsAuthenticated) {
      navigate(`/event/${eventId}`);
    } else {
      onOpen(); // Open the login modal if not authenticated
    }
  };

  const getCategoryName = (id) => {
    const category = categories.find((cat) => String(cat.id) === String(id));
    return category ? category.name : 'Unknown';
  };

  return (
    <>
      <LogoutTimer />
      <Flex
        direction='column'
        w='100vw' // Ensure the Flex container takes up the full viewport width
        minH='100vh' // Ensure the Flex container takes up the full viewport height
        align='center'
        justify='center'
        overflowX='hidden' // Prevent horizontal scrolling
        mx='0' // Remove horizontal margin
        px={['1', '2', '4']} // Reduced responsive padding
      >
        <Heading as='h1' textAlign='center' mt='13' fontSize={30}>
          Welcome to our events page
        </Heading>
        <Container
          maxW='container.xl' // You can adjust this if needed
          position='relative'
          mt='4'
          zIndex='2'
          bgSize='cover'
          bgPosition='center'
          bgRepeat='no-repeat'
          width='100%' // Ensure the container takes full width
          overflow='hidden' // Prevent horizontal scrolling
          boxSizing='border-box' // Include padding and border in the element's width
        >
          {/* Logo and LogoutButton are now directly inside the Container */}
          {userIsAuthenticated && <Logo />}
          {userIsAuthenticated && <LogoutButton />}

          {/* Render the LoginModal conditionally based on isOpen */}
          <LoginModal isOpen={isOpen} onClose={onClose} />

          {/* Button to open the login modal directly */}
          {!userIsAuthenticated && (
            <Button onClick={onOpen} mt={4} colorScheme='teal'>
              Log in
            </Button>
          )}
        </Container>

        <AddEvent
          setFilteredEvents={setFilteredEvents}
          events={events}
          categoryIds={[]}
          userId={userId}
        />
        <EventSearch events={events} setFilteredEvents={setFilteredEvents} />

        {/* Event List */}
        <EventList
          filteredEvents={filteredEvents}
          handleEventClick={handleEventClick}
          getCategoryName={getCategoryName}
        />
      </Flex>
    </>
  );
};
