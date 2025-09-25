import { Input } from '@chakra-ui/react';
import React, { useState } from 'react';

export const EventSearch = ({ events, setFilteredEvents }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    const filteredEvents = events.filter((event) => {
      const title = event.title ? event.title.toLowerCase() : ''; // Handle undefined title
      const category = event.category ? event.category.toLowerCase() : ''; // Handle undefined category

      const titleMatch = title.includes(searchTerm);
      const categoryMatch = category.includes(searchTerm);

      return titleMatch || categoryMatch;
    });

    console.log('Filtered Events:', filteredEvents); // Debugging line

    setFilteredEvents(filteredEvents);
  };

  return (
    <Input
      type='text'
      placeholder='Search events'
      value={searchTerm}
      onChange={handleSearch}
      width={['100%', '80%', '60%']} // Responsive width: 100% on mobile, 80% on medium, 60% on large
      maxWidth='600px' // Optional: sets a maximum width
      pl={[4, 50]} // Smaller padding on mobile, larger on desktop
      ml={[2, 50]} // Smaller margin on mobile, larger on desktop
      mr={[2, 0]} // Add right margin on mobile if needed
      mt={[4, 10]}
      borderColor={'black'}
      borderStyle={'solid'}
      sx={{
        boxSizing: 'border-box', // Ensures padding is included in width calculation
      }}
    />
  );
};
