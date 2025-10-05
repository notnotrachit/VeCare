import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
  Progress,
  Button,
  useColorModeValue,
  Spinner,
  Center,
  Icon,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWallet } from "@vechain/dapp-kit-react";
import { FaCheckCircle, FaHeart } from "react-icons/fa";
import { API_ENDPOINTS } from "../config/api";

interface Campaign {
  id: number;
  creator: string;
  title: string;
  description: string;
  goalAmount: string;
  raisedAmount: string;
  deadline: number;
  isVerified: boolean;
  donorCount: number;
}

export const CampaignBrowser: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { account } = useWallet();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "my">(() => {
    const params = new URLSearchParams(location.search);
    return params.get("filter") === "my" ? "my" : "all";
  });

  const cardBg = useColorModeValue("white", "gray.800");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (filter === "my") params.set("filter", "my");
    else params.delete("filter");
    const newUrl = `${location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.replaceState({}, "", newUrl);
  }, [filter, location.pathname, location.search]);

  useEffect(() => {
    fetchCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, account]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      if (filter === "my") {
        if (!account) {
          setCampaigns([]);
          return;
        }
        const resp = await fetch(API_ENDPOINTS.campaigns);
        const data = await resp.json();
        if (data.success) setCampaigns(data.data || []);
        else setCampaigns([]);
      } else {
        const resp = await fetch(API_ENDPOINTS.activeVerified);
        const data = await resp.json();
        if (data.success) setCampaigns(data.data || []);
        else setCampaigns([]);
      }
    } catch (err) {
      // keep empty list on error
      // eslint-disable-next-line no-console
      console.error("Error fetching campaigns", err);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (raised: string, goal: string) => {
    const raisedNum = parseFloat(raised) || 0;
    const goalNum = parseFloat(goal) || 0;
    return goalNum ? (raisedNum / goalNum) * 100 : 0;
  };

  const formatTimeRemaining = (deadline: number) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = deadline - now;
    const days = Math.floor(remaining / 86400);
    if (days > 0) return `${days} days left`;
    const hours = Math.floor(remaining / 3600);
    if (hours > 0) return `${hours} hours left`;
    return "Ending soon";
  };

  if (loading) {
    return (
      <Box bg="white" pt={{ base: 24, md: 28 }} pb={12}>
        <Center h="60vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="primary.500" thickness="4px" />
            <Text>Loading campaigns...</Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  const displayList =
    filter === "my" && account
      ? campaigns.filter((c) => c.creator?.toLowerCase() === account?.toLowerCase())
      : campaigns;

  return (
    <Box pt={{ base: 24, md: 28 }} pb={12} bg="white">
      <Container maxW="container.xl" px={{ base: 4, md: 8 }}>
        <VStack spacing={8} align="stretch">
          <VStack spacing={4} textAlign="center">
            <Heading size="2xl">Active Medical Campaigns</Heading>
            <Text fontSize="lg" color="gray.700" maxW="2xl">
              {filter === "my"
                ? "Your campaigns (ongoing and past)"
                : "All campaigns are AI-verified for authenticity. Your donation goes directly to those in need and earns you B3tr tokens."}
            </Text>
          </VStack>

          <HStack justify="center">
            <Button variant={filter === "all" ? "solid" : "ghost"} onClick={() => setFilter("all")}>
              All campaigns
            </Button>
            <Button variant={filter === "my" ? "solid" : "ghost"} onClick={() => setFilter("my")}>
              My campaigns
            </Button>
          </HStack>

          {displayList.length === 0 ? (
            <Center py={20}>
              <VStack spacing={4}>
                <Icon as={FaHeart} w={16} h={16} color="gray.700" />
                <Text fontSize="xl" color="gray.700">
                  No campaigns found
                </Text>
                <Button colorScheme="primary" onClick={() => navigate("/create")}>
                  Create the First Campaign
                </Button>
              </VStack>
            </Center>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {displayList.map((campaign) => (
                <Box
                  key={campaign.id}
                  bg={cardBg}
                  borderRadius="xl"
                  shadow="lg"
                  overflow="hidden"
                  transition="all 0.3s"
                  _hover={{ transform: "translateY(-4px)", shadow: "xl" }}
                  cursor="pointer"
                  onClick={() => navigate(`/campaigns/${campaign.id}`)}
                >
                  <Box p={6}>
                    <VStack align="stretch" spacing={4}>
                      <HStack justify="space-between">
                        <Badge colorScheme="green" display="flex" alignItems="center" gap={1}>
                          <Icon as={FaCheckCircle} />
                          AI Verified
                        </Badge>
                        <Text fontSize="sm" color="gray.500">
                          {formatTimeRemaining(campaign.deadline)}
                        </Text>
                      </HStack>

                      <Heading size="md" noOfLines={2}>
                        {campaign.title}
                      </Heading>

                      <Text color="muted-text" noOfLines={3} fontSize="sm">
                        {campaign.description}
                      </Text>

                      <VStack align="stretch" spacing={2}>
                        <Progress
                          value={calculateProgress(campaign.raisedAmount, campaign.goalAmount)}
                          colorScheme="primary"
                          borderRadius="full"
                          size="sm"
                        />

                        <HStack justify="space-between" fontSize="sm">
                          <Text fontWeight="bold" color="primary.600">
                            {campaign.raisedAmount} VET raised
                          </Text>
                          <Text color="gray.500">of {campaign.goalAmount} VET</Text>
                        </HStack>
                      </VStack>

                      <HStack justify="space-between" pt={2}>
                        <Text fontSize="sm" color="gray.600">
                          {campaign.donorCount} donors
                        </Text>
                        <Button
                          size="sm"
                          colorScheme="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/campaigns/${campaign.id}`);
                          }}
                        >
                          Donate Now
                        </Button>
                      </HStack>
                    </VStack>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>
    </Box>
  );
};
