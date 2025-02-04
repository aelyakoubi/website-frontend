// AboutUsPage.jsx
import { Avatar, Box, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import React from 'react';

const AboutUsPage = () => {
  const teamMembers = [
    { name: 'Jane Doe', role: 'CEO', image: 'https://via.placeholder.com/150' },
    {
      name: 'John Smith',
      role: 'CTO',
      image: 'https://via.placeholder.com/150',
    },
    {
      name: 'Emily Johnson',
      role: 'Designer',
      image: 'https://via.placeholder.com/150',
    },
  ];

  return (
    <Box p={5}>
      <Heading mb={5} fontSize={70}>
        About Us
      </Heading>
      <Text mb={5}>
        Welcome to our company! We are dedicated to providing the best services
        to our customers. Our team is passionate, skilled, and ready to help you
        achieve your goals. Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Doloribus quisquam ex illo harum provident illum unde neque,
        nesciunt aliquam corrupti? Officiis harum est architecto placeat eum
        nulla et! Sunt, tenetur! lorem ipsum dolor sit amet consectetur
        adipisicing elit. Doloribus quisquam ex illo harum provident illum unde
        neque, nesciunt aliquam corrupti? Officiis harum est architecto placeat
        eum nulla et! Sunt, tenetur!
      </Text>
      <Heading size='md' mb={3} fontSize={70}>
        Meet Our Team
      </Heading>
      <VStack spacing={4}>
        {teamMembers.map((member, index) => (
          <HStack key={index} spacing={4} fontSize={30}>
            <Avatar name={member.name} src={member.image} />
            <VStack align='start'>
              <Text fontWeight='bold' fontSize={40}>
                {member.name}
              </Text>
              <Text color='yellow.500'>{member.role}</Text>
            </VStack>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

export default AboutUsPage;
