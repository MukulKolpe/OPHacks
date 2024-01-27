// @ts-nocheck comment
import { useState, useRef, useContext } from "react";
import { ParticleProvider } from "@particle-network/provider";
import { ethers } from "ethers";
import {
  Progress,
  Box,
  Radio,
  RadioGroup,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  GridItem,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  InputLeftAddon,
  InputGroup,
  Textarea,
  FormHelperText,
  InputRightElement,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Icon,
  Spinner,
  chakra,
  VisuallyHidden,
  Text,
  Stack,
  useToast,
  ring,
} from "@chakra-ui/react";
import userSideabi from "../../utils/usersideabi.json";
import creategovernanceabi from "../../utils/creategovernanceabi.json";

const Form2 = ({ getName, getSummary }) => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const handleName = (e) => {
    getName(e);
  };

  const handleSummary = (e) => {
    getSummary(e);
  };

  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
        DAO Registration
      </Heading>

      <FormControl mr="2%">
        <FormLabel htmlFor="name" fontWeight={"normal"}>
          DAO Name
        </FormLabel>
        <Input
          id="name"
          placeholder="Name"
          autoComplete="name"
          onChange={(e) => handleName(e.target.value)}
        />
      </FormControl>

      <FormControl mt="2%">
        <FormLabel htmlFor="email" fontWeight={"normal"}>
          Summary
        </FormLabel>
        <Textarea
          id="email"
          type="email"
          placeholder="Write a brief description about your community mission"
          autoComplete="email"
          onChange={(e) => handleSummary(e.target.value)}
        />
      </FormControl>
    </>
  );
};

