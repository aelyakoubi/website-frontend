// frontend/src/components/Hero.jsx

// Import Chakra UI components for layout and styling
import { Box, Heading, Icon, SimpleGrid, Text, VStack } from '@chakra-ui/react';
// React hooks for state and lifecycle
import { useEffect, useState } from 'react';
// React-icons for category icons
import { FaGamepad, FaRunning, FaSpa } from 'react-icons/fa';

/*
  Hero component
  =================
  This component displays a large hero section at the top of the page with:
  - Background image
  - Title and short description
  - Category blocks with icons and hover effect
  - Fade-in animation for visual appeal

  Props:
  - categories: array of category objects (optional, defaults used if empty)
  - onCategoryClick: callback function triggered when a category is clicked
*/
export const Hero = ({ categories = [], onCategoryClick, activeCategory }) => {
  // Default categories with icons and description
  const defaultCategories = [
    {
      id: 1,
      name: 'Sports',
      icon: FaRunning,
      description: 'Sportive events',
    },
    {
      id: 2,
      name: 'Games',
      icon: FaGamepad,
      description: 'Gaming and competition',
    },
    {
      id: 3,
      name: 'Relaxation',
      icon: FaSpa,
      description: 'Relaxation and wellness',
    },
  ];

  // Use categories from props if available, otherwise use default
  const displayCategories = categories.length ? categories : defaultCategories;

  // Fade-in state for animation
  const [fadeIn, setFadeIn] = useState(false);
  useEffect(() => {
    // Small delay before fade-in for smooth effect
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer); // cleanup
  }, []);

  return (
    <Box
      // Container for hero section
      position='relative'
      bgImage="url('/images/hero.jpg')" // Local background image
      bgSize='cover'
      bgPos='center'
      h={['50vh', '60vh']} // Responsive height
      color='white'
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      textAlign='center'
      px={4}
      // Fade-in effect
      opacity={fadeIn ? 1 : 0}
      transition='opacity 1.2s ease-in-out'
    >
      {/* Overlay for better text readability */}
      <Box
        position='absolute'
        top={0}
        left={0}
        w='100%'
        h='100%'
        bg='rgba(0,0,0,0.3)' // semi-transparent black
        zIndex={0} // background layer
      />

      {/* Hero content: title + description */}
      <VStack spacing={6} zIndex={1} maxW='800px'>
        <Heading fontSize={['3xl', '5xl']}>Discover the Best Events!</Heading>
        <Text fontSize={['md', 'xl']}>
          Browse events by category and stay updated on the latest happenings.
        </Text>
      </VStack>

      {/* Category blocks */}
      <SimpleGrid
        columns={[1, 3]} // 1 column on mobile, 3 on desktop
        spacing={8}
        mt={[8, 12]} // margin-top
        zIndex={1}
        w='100%'
        maxW='1000px'
        px={4} // horizontal padding
      >
        {displayCategories.map((cat) => {
          const CatIcon = cat.icon || FaGamepad; // fallback icon if none provided

          return (
            <VStack
              key={cat.id}
              spacing={2}
              bg={
                activeCategory === cat.id ? 'teal.500' : 'rgba(255,255,255,0.1)'
              } // Highlight if active
              color={activeCategory === cat.id ? 'white' : 'inherit'} // Text color for contrast
              p={4}
              borderRadius='md'
              cursor='pointer'
              _hover={{
                bg: 'rgba(255,255,255,0.2)',
                transform: 'scale(1.05)',
                transition: '0.3s',
              }}
              onClick={() => onCategoryClick && onCategoryClick(cat.id)}
            >
              {/* Category icon */}
              <Icon as={CatIcon} boxSize={8} />
              {/* Category name */}
              <Heading fontSize='lg'>{cat.name}</Heading>
              {/* Category description */}
              <Text fontSize='sm'>{cat.description}</Text>
            </VStack>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default Hero;

// ✅ Tips for junior devs:
// - Props are properties passed from a parent component (here: categories, onCategoryClick)
// - useState + useEffect are used for animations or dynamic changes
// - Chakra UI simplifies styling using props like bg, p, spacing, borderRadius
// - _hover in Chakra UI provides hover effects without writing CSS
