import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  Flex,
  useColorModeValue,
  Badge,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaHeartbeat, FaShieldAlt, FaGlobe, FaCoins } from "react-icons/fa";

export const HomePage = () => {
  const navigate = useNavigate();
  const bgGradient = useColorModeValue(
    // lighter hero for a softer, trustful look
    "linear(to-br, whiteAlpha.900, primary.50)",
    "linear(to-br, primary.800, primary.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const descColor = useColorModeValue("gray.700", "gray.200");
  const featuresHeadingColor = useColorModeValue("white", "white");
  const featuresDescColor = useColorModeValue("whiteAlpha.900", "whiteAlpha.900");

  const features = [
    {
      icon: FaShieldAlt,
      title: "AI-Verified Campaigns",
      description:
        "Every campaign is verified by our AI Trust Engine to ensure authenticity and legitimacy.",
      color: "green.500",
    },
    {
      icon: FaHeartbeat,
      title: "Direct Fund Transfer",
      description:
        "Funds go directly to campaign creators' wallets for immediate medical care access.",
      color: "red.500",
    },
    {
      icon: FaCoins,
      title: "B3tr Token Rewards",
      description:
        "Donors earn B3tr tokens for every contribution, building reputation and governance power.",
      color: "orange.500",
    },
    {
      icon: FaGlobe,
      title: "Global Impact",
      description:
        "Built on VeChain for transparent, low-cost transactions accessible worldwide.",
      color: "blue.500",
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bgGradient={bgGradient}
        minH={{ base: "75vh", md: "85vh" }}
        display="flex"
        alignItems="center"
        py={{ base: 8, md: 0 }}
        pt={{ base: 20, md: 24 }}
      >
        <Container maxW="container.xl">
          <VStack spacing={{ base: 6, md: 10 }} textAlign="center" py={{ base: 8, md: 0 }}>
            <Badge colorScheme="primary" fontSize="md" px={4} py={2} borderRadius="full">
              AI-Verified Medical Crowdfunding
            </Badge>
            <Heading
              as="h1"
              size="3xl"
              fontWeight="700"
              letterSpacing="-0.02em"
              bgGradient={"linear(to-r, primary.700, primary.500)"}
              bgClip="text"
              color="var(--chakra-colors-primary-600)"
            >
              VeCare Chain
            </Heading>
            <Text fontSize="xl" color={descColor} maxW="3xl">
              Rebuilding trust in medical crowdfunding with AI verification,
              blockchain transparency, and direct fund access for those in need.
            </Text>
            <HStack spacing={4} pt={4}>
              <Button size="lg" colorScheme="primary" onClick={() => navigate("/campaigns")} px={8}>
                Browse Campaigns
              </Button>
              <Button size="lg" variant="outline" colorScheme="primary" onClick={() => navigate("/create")} px={8}>
                Create Campaign
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container
        bgGradient={useColorModeValue("linear(to-br, primary.600, primary.700)", "linear(to-br, primary.800, primary.900)")}
        maxW="full"
        py={20}
        px={20}
      >
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading size="xl" color={featuresHeadingColor}>
              How VeCare Works
            </Heading>
            <Text fontSize="lg" color={featuresDescColor} maxW="2xl">
              We combine AI verification, blockchain transparency, and community
              governance to create a trusted platform for medical crowdfunding.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
            {features.map((feature, index) => (
              <Box
                key={index}
                bg={cardBg}
                p={8}
                borderRadius="xl"
                shadow="lg"
                transition="all 0.3s"
                _hover={{ transform: "translateY(-4px)", shadow: "xl" }}
              >
                <VStack spacing={4} align="start">
                  <Flex
                    w={12}
                    h={12}
                    align="center"
                    justify="center"
                    borderRadius="lg"
                    bg={`${feature.color.split(".")[0]}.50`}
                  >
                    <Icon as={feature.icon} w={6} h={6} color={feature.color} />
                  </Flex>
                  <Heading size="md">{feature.title}</Heading>
                  <Text color={descColor}>{feature.description}</Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* CTA Section */}
      <Box bg="white" py={16}>
        <Container maxW="container.xl">
          <VStack spacing={6} textAlign="center">
            <Heading size="xl" color="black">
              Ready to Make a Difference?
            </Heading>
            <Text fontSize="lg" color="muted-text" maxW="2xl">
              Whether you need help or want to help others, VeCare Chain provides
              a trusted platform for medical crowdfunding.
            </Text>
            <HStack spacing={4}>
              <Button size="lg" colorScheme="primary" onClick={() => navigate("/campaigns")} px={6}>
                Donate Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                colorScheme="primary"
                borderColor="primary.600"
                onClick={() => navigate("/create")}
                _hover={{ bg: "primary.50" }}
              >
                Start a Campaign
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxW="full" py={16} bg="white">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          <VStack>
            <Heading size="2xl" color="primary.600">
              100%
            </Heading>
            <Text fontSize="lg" color="muted-text">
              AI-Verified Campaigns
            </Text>
          </VStack>
          <VStack>
            <Heading size="2xl" color="green.600">
              Direct
            </Heading>
            <Text fontSize="lg" color="muted-text">
              Fund Transfers
            </Text>
          </VStack>
          <VStack>
            <Heading size="2xl" color="orange.600">
              B3tr
            </Heading>
            <Text fontSize="lg" color="muted-text">
              Rewards for Donors
            </Text>
          </VStack>
        </SimpleGrid>
      </Container>
    </Box>
  );
};
