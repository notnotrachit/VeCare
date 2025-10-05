import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  HStack,
  Icon,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@vechain/dapp-kit-react";
import { FaUpload } from "react-icons/fa";
import { API_ENDPOINTS } from "../config/api";

export const CreateCampaign = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { account } = useWallet();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: "",
    durationDays: "30",
  });

  const [medicalDocuments, setMedicalDocuments] = useState<string[]>([]);
  const cardBg = useColorModeValue("white", "gray.800");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setMedicalDocuments((prev) => [...prev, base64]);
      };
      reader.readAsDataURL(file);
    });
  };

  const verifyDocuments = async () => {
    if (medicalDocuments.length === 0) {
      toast({
        title: "No documents",
        description: "Please upload medical documents first",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    setVerifying(true);
    try {
      const response = await fetch(API_ENDPOINTS.verifyDocuments, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicalDocuments }),
      });

      const data = await response.json();
      if (data.success) {
        setVerificationResult(data.data);
        toast({
          title: data.data.isVerified ? "Documents Verified!" : "Verification Failed",
          description: data.data.reasoning,
          status: data.data.isVerified ? "success" : "error",
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "Failed to verify documents. Please try again.",
        status: "error",
        duration: 3000,
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a campaign",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    if (medicalDocuments.length === 0) {
      toast({
        title: "Documents required",
        description: "Please upload medical documents",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.campaigns, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          goalAmount: formData.goalAmount,
          durationDays: parseInt(formData.durationDays),
          medicalDocuments,
          creatorAddress: account,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Campaign Created!",
          description: `Your campaign has been created${
            data.data.isVerified ? " and verified" : ""
          }`,
          status: "success",
          duration: 5000,
        });
        navigate(`/campaigns/${data.data.campaignId}`);
      } else {
        throw new Error("Failed to create campaign");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box py={12}>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Heading size="2xl">Create Medical Campaign</Heading>
            <Text fontSize="lg" color="muted-text">
              Share your medical need with the world. Our AI will verify your
              documents to build trust with donors.
            </Text>
          </VStack>

          {/* Form */}
          <Box bg={cardBg} p={8} borderRadius="xl" shadow="lg">
            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Campaign Title</FormLabel>
                  <Input
                    placeholder="e.g., Help Sarah Fight Cancer"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    placeholder="Tell your story... (minimum 50 characters)"
                    rows={6}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    {formData.description.length} characters
                  </Text>
                </FormControl>

                <HStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Goal Amount (VET)</FormLabel>
                    <Input
                      type="number"
                      placeholder="1000"
                      value={formData.goalAmount}
                      onChange={(e) =>
                        setFormData({ ...formData, goalAmount: e.target.value })
                      }
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Duration (Days)</FormLabel>
                    <Input
                      type="number"
                      placeholder="30"
                      value={formData.durationDays}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          durationDays: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                </HStack>

                {/* Medical Documents Upload */}
                <FormControl isRequired>
                  <FormLabel>Medical Documents</FormLabel>
                  <VStack spacing={4} align="stretch">
                    <Button
                      as="label"
                      htmlFor="file-upload"
                      leftIcon={<Icon as={FaUpload} />}
                      variant="outline"
                      cursor="pointer"
                    >
                      Upload Medical Documents
                      <Input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={handleFileUpload}
                      />
                    </Button>

                    {medicalDocuments.length > 0 && (
                      <Alert status="success">
                        <AlertIcon />
                        {medicalDocuments.length} document(s) uploaded
                      </Alert>
                    )}

                    {medicalDocuments.length > 0 && !verificationResult && (
                      <Button
                        onClick={verifyDocuments}
                        isLoading={verifying}
                        loadingText="Verifying with AI..."
                        colorScheme="green"
                        variant="outline"
                      >
                        Verify Documents with AI
                      </Button>
                    )}

                    {verificationResult && (
                      <Alert
                        status={verificationResult.isVerified ? "success" : "warning"}
                      >
                        <AlertIcon />
                        <Box>
                          <AlertTitle>
                            {verificationResult.isVerified
                              ? "Documents Verified!"
                              : "Verification Incomplete"}
                          </AlertTitle>
                          <AlertDescription>
                            {verificationResult.reasoning}
                          </AlertDescription>
                          <Text fontSize="sm" mt={2}>
                            Confidence: {(verificationResult.confidenceScore * 100).toFixed(0)}%
                          </Text>
                        </Box>
                      </Alert>
                    )}
                  </VStack>
                </FormControl>

                {/* Submit Button */}
                <Button
                  type="submit"
                  colorScheme="primary"
                  size="lg"
                  isLoading={loading}
                  loadingText="Creating Campaign..."
                  isDisabled={!account}
                >
                  {account ? "Create Campaign" : "Connect Wallet First"}
                </Button>

                <Text fontSize="sm" color="gray.500" textAlign="center">
                  By creating a campaign, you agree to our terms and conditions.
                  A 2.5% platform fee applies to all funds raised.
                </Text>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};
