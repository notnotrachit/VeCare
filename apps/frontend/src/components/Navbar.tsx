import { Box, Container, HStack, Image, useColorModeValue } from "@chakra-ui/react";
import { ConnectWalletButton } from "./ConnectWalletButton";
export const Navbar = () => {
  // use the theme primary blue for a clearer, trustful navbar
  const bg = useColorModeValue("primary.50", "primary.50");
  const borderColor = useColorModeValue("primary.50", "primary.50");
  const textColor = useColorModeValue("white", "white");
  return (
    <Box
      px={0}
      position={"fixed"}
      top={0}
      zIndex={20}
      py={2}
      h={"64px"}
      w={"full"}
      bg={bg}
      color={textColor}
      backdropFilter="saturate(120%) blur(6px)"
      style={{ WebkitBackdropFilter: "saturate(120%) blur(6px)" }}
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
          <Image src="/vebetterdao-logo.svg" width={140}/>
        </HStack>

        <HStack flex={1} spacing={4} justifyContent={"end"}>
          <ConnectWalletButton />
        </HStack>
      </Container>
    </Box>
  );
};
