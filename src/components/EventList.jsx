import React from "react";
import { Box, Heading, Text, Stack } from "@chakra-ui/react";

export const EventList = ({ filteredEvents, handleEventClick, getCategoryName }) => {
  return (
    <Stack
      spacing={4}
      flexDir="row"
      flexWrap="wrap"
      justifyContent="space-between"
      maxW="container.m"
      mx="auto"
      px={4}
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
  );
};
