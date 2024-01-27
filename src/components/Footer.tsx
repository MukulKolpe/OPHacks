// @ts-nocheck comment
import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react";
import { FaYoutube, FaGithub } from "react-icons/fa";
import { ReactNode } from "react";
import ScrollToTop from "react-scroll-to-top";

const SocialButton = ({ children, label, href }: any) => {
  return (
    <chakra.button
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue("white", "gray.800")}
      color={useColorModeValue("gray.700", "gray.200")}
      marginTop={"auto"}
    >
      <Container
        as={Stack}
        maxW={"6xl"}
        py={4}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
      >
        <b>
          <Text>Made with 💙 by Team Localhost</Text>
        </b>

        <Stack direction={"row"} spacing={6}>
          <SocialButton label={"GitHub"}>
            <a
              href="https://github.com/MukulKolpe/OPHacks"
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub />
            </a>
          </SocialButton>
        </Stack>
      </Container>
      <ScrollToTop
        smooth
        color="#39445a"
        style={{
          backgroundColor: "#fff",
          width: "40px",
          height: "40px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
      />
    </Box>
  );
}
