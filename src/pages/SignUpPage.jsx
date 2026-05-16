// src/pages/SignUpPage.jsx

import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OAuthButtonGroup } from '../FrontLogin/OAuthButtonGroup';
import { PasswordField } from '../FrontLogin/PasswordField';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    imageFile: null,
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, imageFile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const { name, email, username, password, imageFile } = formData;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', name);
      formDataToSend.append('email', email);
      formDataToSend.append('username', username);
      formDataToSend.append('password', password);
      if (imageFile) formDataToSend.append('image', imageFile);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/signup`,
        { method: 'POST', body: formDataToSend }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Sign-up failed. Please try again.');
      }

      // Store token and user if returned
      if (data.token) localStorage.setItem('token', data.token);
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user));

      // Show success toast with message from backend
      toast({
        title: 'Account created!',
        description: data.message || `Welcome ${username}! Check your email for a confirmation.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });

      // Navigate after short delay so user sees the toast
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred during sign-up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW='md' mx='auto' mt={10} px={4}>
      {errorMessage && (
        <Text color='red.500' mb={4}>
          {errorMessage}
        </Text>
      )}

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id='name' isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              type='text'
              name='name'
              fontWeight='bold'
              value={formData.name}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type='email'
              name='email'
              fontWeight='bold'
              value={formData.email}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl id='username' isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type='text'
              name='username'
              fontWeight='bold'
              value={formData.username}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <PasswordField
              name='password'
              value={formData.password}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl id='image'>
            <FormLabel>Upload Image</FormLabel>
            <Input
              type='file'
              accept='image/*'
              fontWeight='bold'
              onChange={handleImageChange}
            />
          </FormControl>

          <Button
            type='submit'
            colorScheme='blue'
            width='full'
            isLoading={isLoading}
            loadingText='Creating account...'
          >
            Sign Up
          </Button>

          <HStack width='full'>
            <Divider />
            <Text fontSize='sm' whiteSpace='nowrap' color='gray.500'>
              or sign up with
            </Text>
            <Divider />
          </HStack>

          <OAuthButtonGroup />
        </VStack>
      </form>
    </Box>
  );
};

export default SignUpPage;