const Form3 = ({ getJoiningThreshold, getProposal, getVisibility }) => {
  const toast = useToast();
  const inputRef = useRef(null);

  const handleTokens = (e) => {
    getJoiningThreshold(e);
  };

  const handleProposal = (e) => {
    getProposal(e);
  };

  const handleVisibility = (e) => {
    getVisibility(e);
  };

  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
        Governance Details
      </Heading>
      <SimpleGrid columns={1} spacing={6}>
        <FormControl mr="5%" mt="2%">
          <FormLabel htmlFor="yoe" fontWeight={"normal"}>
            Joining Threshold
          </FormLabel>
          <NumberInput
            step={1}
            min={1}
            onChange={(value) => handleTokens(value)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormHelperText>
            Enter minimum number of tokens required to join DAO
          </FormHelperText>
        </FormControl>
        <FormControl mr="5%" mt="2%">
          <FormLabel htmlFor="yoe" fontWeight={"normal"}>
            Proposal Threshold
          </FormLabel>
          <NumberInput
            step={1}
            min={1}
            onChange={(value) => handleProposal(value)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormHelperText>
            Enter minimum number of tokens required to create a proposal
          </FormHelperText>
        </FormControl>
        <FormControl mr="5%">
          <FormLabel htmlFor="first-name" fontWeight={"normal"}>
            Is DAO private ?
          </FormLabel>
          <RadioGroup defaultValue="2">
            <Stack spacing={5} direction="row">
              <Radio
                colorScheme="red"
                value="1"
                onChange={() => handleVisibility(false)}
              >
                No
              </Radio>
              <Radio
                colorScheme="green"
                value="2"
                onChange={() => handleVisibility(true)}
              >
                Yes
              </Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
      </SimpleGrid>
    </>
  );
};

const Form1 = ({ getTokenSymbol, getTokenName, getTokenSupply }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleSupply = (e) => {
    getTokenSupply(e);
  };

  const handleSymbol = (e) => {
    getTokenSymbol(e);
  };

  const handleTokenName = (e) => {
    getTokenName(e);
  };

  return (
    <>
      <Heading w="100%" textAlign="center" fontWeight="normal">
        Token Details
      </Heading>
      <SimpleGrid columns={1} spacing={6}>
        <FormControl mr="2%">
          <FormLabel htmlFor="tokenSymbol" fontWeight="normal">
            Token Symbol
          </FormLabel>

          <Input
            id="tokenSymbol"
            placeholder="Token Symbol"
            autoComplete="off"
            onChange={(e) => handleSymbol(e.target.value)}
          />
        </FormControl>
        <FormControl mr="2%">
          <FormLabel htmlFor="tokenName" fontWeight="normal">
            Token Name
          </FormLabel>

          <Input
            id="tokenName"
            placeholder="Token Name"
            autoComplete="off"
            onChange={(e) => handleTokenName(e.target.value)}
          />
        </FormControl>
        <FormControl mr="2%">
          <FormLabel htmlFor="tokenSymbol" fontWeight="normal">
            Token Supply
          </FormLabel>

          <Input
            id="tokenSymbol"
            placeholder="Token Supply"
            autoComplete="off"
            onChange={(e) => handleSupply(e.target.value)}
          />
        </FormControl>
      </SimpleGrid>
    </>
  );
};

export default function NewTokenForm() {
  const [progress, setProgress] = useState(33.33);
  const [step, setStep] = useState(1);
  const [mintDone, setMintDone] = useState(false);
  const [threshholdToken, setthreshholdToken] = useState();
  const [proposalToken, setProposalToken] = useState();
  const [desc, setdesc] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [tokenName, settokenName] = useState("");
  const [tokenSupply, setTokenSupply] = useState("");
  const [tokenAddress, settokenAddress] = useState("");
  const [daovisibility, setdaoVisibility] = useState(false);
  const toast = useToast();

  const mintToken = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const createTokenContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CREATE_GOVERNANACE_ADDRESS,
        creategovernanceabi,
        signer
      );
      const userSideContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_USERSIDE_ADDRESS,
        userSideabi,
        signer
      );
      const accounts = await provider.listAccounts();
      console.log(accounts[0]);

      const userId = await userSideContract.userWallettoUserId(accounts[0]);
      console.log(userId);

      console.log(tokenName);
      console.log(symbol);
      console.log(tokenSupply);

      const tx = await createTokenContract.deployToken(
        tokenName,
        symbol,
        tokenSupply,
        userId
      );
      await tx.wait();
      console.log(tx);
      const totalTokens = await createTokenContract.getTotalTokesnDeployed(
        userId
      );
      const mintedTokenAddress =
        await createTokenContract.userIdtoDeployedTokens(
          userId,
          totalTokens - 1
        );

      settokenAddress(mintedTokenAddress);
      toast({
        title: "Tokens Minted",
        description: `Token Address: ${mintedTokenAddress}`,
        status: "success",
        duration: 10000,
        isClosable: true,
      });
      setMintDone(true);
    } else {
      const particleProvider = new ParticleProvider(particle.auth);
      const accounts = await particleProvider.request({
        method: "eth_accounts",
      });
      const ethersProvider = new ethers.providers.Web3Provider(
        particleProvider,
        "any"
      );
      const signer = ethersProvider.getSigner();

      const createTokenContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CREATE_GOVERNANACE_ADDRESS,
        creategovernanceabi,
        signer
      );
      const userSideContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_USERSIDE_ADDRESS,
        userSideabi,
        signer
      );

      const userId = await userSideContract.userWallettoUserId(accounts[0]);

      const tx = await createTokenContract.deployToken(
        tokenName,
        symbol,
        tokenSupply,
        userId
      );

      await tx.wait();

      const totalTokens = await createTokenContract.getTotalTokesnDeployed(
        userId
      );
      const mintedTokenAddress =
        await createTokenContract.userIdtoDeployedTokens(
          userId,
          totalTokens - 1
        );

      settokenAddress(mintedTokenAddress);
      toast({
        title: "Tokens Minted",
        description: `Token Address: ${mintedTokenAddress}`,
        status: "success",
        duration: 10000,
        isClosable: true,
      });
      setMintDone(true);
    }
  };

  const createDAO = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_USERSIDE_ADDRESS,
        userSideabi,
        signer
      );

      const accounts = await provider.listAccounts();

      const tx = await contract.createDao(
        name,
        desc,
        threshholdToken,
        proposalToken,
        tokenAddress,
        daovisibility,
        accounts[0]
      );

      console.log(tx);
    } else {
      const particleProvider = new ParticleProvider(particle.auth);
      const accounts = await particleProvider.request({
        method: "eth_accounts",
      });
      const ethersProvider = new ethers.providers.Web3Provider(
        particleProvider,
        "any"
      );
      const signer = ethersProvider.getSigner();

      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_USERSIDE_ADDRESS,
        userSideabi,
        signer
      );

      const tx = await contract.createDao(
        name,
        desc,
        threshholdToken,
        proposalToken,
        tokenAddress,
        daovisibility,
        accounts[0]
      );

      console.log(tx);
    }
  };

  return (
    <Box
      borderWidth="1px"
      rounded="lg"
      shadow="1px 1px 3px rgba(0,0,0,0.3)"
      width="60%"
      p={6}
      m="10px auto"
      as="form"
    >
      <Progress
        hasStripe
        value={progress}
        mb="5%"
        mx="5%"
        isAnimated
      ></Progress>
      {step === 1 ? (
        <Form1
          getTokenSymbol={(q) => setSymbol(q)}
          getTokenName={(q) => settokenName(q)}
          getTokenSupply={(q) => setTokenSupply(q)}
        />
      ) : step === 2 ? (
        <Form2 getName={(q) => setName(q)} getSummary={(q) => setdesc(q)} />
      ) : (
        <Form3
          getJoiningThreshold={(q) => setthreshholdToken(q)}
          getProposal={(q) => setProposalToken(q)}
          getVisibility={(q) => setdaoVisibility(q)}
        />
      )}
      <ButtonGroup mt="5%" w="100%">
        <Flex w="100%" justifyContent="space-between">
          <Flex>
            {step === 1 ? (
              <Button
                onClick={() => {
                  mintToken();
                }}
                colorScheme="teal"
                variant="solid"
                w="7rem"
                mr="5%"
              >
                Mint
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setStep(step - 1);
                  setProgress(progress - 33.33);
                }}
                colorScheme="teal"
                variant="solid"
                w="7rem"
                mr="5%"
              >
                Back
              </Button>
            )}
            <Button
              w="7rem"
              isDisabled={step === 3 || (step === 1 && !mintDone)}
              onClick={() => {
                setStep(step + 1);
                if (step === 3) {
                  setProgress(100);
                } else {
                  setProgress(progress + 33.33);
                }
              }}
              colorScheme="teal"
              variant="outline"
            >
              Next
            </Button>
          </Flex>
          {step === 3 ? (
            <Button
              w="7rem"
              colorScheme="red"
              variant="solid"
              onClick={() => {
                createDAO();
              }}
            >
              Submit
            </Button>
          ) : null}
        </Flex>
      </ButtonGroup>
    </Box>
  );
}
