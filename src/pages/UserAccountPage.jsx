// UserAccountPage.js
import React, { useState, useEffect } from "react";
import { Box, Flex, VStack, FormControl, FormLabel, Input, Button, Heading, Text } from "@chakra-ui/react";

const UserAccountPage = () => {
  const [updatedUser, setUpdatedUser] = useState({ username: "", email: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/account`, {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) {
          throw new Error("Failed to load account details");
        }

        const data = await response.json();
        setUpdatedUser({ username: data.username, email: data.email });
      } catch (error) {
        setErrorMessage("Unable to load account details. Please try again.");
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleUpdateUser = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/account`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error("Failed to update account details");
      }

      setSuccessMessage("Account updated successfully");

      // Redirect to homepage after a brief delay to show the success message
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      setErrorMessage("Update failed. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    setErrorMessage("");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/account`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (error) {
      setErrorMessage("Account deletion failed. Please try again.");
    }
  };

  return (
    <Flex direction="column" align="center" p={2} flexGrow={1}>
      <Box maxW="500px" w="100%">
        <Heading as="h1" fontSize="1.8em" mb={2}>Account Details</Heading>
        {errorMessage && <Text color="red.500">{errorMessage}</Text>}
        {successMessage && <Text color="green.500">{successMessage}</Text>}
      </Box>

      {/* User Account Details */}
      <VStack spacing={6} maxW="400px" w="100%">
        <FormControl id="username">
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            name="username"
            value={updatedUser.username}
            onChange={handleInputChange}
            placeholder="Enter your username"
          />
        </FormControl>
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={updatedUser.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
        </FormControl>
        <Button colorScheme="teal" onClick={handleUpdateUser}>Update Account</Button>
        <Button colorScheme="red" onClick={handleDeleteAccount}>Delete Account</Button>
      </VStack>
    </Flex>
  );
};

export default UserAccountPage;
