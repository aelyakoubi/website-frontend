import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Input,
  Stack,
  Button,
  Flex,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { isAuthenticated } from "../FrontLogin/AuthUtils"; // Import isAuthenticated
import backgroundImage from "../components/backgroundImage.jpg"; // Import background image

export const AddEvent = ({ setFilteredEvents, events, userId }) => {
  const [categories, setCategories] = useState([]);
  const [location, setLocation] = useState(''); // Added state to track location input
  const maxLength = 30; // Maximum allowed characters for location
  
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`); // Use environment variable for API URL
      const data = await response.json();
      console.log("Fetched categories data:", data);
  
      // Ensure categories is an array
      if (Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.error("Unexpected data format:", data);
        setCategories([]); // Set to an empty array if format is not as expected
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]); // Reset categories on error
    }
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const selectedCategoryId = form.category.value;

    const startTime = form.startTime.value + ":00";
    const endTime = form.endTime.value + ":00";

    // Log userId value
    console.log("User ID:", userId);

    // Retrieve the token from localStorage
    const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage

    // Initialize newEvent object
    const newEvent = {
      title: form.title.value,
      description: form.description.value,
      image: form.image.value,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      location: location, // Use the state value for location
      categoryIds: [selectedCategoryId],
      createdBy: userId,
    };

    // Console logs for debugging
    console.log("Selected Category ID:", selectedCategoryId);
    console.log("New Event Object:", newEvent);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/events`, { // Use environment variable for API URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        const data = await response.json();
        setFilteredEvents([...events, data]);
        form.reset();
        alert("Event added successfully!");
      } else {
        const errorData = await response.json();
        console.error("Failed to create event:", errorData);
        alert(`Failed to create event: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to add event!");
    }
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value); // Update location state as user types
  };

  return (
    <>
      <Button
        onClick={onOpen}
        bgSize="cover"
        bgImage={`url(${backgroundImage})`}
        bgPosition="center"
        borderRadius="15px"
        border="3px solid"
        padding="0.6em 1.2em"
        fontSize="1.0em"
        color={"black"}
        mt={0}
        ml={5}
        w="150px"
        h="100px"
        fontWeight="650"
        fontFamily="inherit"
        cursor="pointer"
        transition="border-color 0.25s, box-shadow 0.50s"
        _hover={{
          borderColor: "purple",
          boxShadow: "0 0 8px 2px rgba(128, 78, 254, 0.8)",
        }}
        _focus={{ outline: "4px auto -webkit-focus-ring-color" }}
      >
        Click to Add Event
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex>
              <Box
                bg={"white"}
                boxShadow="dark-lg"
                borderWidth="5px"
                p={4}
                ml={5}
                mt={70}
              >
                <Heading mb={2} ml={5}>
                  Add Event
                </Heading>

                {/* Check if user is authenticated */}
                {!isAuthenticated() && (
                  <Text color="red.500" mb={4}>
                    Please log in or sign up to add an event.
                  </Text>
                )}
                {isAuthenticated() && (
                  <form onSubmit={handleSubmit}>
                    <Stack spacing={4} mt={50}>
                      <Input name="title" placeholder="Title" required />
                      <Input name="description" placeholder="Description" required />
                      <Input name="image" placeholder="Image URL" />
                      <Input type="datetime-local" name="startTime" placeholder="Start Time" required />
                      <Input type="datetime-local" name="endTime" placeholder="End Time" required />
                      
                      {/* Modified location input */}
                      <Input 
                        name="location" 
                        placeholder="Location" 
                        value={location} // Bind input value to state
                        onChange={handleLocationChange} // Handle location input changes
                        maxLength={maxLength + 1} // Allow to type beyond limit for notification purposes
                        required 
                      />
                      {location.length > maxLength && (
                        <Text color="red.500" fontSize="sm">
                          Location cannot exceed {maxLength} characters.
                        </Text>
                      )}
                      <Text fontSize="sm">
                        {location.length}/{maxLength} characters
                      </Text>
                      
                      <Select name="category" placeholder="Select Category" required>
                        {Array.isArray(categories) && categories.length > 0 ? (
                          categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))
                        ) : (
                          <option disabled>No categories available</option>
                        )}
                      </Select>

                      <Button type="submit" colorScheme="blue">
                        Add Event
                      </Button>
                    </Stack>
                  </form>
                )}
              </Box>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close Modal</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddEvent;
