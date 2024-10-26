import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Input, VStack, Text } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'; // Import icons for showing/hiding password
import { handleSignUp } from '../FrontLogin/AuthUtils'; // Ensure the path to AuthUtils is correct

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    imageFile: null,
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const navigate = useNavigate(); // Initialize navigate hook

  // Function to handle input changes (name, username, email, password)
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle file input changes (image)
  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      imageFile: e.target.files[0],
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message
    setSuccessMessage(''); // Reset success message

    const { name, email, username, password, imageFile } = formData;

    try {
      // Call handleSignUp and pass all the form data
      await handleSignUp(name, email, username, password, imageFile, navigate);
      setSuccessMessage('Sign-up successful! Redirecting...');
      
      setTimeout(() => {
        navigate('/'); // Redirect to the homepage after 2 seconds
      }, 2000);
    } catch (error) {
      console.error("Sign-up error:", error); // Log the error for debugging
      setErrorMessage(error.response?.data?.message || 'Sign-up failed. Please try again.');
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10}>
      {/* Display error message if exists */}
      {errorMessage && <Text color="red.500">{errorMessage}</Text>}
      {/* Display success message if exists */}
      {successMessage && <Text color="green.500">{successMessage}</Text>}

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          {/* Name input field */}
          <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              fontWeight="bold"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </FormControl>

          {/* Email input field */}
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              fontWeight="bold"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </FormControl>

          {/* Username input field */}
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              name="username"
              fontWeight="bold"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </FormControl>

          {/* Password input field with toggle visibility */}
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              fontWeight="bold"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <Button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              variant="link"
              color="blue.500"
              fontSize="sm"
            >
              {showPassword ? <ViewOffIcon /> : <ViewIcon />}
              {showPassword ? 'Hide password' : 'Show password'}
            </Button>
          </FormControl>

          {/* Image upload field */}
          <FormControl id="image">
            <FormLabel>Upload Image</FormLabel>
            <Input
              type="file"
              accept="image/*"
              fontWeight="bold"
              onChange={handleImageChange}
            />
          </FormControl>

          {/* Submit button */}
          <Button type="submit" colorScheme="blue" width="full">
            Sign Up
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default SignUpPage;
