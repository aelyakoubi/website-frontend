import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { handleLogin } from '../FrontLogin/AuthUtils';
import { OAuthButtonGroup } from '../FrontLogin/OAuthButtonGroup';
import { PasswordField } from '../FrontLogin/PasswordField';

export const LoginModal = ({ isOpen, onClose }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLoginClick = async () => {
    await handleLogin(identifier, password, onClose, navigate, setError);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Login</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing='2'>
            {error && (
              <Text color='red.500' textAlign='center'>
                {error}
              </Text>
            )}
            <Text color='black.900' textAlign='center' fontSize={17}>
              Don't have an account?{' '}
              <Link as={RouterLink} to='/signup'>
                Sign up
              </Link>
            </Text>
            <Box
              py={{ base: '0', sm: '8' }}
              px={{ base: '4', sm: '10' }}
              bg={{ base: 'transparent', sm: 'white' }}
              boxShadow={{ base: 'none', sm: 'md' }}
              borderRadius={{ base: 'none', sm: 'ml' }}
              mt='6'
            >
              <Stack spacing='6'>
                <Stack spacing='5'>
                  <FormControl>
                    <FormLabel htmlFor='identifier'>
                      Username or Email
                    </FormLabel>
                    <Input
                      id='identifier'
                      type='text'
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                  </FormControl>
                  <PasswordField
                    id='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Stack>
                <HStack justify='space-between'>
                  <Checkbox defaultChecked>Remember me</Checkbox>
                  <Button variant='link' size='sm'>
                    Forgot password?
                  </Button>
                </HStack>
                <Stack spacing='6'>
                  <Button onClick={handleLoginClick}>Log in</Button>
                  <HStack>
                    <Divider />
                    <Text textStyle='sm' whiteSpace='nowrap' color='gray.500'>
                      or continue with
                    </Text>
                    <Divider />
                  </HStack>
                  <OAuthButtonGroup />
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </ModalBody>
        <ModalFooter>
          {/* <Text color='black.900' textAlign='center' fontSize={17}>
            Don't have an account?{' '}
            <Link as={RouterLink} to='/signup'>
              Sign up
            </Link>
          </Text>*/}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
