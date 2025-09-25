import { Button, Heading, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddEvent } from '../components/AddEvent';
import { EventList } from '../components/EventList'; // Import EventList
import { EventSearch } from '../components/EventSearch';
import { Hero } from '../components/Hero'; // Import Hero component
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
  const [activeCategory, setActiveCategory] = useState(null); // <-- Heading state for active category for Hero.jsx

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
      {
        /* Only show the Hero component once both events and categories are loaded */
        events.length > 0 && categories.length > 0 && (
          <Hero
            categories={categories} // Pass the list of categories from state to Hero
            // Function to run when a category block is clicked in Hero
            onCategoryClick={(categoryId) => {
              setActiveCategory(categoryId); // Save the clicked category ID to highlight it

              // Find the full category object by ID from the categories array
              const category = categories.find(
                (cat) => String(cat.id) === String(categoryId)
              );
              if (!category) return; // Safety check: stop if category not found

              // Filter events that belong to the clicked category
              const filtered = events.filter((event) =>
                event.categories?.some(
                  (cat) => String(cat.id) === String(category.id)
                )
              );

              setFilteredEvents(filtered); // Update the filtered events to display in EventList
            }}
            activeCategory={activeCategory} // Pass the active category ID to Hero for styling (e.g., highlight)
          />
        )
      }

      <LogoutTimer />
      <Heading as='h1' textAlign='center' mt='13' fontSize={30}>
        Discover and Explore Events Near You!
      </Heading>

      {/* Logo and LogoutButton */}
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
      {/* AddEvent Component */}
      <AddEvent
        setFilteredEvents={setFilteredEvents}
        events={events}
        categoryIds={[]}
        userId={userId}
      />
      {/* EventSearch Component */}
      <EventSearch events={events} setFilteredEvents={setFilteredEvents} />
      {/* EventList Component */}
      <EventList
        filteredEvents={filteredEvents}
        handleEventClick={handleEventClick}
        getCategoryName={getCategoryName}
      />
    </>
  );
};
