import { Input } from "@chakra-ui/react";
import React, { useState } from "react";

export const EventSearch = ({ events, setFilteredEvents }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
  
    const filteredEvents = events.filter((event) => {
      const title = event.title ? event.title.toLowerCase() : ""; // Handle undefined title
      const category = event.category ? event.category.toLowerCase() : ""; // Handle undefined category
  
      const titleMatch = title.includes(searchTerm);
      const categoryMatch = category.includes(searchTerm);
  
      return titleMatch || categoryMatch;
    });
  
    console.log("Filtered Events:", filteredEvents); // Debugging line
  
    setFilteredEvents(filteredEvents);
  };

  return (
    <Input
      type="text"
      placeholder="Search events"
      value={searchTerm}
      onChange={handleSearch}
      width={["30%", "30%"]}
      pl = {50}
      mt={10}
      ml={30}
      borderColor={"black"}
      borderStyle={"solid"}
    />
  );
};
