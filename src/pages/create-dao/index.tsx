// @ts-nocheck comment
import React, { useState } from "react";
import ExistingTokenForm from "../../components/ExistingTokenForm/ExistingTokenForm";
import NewTokenForm from "../../components/NewTokenForm/NewTokenForm";
import {
  ChakraProvider,
  useColorModeValue,
  Box,
  Button,
  Text, // Import the Text component
} from "@chakra-ui/react";

const CreateDao = () => {
  const scheme = "teal";
  const [existingToken, setIsExistingToken] = useState(false);
  const [newToken, setNewToken] = useState(false);
  const [showBtn, setShowBtn] = useState(true);
  const scheme2 = "orange";
  const step1 = useColorModeValue("600", "300");
  const step2 = useColorModeValue("500", "400");
  const step3 = useColorModeValue("300", "500");
  const sizes = ["lg", "md", "sm", "xs"];

  return (
    <>
      {showBtn ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="80vh"
        >
          <Box width="50%">
            <Button
              width="45%"
              height="6.25rem"
              padding="4"
              colorScheme="teal"
              variant="solid"
              borderRadius="md"
              transition="background 0.8s"
              backgroundPosition="center"
              _hover={{
                bgColor: `${scheme}.${step2}`,
                bgGradient: `radial(circle, transparent 1%, ${scheme}.${step2} 1%)`,
                bgPos: "center",
                backgroundSize: "15000%",
              }}
              onClick={() => {
                setIsExistingToken(!existingToken);
                setShowBtn(false);
              }}
              _active={{
                bgColor: `${scheme}.${step3}`,
                backgroundSize: "100%",
                transition: "background 0s",
              }}
              marginRight="2%"
            >
              <Text fontSize="xl" fontWeight="bold">
                Import Existing Token
              </Text>
            </Button>
            <Button
              width="45%"
              height="6.25rem"
              padding="4"
              colorScheme="orange"
              variant="solid"
              borderRadius="md"
              transition="background 0.8s"
              backgroundPosition="center"
              _hover={{
                bgColor: `${scheme2}.${step2}`,
                bgGradient: `radial(circle, transparent 1%, ${scheme2}.${step2} 1%)`,
                bgPos: "center",
                backgroundSize: "15000%",
              }}
              onClick={() => {
                setNewToken(!newToken);
                setShowBtn(false);
              }}
              _active={{
                bgColor: `${scheme2}.${step3}`,
                backgroundSize: "100%",
                transition: "background 0s",
              }}
            >
              <Text fontSize="xl" fontWeight="bold">
                Create new Tokens
              </Text>
            </Button>
          </Box>
        </Box>
      ) : null}

      {existingToken ? <ExistingTokenForm /> : null}
      {newToken ? <NewTokenForm /> : null}
    </>
  );
};

export default CreateDao;
