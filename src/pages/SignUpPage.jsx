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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      imageFile: e.target.files[0],
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message
    setSuccessMessage(''); // Reset success message
  
    const { name, email, username, password, imageFile } = formData;
  
    try {
      await handleSignUp(name, email, username, password, imageFile);
      setSuccessMessage('Sign-up successful! Redirecting...');
  
      // Redirect to homepage after successful sign-up
      setTimeout(() => {
        navigate('/'); // Redirect to the homepage after 2 seconds
      }, 2000);
      
    } catch (error) {
      // Display specific error messages from the backend
      setErrorMessage(error.response?.data?.message || 'Sign-up failed. Please try again.');
    }
  };
  

  return (
    <Box maxW="md" mx="auto" mt={10}>
      {errorMessage && <Text color="red.500">{errorMessage}</Text>} {/* Display error message */}
      {successMessage && <Text color="green.500">{successMessage}</Text>} {/* Display success message */}
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
               fontWeight="bold"
               placeholder="Your Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
               fontWeight="bold"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Your Email"
            />
          </FormControl>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              name="username"
               fontWeight="bold"
               placeholder="Your Username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type={showPassword ? 'text' : 'password'} // Toggle password visibility
              name="password"
               fontWeight="bold"
               placeholder="Your Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <Button onClick={() => setShowPassword(!showPassword)} variant="link">
              {showPassword ? <ViewOffIcon /> : <ViewIcon />}
              {showPassword ? 'Hide password' : 'Show password'}
            </Button>
          </FormControl>
          <FormControl id="image">
            <FormLabel>Upload Image</FormLabel>
            <Input
              type="file"
              accept="image/*"
               fontWeight="bold"
              onChange={handleImageChange}
            />
          </FormControl>
          <Button type="submit" colorScheme="blue" width="full">
            Sign Up
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default SignUpPage;
