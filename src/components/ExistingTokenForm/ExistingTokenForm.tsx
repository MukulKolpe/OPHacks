// @ts-nocheck comment
import { useState, useRef, useContext } from "react";
import { ParticleProvider } from "@particle-network/provider";
import { ethers } from "ethers";
import userSideabi from "../../utils/usersideabi.json";
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

const Form1 = ({ getName, getSummary }) => {
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

const Form2 = ({ getJoiningThreshold, getProposal, getVisibility }) => {
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

const Form3 = ({ getTokenAddress }) => {
  const toast = useToast();
  const inputRef = useRef(null);
  const [tokenDetails, setTokenDetails] = useState({ symbol: "", name: "" });
  const [loading, setLoading] = useState(false);

  const handleAddress = async (e) => {
    const address = e.target.value;

    if (address.trim()) {
      setLoading(true);

      try {
        // Call a function to fetch token details based on the address
        const { symbol, name } = await fetchTokenDetails(address);

        // Update state with the fetched data
        setTokenDetails({ symbol, name });
      } catch (error) {
        console.error("Error fetching token details:", error);
        toast({
          title: "Error",
          description: "Unable to fetch token details",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    } else {
      toast({
        title: "Error",
        description: "Token Address Not Entered correctly",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    getTokenAddress(address);
  };

  const fetchTokenDetails = async (address) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL
      );
      // Use your Ethereum provider
      const contract = new ethers.Contract(
        address,
        [
          "function symbol() view returns (string)",
          "function name() view returns (string)",
        ],
        provider
      );

      // Call the ERC-20 token contract to get the symbol and name
      const symbol = await contract.symbol();
      const name = await contract.name();

      return { symbol, name };
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <Heading w="100%" textAlign="center" fontWeight="normal">
        Token Details
      </Heading>
      <SimpleGrid columns={1} spacing={6}>
        <FormControl mr="2%">
          <FormLabel htmlFor="tokenAddress" fontWeight="normal">
            Token Address
          </FormLabel>

          <Input
            id="tokenAddress"
            placeholder="Enter Token Address"
            autoComplete="off"
            onChange={(e) => handleAddress(e)}
          />
        </FormControl>
        <FormControl mr="2%">
          <FormLabel htmlFor="tokenSymbol" fontWeight="normal">
            Token Symbol
          </FormLabel>
          <InputGroup>
            <Input
              id="tokenSymbol"
              placeholder="Token Symbol"
              autoComplete="off"
              value={loading ? "Loading..." : tokenDetails.symbol}
              readOnly
            />
            {loading && (
              <InputRightElement>
                <Spinner size="sm" />
              </InputRightElement>
            )}
          </InputGroup>
        </FormControl>
        <FormControl mr="2%">
          <FormLabel htmlFor="tokenName" fontWeight="normal">
            Token Name
          </FormLabel>
          <InputGroup>
            <Input
              id="tokenName"
              placeholder="Token Name"
              autoComplete="off"
              value={loading ? "Loading..." : tokenDetails.name}
              readOnly
            />
            {loading && (
              <InputRightElement>
                <Spinner size="sm" />
              </InputRightElement>
            )}
          </InputGroup>
        </FormControl>
      </SimpleGrid>
    </>
  );
};

export default function ExistingTokenForm() {
  const toast = useToast();
  const [progress, setProgress] = useState(33.33);
  const inputRef = useRef(null);
  const [name, setName] = useState("");
  const [step, setStep] = useState(1);
  const [threshholdToken, setthreshholdToken] = useState();
  const [proposalToken, setProposalToken] = useState();
  const [desc, setdesc] = useState("");
  const [tokenAddress, settokenAddress] = useState("");
  const [daovisibility, setdaoVisibility] = useState(false);

  const craeteDAO = async () => {
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
        <Form1 getName={(q) => setName(q)} getSummary={(q) => setdesc(q)} />
      ) : step === 2 ? (
        <Form2
          getJoiningThreshold={(q) => setthreshholdToken(q)}
          getProposal={(q) => setProposalToken(q)}
          getVisibility={(q) => setdaoVisibility(q)}
        />
      ) : (
        <Form3 getTokenAddress={(q) => settokenAddress(q)} />
      )}
      <ButtonGroup mt="5%" w="100%">
        <Flex w="100%" justifyContent="space-between">
          <Flex>
            <Button
              onClick={() => {
                setStep(step - 1);
                setProgress(progress - 33.33);
              }}
              isDisabled={step === 1}
              colorScheme="teal"
              variant="solid"
              w="7rem"
              mr="5%"
            >
              Back
            </Button>
            <Button
              w="7rem"
              isDisabled={step === 3}
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
                craeteDAO();
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
