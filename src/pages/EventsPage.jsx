import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  Button,
  Flex,
  Container,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  HStack,
  Checkbox,
  Divider,
  Link,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AddEvent } from "../components/AddEvent";
import { EventSearch } from "../components/EventSearch";
import { handleLogin, isAuthenticated } from "../FrontLogin/AuthUtils";
import { Logo } from "../FrontLogin/Logo";
import { OAuthButtonGroup } from "../FrontLogin/OAuthButtonGroup";
import { PasswordField } from "../FrontLogin/PasswordField";
import LogoutButton from "../components/LogoutButton";
import LogoutTimer from "../components/LogoutTimer"; // Import the LogoutTimer component

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/events`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setEvents(data);
        setFilteredEvents(data);
      } else {
        console.error("Fetched events data is not an array", data);
        setFilteredEvents([]); // Set to empty array if not valid
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setFilteredEvents([]); // Handle error state gracefully
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
      const data = await response.json();
      setCategories(data);
      console.log("Fetched Categories:", data); // Add this line to debug
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const closeModal = () => {
    setError("");
    onClose();
    if (isAuthenticated()) {
      navigate("/");
    }
  };

  const userIsAuthenticated = isAuthenticated();
  const userId = userIsAuthenticated ? JSON.parse(localStorage.getItem("user"))?.id : null;

  const handleEventClick = (eventId) => {
    if (userIsAuthenticated) {
      navigate(`/event/${eventId}`);
    } else {
      alert("Please log in or sign up to view event details.");
    }
  };

  const getCategoryName = (id) => {
    const category = categories.find((cat) => String(cat.id) === String(id)); // Compare IDs as strings
    return category ? category.name : "Unknown";
  };

  return (
    <>
      <LogoutTimer /> {/* Add LogoutTimer component to track user inactivity */}
      <Heading as="h1" textAlign="center" mt="13" fontSize={30}>Winc's Events</Heading>
      <Container
        maxW="container.lg"
        position="relative"
        mt="4"
        zIndex="2"
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
      >
        <Flex
          direction="column"
          align="flex-end"
          position="absolute"
          top="0"
          right="0"
          zIndex="3"
          p="0"
        >
          {userIsAuthenticated && <Logo />}
          {userIsAuthenticated && <LogoutButton />} {/* Add LogoutButton for authenticated users */}
        </Flex>

        {!userIsAuthenticated && (
          <Stack spacing="2">
            <Text color="black.900" textAlign="center" fontSize={17}>
              Don't have an account? <Link as={RouterLink} to="/signup">Sign up</Link>
            </Text>
            <Box
              py={{ base: "0", sm: "8" }}
              px={{ base: "4", sm: "10" }}
              bg={{ base: "transparent", sm: "white" }}
              boxShadow={{ base: "none", sm: "md" }}
              borderRadius={{ base: "none", sm: "ml" }}
              mt="6"
            >
              <Stack spacing="6">
                <Stack spacing="5">
                  <FormControl>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </FormControl>
                  <PasswordField
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Stack>
                <HStack justify="space-between">
                  <Checkbox defaultChecked>Remember me</Checkbox>
                  <Button variant="link" size="sm">Forgot password?</Button>
                </HStack>
                <Stack spacing="6">
                  <Button onClick={() => handleLogin(username, password, closeModal)}>Log in</Button>
                  <HStack>
                    <Divider />
                    <Text textStyle="sm" whiteSpace="nowrap" color="gray.500">or continue with</Text>
                    <Divider />
                  </HStack>
                  <OAuthButtonGroup />
                </Stack>
              </Stack>
            </Box>
          </Stack>
        )}
      </Container>

      <AddEvent setFilteredEvents={setFilteredEvents} events={events} categoryIds={[]} userId={userId} />
      <EventSearch events={events} setFilteredEvents={setFilteredEvents} />

      <Stack
        spacing={4}
        flexDir="row"
        flexWrap="wrap"
        justifyContent="space-between"
        maxW="container.m" // Set a max width for the container
        mx="auto"           // Center it by setting left and right margins to auto
        px={4}              // Add some horizontal padding
        mt={50}
      >
        {Array.isArray(filteredEvents) && filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Box
              key={event.id}
              borderWidth="7px"
              boxShadow="dark-lg"
              w="250px"
              bg="white"
              align="center"
              bgImage={`url(${event.image})`}
              bgSize="cover"
              bgPosition="center"
              borderRadius="15px"
              border="3px solid"
              padding="0.6em 1.2em"
              fontSize="1em"
              fontWeight="extrabold"
              fontFamily="inherit"
              fontStyle="bold"
              color={"black"}
              cursor="pointer"
              transition="border-color 0.25s, box-shadow 0.25s"
              _hover={{
                borderColor: "purple",
                boxShadow: "0 0 8px 2px rgba(128, 78, 254, 0.5)",
              }}
              _focus={{ outline: "4px auto -webkit-focus-ring-color" }}
              onClick={() => handleEventClick(event.id)}
            >
              <Box p="1" bg="rgba(255, 255, 255, 0.3)">
                <Heading as="h2" mb={5} size="md" fontWeight={"extrabold"}>
                  {event.title}
                </Heading>
                <Text isTruncated>{event.description}</Text>
                <Text>{new Date(event.startTime).toLocaleString()}</Text>
                <Text>{new Date(event.endTime).toLocaleString()}</Text>
                <Text>{event.location}</Text>
                <Text>
                  {event.categoryIds && Array.isArray(event.categoryIds) && event.categoryIds.length > 0 ? (
                    event.categoryIds.map(id => {
                      const name = getCategoryName(id);
                      return name;
                    }).join(', ')
                  ) : (
                    "No event categories are filled in."
                  )}
                </Text>
              </Box>
            </Box>
          ))
        ) : (
          <Text>No events found.</Text>
        )}
      </Stack>
    </>
  );
};
