import { Box, Container, HStack, Image, useColorModeValue } from "@chakra-ui/react";
import { ConnectWalletButton } from "./ConnectWalletButton";
export const Navbar = () => {
  const bg = useColorModeValue("rgba(255,255,255,0.72)", "rgba(10,10,10,0.6)");
  const borderColor = useColorModeValue("rgba(16,24,40,0.04)", "rgba(255,255,255,0.04)");
  return (
    <Box
      px={0}
      position={"sticky"}
      top={0}
      zIndex={10}
      py={4}
      h={"auto"}
      w={"full"}
      bg={bg}
      backdropFilter="saturate(180%) blur(8px)"
      style={{ WebkitBackdropFilter: "saturate(180%) blur(8px)" }}
      borderBottomWidth={1}
      borderBottomColor={borderColor}
    >
      <Container
        w="full"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems={"center"}
        maxW={"container.xl"}
      >
        <HStack flex={1} justifyContent={"start"}>
          <Image src="/vebetterdao-logo.svg" />
        </HStack>

        <HStack flex={1} spacing={4} justifyContent={"end"}>
          <ConnectWalletButton />
        </HStack>
      </Container>
    </Box>
  );
};
