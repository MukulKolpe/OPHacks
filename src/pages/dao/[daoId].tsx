// @ts-nocheck comment
import React, { useEffect, useState } from "react";
import { ParticleProvider } from "@particle-network/provider";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import usersideabi from "../../utils/usersideabi.json";
import { FaExternalLinkAlt } from "react-icons/fa";
import {
  FormHelperText,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Textarea,
  Heading,
  useToast,
  Avatar,
  Center,
  Image,
  Flex,
  Text,
  Stack,
  Box,
  Link,
  useColorModeValue,
  FormControl,
  FormLabel,
  Icon,
  Input,
  VisuallyHidden,
  chakra,
  Grid,
  GridItem,
  Tooltip,
  VStack,
  Divider,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  TabPanels,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Radio,
  RadioGroup,
  Select,
} from "@chakra-ui/react";
import UserSideAbi from "../../utils/usersideabi.json";
import GovernanceTokenAbi from "../../utils/governancetokenabi.json";

const index = () => {
  const router = useRouter();
  const account = useAccount();
  const [isMember, setIsMember] = useState(false);
  const [size, setSize] = useState("md");
  const [propSignal, setPropSignal] = useState(false);
  const [daoInfo, setDaoInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [daoProposals, setDaoProposals] = useState([]);
  const [daoMembers, setDaoMembers] = useState([]);
  const [tokenAddress, setTokenAddress] = useState("");
  const [totalMembers, setTotalMembers] = useState(0);
  const [voteOnce, setvoteOnce] = useState(true);
  const [adminInfo, setAdminInfo] = useState();
  const [votingthreshold, setVotingThreshold] = useState();
  const [proposalArray, setProposalArray] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState();
  const [passingThreshold, setPassingThreshold] = useState();
  const { address } = useAccount();
  const [proposalType, setProposalType] = useState();
  const [proposalForVote, setProposalForVote] = useState(0);
  const [userResponse, setUserResponse] = useState(-1);
  const [yesVotes, setYesVotes] = useState([]);
  const [noVotes, setNoVotes] = useState([]);
  const [abstainVotes, setAbstainVotes] = useState([]);

  const [endTime, setEndTime] = useState();
  const [finalVerdict, setFinalVerdict] = useState("");

  const toast = useToast();

  const convertString = (dateString: any) => {
    const date = new Date(dateString);
    const millisecondsSinceEpoch = date.getTime() / 1000;
    return millisecondsSinceEpoch;
  };

  const convertToEpoch = (dateString: any) => {
    const epochValue = new Date(dateString + "T00:00:00Z").getTime() / 1000;
    return epochValue;
  };

  // add proposal
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();

  // to vote
  const {
    isOpen: isVoteOpen,
    onOpen: onVoteOpen,
    onClose: onVoteClose,
  } = useDisclosure();

  //add new member to dao
  const {
    isOpen: isStartOpen,
    onOpen: onStartOpen,
    onClose: onStartClose,
  } = useDisclosure();

  //view results
  const {
    isOpen: isEndOpen,
    onOpen: onEndOpen,
    onClose: onEndClose,
  } = useDisclosure();

  const handleSizeClick1 = (newSize) => {
    setSize(newSize);
    onAddOpen();
  };

  const handleSizeClick2 = (newSize) => {
    setSize(newSize);
    onVoteOpen();
  };

  const handleSizeClick3 = (newSize) => {
    setSize(newSize);
    onStartOpen();
  };

  const handleSizeClick4 = (newSize) => {
    setSize(newSize);
    onEndOpen();
  };

  const onLoad = async () => {
    const daoId = router.query.daoId;
    if (daoId) {
      if (window.ethereum._state.accounts.length !== 0) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const userSideInstance = new ethers.Contract(
          process.env.NEXT_PUBLIC_USERSIDE_ADDRESS,
          usersideabi,
          signer
        );
        console.log(userSideInstance);
        const tempDaoInfo = await userSideInstance.daoIdtoDao(daoId);
        setDaoInfo(tempDaoInfo);
        const tempDaoMembers = await userSideInstance.getAllDaoMembers(daoId);
        console.log(tempDaoMembers);
        setTotalMembers(tempDaoMembers.length);
        const tempDaoProposals = await userSideInstance.getAllDaoProposals(
          daoId
        );
        console.log(tempDaoProposals);
        const membershipSignal = await userSideInstance.checkMembership(
          daoId,
          account.address
        );
        setIsMember(membershipSignal);
        console.log("Membership signal: " + membershipSignal);
        setLoading(false);
        console.log("Dao Status: " + tempDaoInfo.isPrivate);
        const tempAdminId = await tempDaoInfo.creator;
        const tempAdminInfo = await userSideInstance.userIdtoUser(tempAdminId);
        console.log(tempAdminInfo);
        setAdminInfo(tempAdminInfo);
      }
    }
  };

  const authorizeContract = async () => {
    if (window?.ethereum?._state?.accounts?.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userSideInstance = new ethers.Contract(
        process.env.NEXT_PUBLIC_USERSIDE_ADDRESS,
        usersideabi,
        signer
      );
      console.log(userSideInstance);
      const accounts = await provider.listAccounts();
      const propInfo = await userSideInstance.proposalIdtoProposal(
        proposalForVote
      );
      const govTokenAdd = propInfo.votingTokenAddress;
      var minThreshold = propInfo.votingThreshold;
      const govTokenContract = new ethers.Contract(
        govTokenAdd,
        GovernanceTokenAbi,
        signer
      );
      const tokenSymbol = await govTokenContract.symbol();
      console.log(tokenSymbol);
      const tx = await govTokenContract.approve(
        process.env.NEXT_PUBLIC_USERSIDE_ADDRESS,
        minThreshold
      );
      await tx.wait();
      toast({
        title: "Congrats! Transaction Complete",
        description: `Your vote will be counted soon.`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      const tx2 = await userSideInstance.voteForProposal(
        proposalForVote,
        userResponse,
        account.address
      );
      await tx2.wait();
      toast({
        title: "Congrats.",
        description: `Your vote has been counted.`,
        status: "success",
        duration: 10000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    onLoad();
  }, [router]);

  console.log(proposalArray);

  const loadAllProposals = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userSideContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_USERSIDE_ADDRESS,
        UserSideAbi,
        signer
      );

      const totalProposals = Number(
        await userSideContract.getAllDaoProposals(BigInt(daoInfo.daoId))
      );
      let tempProposalId,
        tempProposalInfo,
        governanceTokenContract,
        tokenSymbol,
        tokenName;
      let tempProposalArray = await userSideContract.getAllDaoProposals(
        daoInfo.daoId
      );

      console.log(tempProposalArray);
      for (let i = 0; i < tempProposalArray.length; i++) {
        tempProposalInfo = await userSideContract.proposalIdtoProposal(
          tempProposalArray[i]
        );
        console.log(tempProposalInfo);

        governanceTokenContract = new ethers.Contract(
          tempProposalInfo.votingTokenAddress,
          GovernanceTokenAbi,
          signer
        );
        tokenSymbol = await governanceTokenContract.symbol();
        tokenName = await governanceTokenContract.name();
        console.log(tokenSymbol);
        console.log(tokenName);
        console.log(tempProposalInfo);
        setProposalArray((prevState) => [
          ...prevState,
          {
            proposalInfo: tempProposalInfo,
            tokenName: tokenName,
            tokenSymbol: tokenSymbol,
          },
        ]);
      }
      // for (let i = 0; i < totalProposals; i++) {
      //   tempProposalInfo = await userSideContract.proposalIdtoproposal(
      //     tempProposalId
      //   );
      //   governanceTokenContract = new ethers.Contract(
      //     tempProposalInfo.governanceTokenAddress,
      //     GovernanceTokenAbi,
      //     signer
      //   );
      //   tokenSymbol = await governanceTokenContract.symbol();
      //   tokenName = await governanceTokenContract.name();
      //   console.log(tokenSymbol);
      //   console.log(tokenName);
      //   console.log(tempProposalInfo);
      //   setProposalArray((prevState) => [
      //     ...prevState,
      //     {
      //       proposalInfo: tempProposalInfo,
      //       tokenName: tokenName,
      //       tokenSymbol: tokenSymbol,
      //     },
      //   ]);
      // }
      setPropSignal(true);
    }
  };

  const addProposal = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const userSideContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_USERSIDE_ADDRESS,
      UserSideAbi,
      signer
    );

    console.log(title);
    console.log(description);
    console.log(votingthreshold);
    console.log(daoInfo.daoId.toString());
    console.log(tokenAddress);
    console.log(address);
    console.log(startDate);
    console.log(endTime);
    console.log(passingThreshold);
    console.log(voteOnce);
    console.log(daoInfo);

    const tx = await userSideContract.createProposal(
      proposalType,
      title + "|" + description,
      votingthreshold,
      daoInfo.daoId,
      tokenAddress,
      address,
      startDate,
      endTime,
      passingThreshold,
      voteOnce
    );

    await tx.wait();

    toast({
      title: "Proposal Created",
      description: "Your proposal has been created",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const convertTimeToEpoch = async () => {
    var now = new Date();
    var timestamp = now.getTime();
    var secondsSinceEpoch = timestamp / 1000;
    return secondsSinceEpoch;
  };

  let now1 = new Date();
  let timestamp1 = now1.getTime();
  let currentTimestamp = timestamp1 / 1000;

  const filteringDaos = (beginningTime, endingTime) => {
    var now = new Date();
    var timestamp = now.getTime();
    var secondsSinceEpoch = timestamp / 1000;
    console.log(beginningTime);
    if (secondsSinceEpoch < Number(beginningTime)) {
      //to be happening in future
      return -1;
    }
    if (secondsSinceEpoch > Number(endingTime)) {
      //to have happened in past
      return 1;
    }
    return 0;
  };

  const getVotingResults = async (_proposalId) => {
    if (window?.ethereum?._state?.accounts?.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userSideInstance = new ethers.Contract(
        process.env.NEXT_PUBLIC_USERSIDE_ADDRESS,
        UserSideAbi,
        signer
      );
      //const accounts = await provider.listAccounts();
      const yesArray = await userSideInstance.getAllYesVotes(_proposalId);
      const noArray = await userSideInstance.getAllNoVotes(_proposalId);
      const abstainArray = await userSideInstance.getAllAbstainVotes(
        _proposalId
      );
      const totalArray = await userSideInstance.getAllVoters(_proposalId);
      const yesPercentage =
        (yesArray.length /
          (yesArray.length + noArray.length + abstainArray.length)) *
        100;
      console.log(yesPercentage);
      setYesVotes(yesArray);
      setNoVotes(noArray);
      setAbstainVotes(abstainArray);
      const propInfo = await userSideInstance.proposalIdtoProposal(
        proposalForVote
      );
      const winnningThresold = Number(propInfo.passingThreshold);
      if (yesPercentage >= winnningThresold) {
        setFinalVerdict("Proposal has Passed!");
      } else {
        setFinalVerdict("Proposal has been reverted");
      }
    }
  };

  if (loading) {
    return <Center>Loading...</Center>;
  }

  if (daoInfo.isPrivate && !isMember) {
    return <Center>You are not the member of this DAO.</Center>;
  }

  console.log(voteOnce);

  return (
    <div>
      <Box
        maxW="800px"
        mx="auto"
        my={6}
        p={4}
        bg="teal"
        boxShadow="lg"
        borderRadius="md"
      >
        <Heading as="h2" fontSize="xl" fontWeight="bold" mb={4}>
          DAO Details
        </Heading>
        <Text fontSize="md" fontWeight="bold" mb={2}>
          This is DAO number: {Number(daoInfo.daoId)}
        </Text>
        <Text fontSize="md" fontWeight="bold" mb={2}>
          DAO Name: {daoInfo.daoName}
        </Text>
        <Text fontSize="md" fontWeight="bold" mb={2}>
          DAO Description: {daoInfo.daoDescription}
        </Text>
        <Text fontSize="md" fontWeight="bold" mb={2}>
          DAO Governance Token: {daoInfo.governanceTokenAddress}
        </Text>
        <Text fontSize="md" fontWeight="bold" mb={2}>
          Total Members: {totalMembers}
        </Text>
        <Text fontSize="md" fontWeight="bold" mb={2}>
          Creator Name and Wallet Address: {adminInfo?.userName} -{" "}
          {adminInfo?.userWallet}
        </Text>

        {isMember && (
          <Button
            mt="2%"
            m={2}
            onClick={() => handleSizeClick1("xl")}
            colorScheme="teal"
          >
            Add Proposal
          </Button>
        )}

        {adminInfo?.userWallet === address && (
          <Button
            mt="2%"
            m={2}
            onClick={() => handleSizeClick3("xl")}
            colorScheme="teal"
          >
            Add Member
          </Button>
        )}
      </Box>
      <Divider mt={12} mb={12} />
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(2, 1fr)",
        }}
        gap={4}
      >
        <GridItem colSpan={3}>
          <VStack alignItems="flex-start" spacing="20px">
            <Center>
              <chakra.h2 fontSize="3xl" fontWeight="700" ml={2}>
                All proposals
              </chakra.h2>
            </Center>
          </VStack>
        </GridItem>
      </Grid>
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          sm: "repeat(1, 1fr)",
          md: "repeat(1, 1fr)",
        }}
        gap={4}
      >
        <GridItem colSpan={3}>
          {propSignal ? (
            <Tabs>
              <TabList>
                <Tab>Ongoing</Tab>
                <Tab>Upcoming</Tab>
                <Tab>Past</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  {proposalArray
                    .filter(
                      (proposal) =>
                        filteringDaos(
                          proposal.proposalInfo.beginningTime,
                          proposal.proposalInfo.endingTime
                        ) == 0
                    )
                    .map((proposal) => (
                      <Box
                        p={4}
                        borderWidth="1px"
                        borderRadius="lg"
                        position="relative"
                      >
                        <Heading size="sm">
                          {proposal.proposalInfo[2].substring(
                            0,
                            proposal.proposalInfo[2].indexOf("|")
                          )}
                        </Heading>
                        <Text mt={2}>
                          {proposal.proposalInfo[2].substring(
                            proposal.proposalInfo[2].indexOf("|") + 1,
                            proposal.proposalInfo[2].length
                          )}
                        </Text>

                        <Flex mt={3}>
                          <span mb={4} h={6}>
                            {" "}
                            ⚠️
                          </span>
                          <h3 mt={10}>
                            {Math.floor(
                              (proposal.proposalInfo.endingTime.toString() -
                                currentTimestamp) /
                                3600
                            )}{" "}
                            hrs remaining
                          </h3>
                        </Flex>
                        {isMember ? (
                          <Button
                            onClick={() => {
                              setProposalForVote(
                                Number(proposal.proposalInfo.proposalId)
                              );
                              handleSizeClick2();
                            }}
                            mt={4}
                            colorScheme="teal"
                          >
                            Vote Now
                          </Button>
                        ) : null}
                      </Box>
                    ))}
                </TabPanel>
                <TabPanel>
                  {proposalArray
                    .filter(
                      (proposal) =>
                        filteringDaos(
                          proposal.proposalInfo.beginningTime,
                          proposal.proposalInfo.endingTime
                        ) == -1
                    )
                    .map((proposal) => (
                      <Box
                        p={4}
                        borderWidth="1px"
                        borderRadius="lg"
                        position="relative"
                      >
                        <Heading size="sm">
                          {proposal.proposalInfo[2].substring(
                            0,
                            proposal.proposalInfo[2].indexOf("|")
                          )}
                        </Heading>
                        <Text mt={2}>
                          {proposal.proposalInfo.beginningTime.toString()}
                        </Text>
                        <Text mt={2}>
                          {proposal.proposalInfo[2].substring(
                            proposal.proposalInfo[2].indexOf("|") + 1,
                            proposal.proposalInfo[2].length
                          )}
                        </Text>

                        <Flex mt={3}>
                          <span mb={4} h={6}>
                            {" "}
                            ⚠️
                          </span>
                          <h3 mt={10} ml={4}>
                            {" "}
                            {Math.floor(
                              (proposal.proposalInfo.beginningTime -
                                currentTimestamp) /
                                3600
                            )}{" "}
                            hrs to start voting
                          </h3>
                        </Flex>
                      </Box>
                    ))}
                </TabPanel>
                <TabPanel>
                  {proposalArray
                    .filter(
                      (proposal) =>
                        filteringDaos(
                          proposal.proposalInfo.beginningTime,
                          proposal.proposalInfo.endingTime
                        ) == 1
                    )
                    .map((proposal) => (
                      <Box
                        p={4}
                        borderWidth="1px"
                        borderRadius="lg"
                        position="relative"
                      >
                        <Heading size="sm">
                          {proposal.proposalInfo[2].substring(
                            0,
                            proposal.proposalInfo[2].indexOf("|")
                          )}
                        </Heading>
                        <Text mt={2}>
                          {proposal.proposalInfo[2].substring(
                            proposal.proposalInfo[2].indexOf("|") + 1,
                            proposal.proposalInfo[2].length
                          )}
                        </Text>
                        {proposal.proposalInfo.endingTime.toString()}
                        <Flex mt={3}>
                          <span mb={4} h={6}>
                            {" "}
                            ⚠️
                          </span>
                          <h3 mt={10}>
                            Expired{" "}
                            {Math.floor(
                              (currentTimestamp -
                                proposal.proposalInfo.endingTime.toString()) /
                                3600
                            )}{" "}
                            hrs ago
                          </h3>
                        </Flex>

                        <Button
                          onClick={() => {
                            getVotingResults(
                              Number(proposal.proposalInfo.proposalId)
                            );
                            handleSizeClick4();
                          }}
                          mt={4}
                          colorScheme="teal"
                        >
                          View Results
                        </Button>
                      </Box>
                      // <Tr>
                      //   <Td>
                      //     {Number(proposal.proposalInfo.proposalId)}
                      //   </Td>
                      //   <Td>{proposal.proposalInfo.proposalTitle}</Td>
                      //   <Td>
                      //     {proposal.proposalInfo.proposalDesription}
                      //   </Td>
                      //   <Td>{proposal.tokenName}</Td>
                      //   <Td>
                      //     {Number(proposal.proposalInfo.votingThreshold)}{" "}
                      //     {proposal.tokenSymbol}
                      //   </Td>
                      //   <Td>
                      //     {proposal.proposalInfo.governanceTokenAddress}
                      //   </Td>
                      //   <Td>
                      //     <Button
                      //       onClick={() => {
                      //         getVotingResults(
                      //           Number(proposal.proposalInfo.proposalId)
                      //         );
                      //         handleSizeClick4();
                      //       }}
                      //     >
                      //       View Results
                      //     </Button>
                      //   </Td>
                      // </Tr>
                    ))}
                </TabPanel>
              </TabPanels>
            </Tabs>
          ) : (
            <Center>
              <Button mt={6} onClick={loadAllProposals}>
                Load Proposals
              </Button>
            </Center>
          )}
        </GridItem>
      </Grid>

      <Modal isOpen={isAddOpen} onClose={onAddClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Proposal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mr="5%" isRequired>
              <FormLabel htmlFor="subject" fontWeight={"normal"}>
                Proposal Title
              </FormLabel>
              <Input
                id="subject"
                placeholder="Enter Proposal Title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>
            <FormControl mt={1} isRequired>
              <FormLabel
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: "gray.50",
                }}
              >
                Proposal Description
              </FormLabel>
              <Textarea
                placeholder="Write a short description for proposal"
                rows={3}
                shadow="sm"
                focusBorderColor="brand.400"
                fontSize={{
                  sm: "sm",
                }}
                onChange={(e) => setDescription(e.target.value)}
              />
              <FormHelperText>Short desc. URLs are hyperlinked.</FormHelperText>
            </FormControl>
            <FormControl mr="2%" mt="2%" isRequired>
              <FormLabel htmlFor="name" fontWeight={"normal"}>
                Voting Threshold
              </FormLabel>
              <Input
                id="threshholdToken"
                placeholder="Enter Minimum tokens required to vote"
                autoComplete="email"
                onChange={(e) => setVotingThreshold(e.target.value)}
              />
            </FormControl>
            <FormControl mr="2%" mt="2%" isRequired>
              <FormLabel htmlFor="name" fontWeight={"normal"}>
                Passing Threshold
              </FormLabel>
              <Input
                id="threshholdToken"
                placeholder="Enter Minimum tokens required to pass proposal"
                autoComplete="email"
                onChange={(e) => setPassingThreshold(e.target.value)}
              />
              <FormHelperText>
                Enter minimum number of votes to pass a proposal
              </FormHelperText>
            </FormControl>
            <FormControl mr="2%" mt="2%" isRequired>
              <FormLabel htmlFor="name" fontWeight={"normal"}>
                Token Address
              </FormLabel>
              <Input
                id="tokenAddress"
                placeholder="Token address of proposal token"
                onChange={(e) => setTokenAddress(e.target.value)}
              />
            </FormControl>

            <FormControl mr="5%">
              <FormLabel
                htmlFor="datetime-local"
                fontWeight={"normal"}
                isRequired
              >
                Voting Start Date
              </FormLabel>
              <Input
                placeholder="Select Date "
                size="md"
                type="datetime-local"
                id="datetime-local"
                onChange={(e) => {
                  setStartDate(convertString(e.target.value) as any);
                }}
              />
            </FormControl>

            <FormControl mr="5%">
              <FormLabel
                htmlFor="datetime-local"
                fontWeight={"normal"}
                isRequired
              >
                Voting End Date
              </FormLabel>
              <Input
                placeholder="Select Date and Time"
                size="md"
                type="datetime-local"
                id="datetime-local"
                onChange={(e) => {
                  setEndTime(convertString(e.target.value) as any);
                }}
              />
            </FormControl>
            <FormControl mr="5%" mt="3%" isRequired>
              <FormLabel htmlFor="first-name" fontWeight={"normal"}>
                Allow voting only once
              </FormLabel>
              <RadioGroup defaultValue="2">
                <Stack spacing={5} direction="row">
                  <Radio
                    colorScheme="red"
                    value="1"
                    onChange={() => setvoteOnce(false)}
                  >
                    No
                  </Radio>
                  <Radio
                    colorScheme="green"
                    value="2"
                    onChange={() => setvoteOnce(true)}
                  >
                    Yes
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
            <FormControl mr="5%" mt="3%" isRequired>
              <FormLabel
                htmlFor="specialization"
                fontSize="sm"
                fontWeight="md"
                color="gray.700"
                _dark={{
                  color: "gray.50",
                }}
              >
                Proposal Type
              </FormLabel>
              <Select
                id="specialization"
                name="specialization"
                autoComplete="specialization"
                placeholder="Select option"
                focusBorderColor="brand.400"
                shadow="sm"
                size="sm"
                w="full"
                rounded="md"
                onChange={(e) => setProposalType(e.target.value)}
              >
                <option value="1">Standard Voting</option>
                <option value="2">Quadratic Voting</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => addProposal()}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isVoteOpen} onClose={onVoteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cast Your Vote</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Select
              onChange={(e) => {
                setUserResponse(e.target.value);
              }}
              placeholder="Select option"
            >
              <option value={1}>Yes</option>
              <option value={2}>No</option>
              <option value={3}>Abstain</option>
            </Select>
          </ModalBody>
          <Text ml={7} mt={2}>
            Please Authorize first and wait for the transaction to end. Then
            press Submit
          </Text>
          <ModalFooter>
            <Button
              onClick={() => {
                console.log(userResponse);
                console.log(proposalForVote);
                authorizeContract();
              }}
              colorScheme="orange"
              m={2}
            >
              Authorize & Vote
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isStartOpen} onClose={onStartClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invite member to dao:</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="text"
              placeholder="Add wallet address of the user you want to invite to DAO"
              onChange={(e) => {
                setInviteAddress(e.target.value);
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isEndOpen} onClose={onEndClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Voting Results: </ModalHeader>
          <ModalBody>
            <TableContainer>
              <Table variant="simple">
                <Tr>
                  <Td>Yes</Td>
                  <Td isNumeric>{yesVotes.length}</Td>
                </Tr>
                <Tr>
                  <Td>No</Td>
                  <Td isNumeric>{noVotes.length}</Td>
                </Tr>
                <Tr>
                  <Td>Abstain</Td>
                  <Td isNumeric>{abstainVotes.length}</Td>
                </Tr>
                <Tr>
                  <Td>Final Verdict</Td>
                  <Td isNumeric>{finalVerdict}</Td>
                </Tr>
              </Table>
            </TableContainer>
          </ModalBody>
          <ModalCloseButton />
        </ModalContent>
      </Modal>
    </div>
  );
};

export default index;
