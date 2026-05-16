import { Button, Heading, useDisclosure } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddEvent } from '../components/AddEvent';
import { EventList } from '../components/EventList';
import { EventSearch } from '../components/EventSearch';
import { Hero } from '../components/Hero';
import { LoginModal } from '../components/LoginModal';
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
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  // Luister naar de Login knop in de navbar
  useEffect(() => {
    window.addEventListener('open-login-modal', onOpen);
    return () => window.removeEventListener('open-login-modal', onOpen);
  }, [onOpen]);

  const fetchEvents = async () => {
    try {
      const token = isAuthenticated() ? localStorage.getItem('token') : null;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/events`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setCategories(data);
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
      onOpen();
    }
  };

  const getCategoryName = (id) => {
    const category = categories.find((cat) => String(cat.id) === String(id));
    return category ? category.name : 'Unknown';
  };

  return (
    <>
      {events.length > 0 && categories.length > 0 && (
        <Hero
          categories={categories}
          onCategoryClick={(categoryId) => {
            setActiveCategory(categoryId);
            const category = categories.find(
              (cat) => String(cat.id) === String(categoryId)
            );
            if (!category) return;
            const filtered = events.filter((event) =>
              event.categories?.some(
                (cat) => String(cat.id) === String(category.id)
              )
            );
            setFilteredEvents(filtered);
          }}
          activeCategory={activeCategory}
        />
      )}

      <LogoutTimer />
      <Heading as='h1' textAlign='center' mt='13' fontSize={30}>
        Discover and Explore Events Near You!
      </Heading>

      {userIsAuthenticated && <Logo />}
      {userIsAuthenticated && <LogoutButton />}

      <LoginModal isOpen={isOpen} onClose={onClose} />

      {!userIsAuthenticated && (
        <Button onClick={onOpen} mt={4} colorScheme='teal'>
          Log in
        </Button>
      )}

      <AddEvent
        setFilteredEvents={setFilteredEvents}
        events={events}
        categoryIds={[]}
        userId={userId}
      />
      <EventSearch events={events} setFilteredEvents={setFilteredEvents} />
      <EventList
        filteredEvents={filteredEvents}
        handleEventClick={handleEventClick}
        getCategoryName={getCategoryName}
      />
    </>
  );
};
