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
    "linear(to-br, blue.50, green.50)",
    "linear(to-br, gray.900, gray.800)"
  );
  const cardBg = useColorModeValue("white", "gray.800");

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
      <Box bgGradient={bgGradient} py={{ base: 16, md: 24 }}>
        <Container maxW="container.xl">
          <VStack spacing={8} textAlign="center">
            <Badge colorScheme="green" fontSize="md" px={4} py={2} borderRadius="full">
              🩺 AI-Verified Medical Crowdfunding
            </Badge>
            <Heading
              as="h1"
              size="3xl"
              fontWeight="bold"
              bgGradient="linear(to-r, blue.600, green.500)"
              bgClip="text"
            >
              VeCare Chain
            </Heading>
            <div className="text-3xl text-red-300">
              Rebuilding trust in medical crowdfunding with AI verification,
              blockchain transparency, and direct fund access for those in need.
            </div>
            <HStack spacing={4} pt={4}>
              <Button
                size="lg"
                colorScheme="blue"
                onClick={() => navigate("/campaigns")}
                px={8}
              >
                Browse Campaigns
              </Button>
              <Button
                size="lg"
                variant="outline"
                colorScheme="green"
                onClick={() => navigate("/create")}
                px={8}
              >
                Create Campaign
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="container.xl" py={20}>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading size="xl">How VeCare Chain Works</Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
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
                  <Text color="gray.600">{feature.description}</Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* CTA Section */}
      <Box bg="blue.600" py={16}>
        <Container maxW="container.xl">
          <VStack spacing={6} textAlign="center">
            <Heading size="xl" color="white">
              Ready to Make a Difference?
            </Heading>
            <Text fontSize="lg" color="blue.100" maxW="2xl">
              Whether you need help or want to help others, VeCare Chain provides
              a trusted platform for medical crowdfunding.
            </Text>
            <HStack spacing={4}>
              <Button
                size="lg"
                bg="white"
                color="blue.600"
                onClick={() => navigate("/campaigns")}
                _hover={{ bg: "gray.100" }}
              >
                Donate Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                color="white"
                borderColor="white"
                onClick={() => navigate("/create")}
                _hover={{ bg: "blue.700" }}
              >
                Start a Campaign
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxW="container.xl" py={16}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          <VStack>
            <Heading size="2xl" color="blue.600">
              100%
            </Heading>
            <Text fontSize="lg" color="gray.600">
              AI-Verified Campaigns
            </Text>
          </VStack>
          <VStack>
            <Heading size="2xl" color="green.600">
              Direct
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Fund Transfers
            </Text>
          </VStack>
          <VStack>
            <Heading size="2xl" color="orange.600">
              B3tr
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Rewards for Donors
            </Text>
          </VStack>
        </SimpleGrid>
      </Container>
    </Box>
  );
};
