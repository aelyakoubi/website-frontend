// src/pages/SignUpPage.jsx
//
// AANGEPAST: OAuthButtonGroup toegevoegd zodat gebruikers zich ook kunnen
// registreren via Google, GitHub of Microsoft.

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
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OAuthButtonGroup } from '../FrontLogin/OAuthButtonGroup';
import { handleSignUp } from '../FrontLogin/AuthUtils';

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
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

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
    setErrorMessage('');
    setSuccessMessage('');

    const { name, email, username, password, imageFile } = formData;

    try {
      await handleSignUp(name, email, username, password, imageFile, navigate);
      setSuccessMessage('Sign-up successful! Redirecting...');

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Sign-up error:', error);
      setErrorMessage(
        error.response?.data?.message || 'Sign-up failed. Please try again.'
      );
    }
  };

  return (
    <Box maxW='md' mx='auto' mt={10} px={4}>
      {/* Foutmelding */}
      {errorMessage && <Text color='red.500' mb={4}>{errorMessage}</Text>}
      {/* Succesmelding */}
      {successMessage && <Text color='green.500' mb={4}>{successMessage}</Text>}

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          {/* Naam */}
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

          {/* Email */}
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

          {/* Gebruikersnaam */}
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

          {/* Wachtwoord */}
          <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type={showPassword ? 'text' : 'password'}
              name='password'
              fontWeight='bold'
              value={formData.password}
              onChange={handleInputChange}
            />
            <Button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              variant='link'
              color='blue.500'
              fontSize='sm'
              mt={1}
            >
              {showPassword ? <ViewOffIcon mr={1} /> : <ViewIcon mr={1} />}
              {showPassword ? 'Hide password' : 'Show password'}
            </Button>
          </FormControl>

          {/* Afbeelding uploaden */}
          <FormControl id='image'>
            <FormLabel>Upload Image</FormLabel>
            <Input
              type='file'
              accept='image/*'
              fontWeight='bold'
              onChange={handleImageChange}
            />
          </FormControl>

          {/* Registreren knop */}
          <Button type='submit' colorScheme='blue' width='full'>
            Sign Up
          </Button>

          {/* Scheidingslijn */}
          <HStack width='full'>
            <Divider />
            <Text fontSize='sm' whiteSpace='nowrap' color='gray.500'>
              or sign up with
            </Text>
            <Divider />
          </HStack>

          {/* OAuth knoppen — Google, GitHub, Microsoft */}
          <OAuthButtonGroup />
        </VStack>
      </form>
    </Box>
  );
};

export default SignUpPage;
