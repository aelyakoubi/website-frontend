import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Textarea, Heading, useToast } from '@chakra-ui/react';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name || !email || !message) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true); // Set loading state

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contact`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        toast({
          title: 'Message sent successfully!',
          description: 'We will contact you soon.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setName('');
        setEmail('');
        setMessage('');
      } else {
        throw new Error('Failed to send message.');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error sending your message. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <Box p={5}>
      <Heading mb={5}>Contact Us</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={4} isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            type="text"
            fontWeight="bold"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
          />
        </FormControl>
        <FormControl mb={4} isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            fontWeight="bold"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
          />
        </FormControl>
        <FormControl mb={4} isRequired>
          <FormLabel>Message</FormLabel>
          <Textarea
            value={message}
            fontWeight="bold"
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your Message"
            size="md"
          />
        </FormControl>
        <Button type="submit" colorScheme="blue" isLoading={loading}>
          Send Message
        </Button>
      </form>
    </Box>
  );
};

export default ContactPage;
