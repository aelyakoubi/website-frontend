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
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserAccountPage = () => {
  const {
    user,
    getAccessTokenSilently,
    isAuthenticated: isAuth0Authenticated,
  } = useAuth0();
  const navigate = useNavigate();
  const toast = useToast();

  const [updatedUser, setUpdatedUser] = useState({ username: '', email: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if user is logged in via regular JWT
  const hasLocalToken = !!localStorage.getItem('token');
  const isLoggedIn = isAuth0Authenticated || hasLocalToken;

  // Get token based on authentication method
  const getAuthToken = async () => {
    if (isAuth0Authenticated) {
      // Auth0 user
      return await getAccessTokenSilently();
    } else if (hasLocalToken) {
      // Regular login user
      return localStorage.getItem('token');
    }
    return null;
  };

  // Load user data
  useEffect(() => {
    const loadUserData = () => {
      if (isAuth0Authenticated && user) {
        // Auth0 user data
        setUpdatedUser({
          username: user.nickname || user.name || '',
          email: user.email || '',
        });
      } else if (hasLocalToken) {
        // Regular login user data from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUpdatedUser({
              username: parsedUser.username || parsedUser.name || '',
              email: parsedUser.email || '',
            });
          } catch (e) {
            console.error('Error parsing user data:', e);
          }
        }
      } else {
        // Not logged in - redirect to home
        toast({
          title: 'Access Denied',
          description: 'Please login to access your account.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        navigate('/');
      }
    };

    loadUserData();
  }, [isAuth0Authenticated, user, hasLocalToken, navigate, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleUpdateUser = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const token = await getAuthToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Updating user with token:', token.substring(0, 20) + '...');
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

      // Update localStorage with new user data
      if (hasLocalToken && responseData.user) {
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

      // Redirect to homepage after a brief delay
      setTimeout(() => {
        navigate('/');
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
    // Confirm deletion
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone!'
    );

    if (!confirmDelete) return;

    setErrorMessage('');
    setIsDeleting(true);

    try {
      const token = await getAuthToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log(
        'Deleting account with token:',
        token.substring(0, 20) + '...'
      );

      const response = await fetch(`${import.meta.env.VITE_API_URL}/account`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete account');
      }

      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('auth-change'));

      toast({
        title: 'Account Deleted',
        description: 'Your account has been permanently deleted.',
        status: 'info',
        duration: 4000,
        isClosable: true,
      });

      // Redirect to homepage
      navigate('/');
    } catch (error) {
      console.error('Delete error:', error);
      setErrorMessage(
        error.message || 'Account deletion failed. Please try again.'
      );
      toast({
        title: 'Deletion Failed',
        description:
          error.message || 'Could not delete account. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

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
