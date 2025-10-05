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
  Alert,
  AlertIcon,
  
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@vechain/dapp-kit-react";
import { FaUpload, FaCheckCircle, FaTimes } from "react-icons/fa";
import { API_ENDPOINTS } from "../config/api";

export const CreateCampaign = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { account } = useWallet();
  // processing controls the unified Verify & Create flow
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [stepStatuses, setStepStatuses] = useState<Array<'pending'|'active'|'done'|'error'>>([
    'pending',
    'pending',
  ]);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: "",
    durationDays: "30",
  });

  const [medicalDocuments, setMedicalDocuments] = useState<string[]>([]);
  // no local cardBg needed in this component

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

  // Unified verify + create flow triggered by single button
  const handleVerifyAndCreate = async () => {
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

  // steps labels are implied in the UI; no separate var required
    setProcessing(true);
    setStepStatuses(['active', 'pending']);
    setCurrentStep(0);

    try {
      // Step 1: Verify
      const verifyResp = await fetch(API_ENDPOINTS.verifyDocuments, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicalDocuments }),
      });
      const verifyJson = await verifyResp.json();
      if (!verifyJson.success) {
        setStepStatuses(['error', 'pending']);
        setVerificationResult(verifyJson.data || null);
        toast({ title: "Verification failed", description: "AI verification failed", status: "error", duration: 5000 });
        setProcessing(false);
        return;
      }

      setVerificationResult(verifyJson.data);
      if (!verifyJson.data.isVerified) {
        setStepStatuses(['error', 'pending']);
        toast({ title: "Verification incomplete", description: verifyJson.data.reasoning || 'Documents did not pass AI verification', status: 'warning', duration: 6000 });
        setProcessing(false);
        return;
      }

      // mark verification done
      setStepStatuses(['done', 'active']);
      setCurrentStep(1);

      // Step 2: Create campaign
      const createResp = await fetch(API_ENDPOINTS.campaigns, {
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

      const createJson = await createResp.json();
      if (!createJson.success) {
        setStepStatuses(['done', 'error']);
        toast({ title: 'Creation failed', description: 'Failed to create campaign. Please try again', status: 'error', duration: 5000 });
        setProcessing(false);
        return;
      }

      setStepStatuses(['done', 'done']);
      toast({ title: 'Campaign Created!', description: `Your campaign has been created${createJson.data?.isVerified ? ' and verified' : ''}`, status: 'success', duration: 4000 });
      // small delay so user can see the final state
      setTimeout(() => {
        navigate(`/campaigns/${createJson.data.campaignId}`);
      }, 600);
    } catch (err: any) {
      setStepStatuses((s) => s.map((v, i) => (i === currentStep ? 'error' : v)));
      toast({ title: 'Error', description: err?.message || 'An error occurred', status: 'error', duration: 5000 });
    } finally {
      setProcessing(false);
      setCurrentStep(null);
    }
  };

  // submit is now handled by handleVerifyAndCreate

  return (
    <Box pt={{ base: 24, md: 28 }} pb={12} px={8}>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Heading size="2xl">Create Medical Campaign</Heading>
            <Text fontSize="lg" color="gray.700">
              Share your medical need with the world. Our AI will verify your
              documents to build trust with donors.
            </Text>
          </VStack>

          {/* Form */}
          <Box>
            <form onSubmit={(e) => e.preventDefault()}>
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
                        isDisabled={processing}
                      >
                        Upload Medical Documents
                        <Input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          hidden
                          onChange={handleFileUpload}
                          disabled={processing}
                        />
                      </Button>

                      {medicalDocuments.length > 0 && (
                        <Alert status="success">
                          <AlertIcon />
                          {medicalDocuments.length} document(s) uploaded
                        </Alert>
                      )}

                      {/* Stepper / progress visual for Verify & Create */}
                      <VStack spacing={2} align="stretch">
                        {['Verifying documents', 'Creating campaign'].map((label, idx) => {
                          const status = stepStatuses[idx];
                          return (
                            <Flex key={label} align="center" gap={3}>
                              <Box w={6} h={6} display="flex" alignItems="center" justifyContent="center">
                                {status === 'done' && <Icon as={FaCheckCircle} color="green.400" />}
                                {status === 'active' && <Spinner size="sm" color="primary.500" />}
                                {status === 'pending' && <Box w={3} h={3} borderRadius="full" bg="gray.300" />}
                                {status === 'error' && <Icon as={FaTimes} color="red.400" />}
                              </Box>
                              <Box>
                                <Text fontSize="sm" fontWeight={status === 'active' ? 'bold' : 'normal'}>
                                  {label}
                                </Text>
                                {status === 'error' && idx === 0 && verificationResult?.reasoning && (
                                  <Text fontSize="xs" color="red.400">{verificationResult.reasoning}</Text>
                                )}
                              </Box>
                            </Flex>
                          );
                        })}
                      </VStack>
                    </VStack>
                </FormControl>

                  {/* Unified Verify & Create Button */}
                  <Button
                    type="button"
                    colorScheme="primary"
                    size="lg"
                    onClick={handleVerifyAndCreate}
                    isDisabled={!account || processing}
                  >
                    {processing ? (
                      <HStack>
                        <Spinner size="sm" />
                        <Text>
                          {currentStep === 0 ? 'Verifying…' : currentStep === 1 ? 'Creating…' : 'Processing…'}
                        </Text>
                      </HStack>
                    ) : (
                      account ? 'Verify & Create Campaign' : 'Connect Wallet First'
                    )}
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
