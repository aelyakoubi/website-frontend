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
      placeholder="Search"
      value={searchTerm}
      onChange={handleSearch}
      width={50}
      pl = {30}
      mt={20}
      ml={10}
      borderColor={"black"}
      borderStyle={"solid"}
    />
  );
};
