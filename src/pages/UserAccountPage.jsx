// src/pages/UserAccountPage.jsx
import { useAuth0 } from '@auth0/auth0-react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserAccountPage = () => {
  const {
    user,
    isAuthenticated: isAuth0Authenticated,
    logout: auth0Logout,
  } = useAuth0();
  const navigate = useNavigate();
  const toast = useToast();

  const [updatedUser, setUpdatedUser] = useState({ username: '', email: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

  // Check if user is logged in via regular JWT
  const hasLocalToken = !!localStorage.getItem('token');
  const isLoggedIn = isAuth0Authenticated || hasLocalToken;

  // Get the backend JWT token (works for both login types)
  const getBackendToken = () => {
    // Both regular login AND Auth0 login store the backend JWT in localStorage
    const token = localStorage.getItem('token');
    console.log(
      'Getting backend token:',
      token ? 'Token exists' : 'No token found'
    );
    return token;
  };

  // Load user data from backend (works for both user types)
  useEffect(() => {
    const loadUserData = async () => {
      if (!isLoggedIn) {
        toast({
          title: 'Access Denied',
          description: 'Please login to access your account.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        navigate('/');
        return;
      }

      setIsLoadingUserData(true);

      try {
        const token = getBackendToken();

        if (!token) {
          throw new Error('No authentication token found. Please login again.');
        }

        console.log('Fetching user data from /account endpoint...');

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/account`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Session expired. Please login again.');
          }
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        console.log('User data loaded:', userData);

        setUpdatedUser({
          username: userData.username || '',
          email: userData.email || '',
        });
      } catch (error) {
        console.error('Error loading user data:', error);
        toast({
          title: 'Error',
          description:
            error.message || 'Failed to load account data. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoadingUserData(false);
      }
    };

    loadUserData();
  }, [isLoggedIn, navigate, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleUpdateUser = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const token = getBackendToken();

      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      console.log('Updating account...');
      console.log('Update data:', updatedUser);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/account`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 'Failed to update account details'
        );
      }

      const responseData = await response.json();
      console.log('Update response:', responseData);

      // Update localStorage with new user data
      if (responseData.user) {
        localStorage.setItem('user', JSON.stringify(responseData.user));
      }

      setSuccessMessage('Account updated successfully!');

      toast({
        title: 'Account Updated',
        description: 'Your account details have been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('auth-change'));

      // Refresh user data after 1.5 seconds
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Update error:', error);
      setErrorMessage(error.message || 'Update failed. Please try again.');
      toast({
        title: 'Update Failed',
        description:
          error.message || 'Could not update account. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      '⚠️ WARNING: This action is permanent!\n\nAre you absolutely sure you want to delete your account? All your events, data, and information will be permanently removed and cannot be recovered.'
    );

    if (!confirmDelete) return;

    setErrorMessage('');
    setIsDeleting(true);

    try {
      const token = getBackendToken();

      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      console.log('Deleting account...');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/account`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Delete response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete account`);
      }

      const responseData = await response.json();
      console.log('Delete response:', responseData);

      // Clear localStorage for both user types
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('auth-change'));

      // If it's an Auth0 user, also logout from Auth0
      if (isAuth0Authenticated) {
        console.log('Auth0 user - logging out from Auth0 as well');
        await auth0Logout({
          logoutParams: {
            returnTo: window.location.origin,
          },
        });
      }

      toast({
        title: 'Account Deleted',
        description:
          'Your account has been permanently deleted. We are sad to see you go! 😢',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });

      // Redirect to homepage
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Delete error details:', error);
      setErrorMessage(
        error.message || 'Account deletion failed. Please try again.'
      );
      toast({
        title: 'Deletion Failed',
        description:
          error.message ||
          'Could not delete account. Please try again or contact support.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Show loading state
  if (isLoadingUserData) {
    return (
      <Flex
        direction='column'
        align='center'
        justify='center'
        minH='60vh'
        p={4}
      >
        <Spinner size='xl' color='teal.500' />
        <Text mt={4}>Loading account details...</Text>
      </Flex>
    );
  }

  // If not logged in, show access denied message
  if (!isLoggedIn) {
    return (
      <Flex
        direction='column'
        align='center'
        justify='center'
        minH='60vh'
        p={4}
      >
        <Alert
          status='warning'
          variant='subtle'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          textAlign='center'
          height='200px'
          borderRadius='lg'
        >
          <AlertIcon boxSize='40px' mr={0} />
          <AlertTitle mt={4} mb={1} fontSize='lg'>
            Access Denied
          </AlertTitle>
          <AlertDescription maxWidth='sm'>
            Please login to access your account settings.
          </AlertDescription>
          <Button
            mt={4}
            colorScheme='teal'
            onClick={() =>
              window.dispatchEvent(new CustomEvent('open-login-modal'))
            }
          >
            Login to Your Account
          </Button>
        </Alert>
      </Flex>
    );
  }

  return (
    <Flex direction='column' align='center' p={4} flexGrow={1}>
      <Box maxW='600px' w='100%'>
        <Heading as='h1' fontSize='2em' mb={6} textAlign='center'>
          Account Details
        </Heading>

        {errorMessage && (
          <Alert status='error' mb={4} borderRadius='md'>
            <AlertIcon />
            {errorMessage}
          </Alert>
        )}

        {successMessage && (
          <Alert status='success' mb={4} borderRadius='md'>
            <AlertIcon />
            {successMessage}
          </Alert>
        )}

        {/* User Account Details */}
        <VStack spacing={6} w='100%'>
          <FormControl id='username'>
            <FormLabel>Username</FormLabel>
            <Input
              type='text'
              name='username'
              value={updatedUser.username}
              onChange={handleInputChange}
              placeholder='Enter your username'
              size='lg'
            />
          </FormControl>

          <FormControl id='email'>
            <FormLabel>Email</FormLabel>
            <Input
              type='email'
              name='email'
              value={updatedUser.email}
              onChange={handleInputChange}
              placeholder='Enter your email'
              size='lg'
            />
          </FormControl>

          <Button
            colorScheme='teal'
            onClick={handleUpdateUser}
            isLoading={isLoading}
            loadingText='Updating...'
            size='lg'
            w='100%'
          >
            Update Account
          </Button>

          <Box w='100%' pt={4}>
            <Heading as='h2' fontSize='1.5em' mb={4} color='red.500'>
              Danger Zone
            </Heading>
            <Text mb={4} color='gray.600'>
              Once you delete your account, there is no going back. All your
              data will be permanently removed.
            </Text>
            <Button
              colorScheme='red'
              onClick={handleDeleteAccount}
              isLoading={isDeleting}
              loadingText='Deleting...'
              size='lg'
              w='100%'
              variant='outline'
            >
              Delete Account
            </Button>
          </Box>
        </VStack>
      </Box>
    </Flex>
  );
};

export default UserAccountPage;
