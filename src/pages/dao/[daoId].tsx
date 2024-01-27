// @ts-nocheck comment
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import usersideabi from "../../utils/usersideabi.json";
import { Center } from "@chakra-ui/react";

const index = () => {
  const router = useRouter();
  const account = useAccount();
  const [isMember, setIsMember] = useState(false);
  const [daoInfo, setDaoInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [daoProposals, setDaoProposals] = useState([]);
  const [daoMembers, setDaoMembers] = useState([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [adminInfo, setAdminInfo] = useState();

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

        const userSideInstance = new ethers.Contract(
          process.env.NEXT_PUBLIC_USERSIDE_ADDRESS,
          usersideabi,
          signer
        );
        console.log(userSideInstance);
        const tempDaoInfo = await userSideInstance.daoIdtoDao(daoId);
        setDaoInfo(tempDaoInfo);
        const tempDaoMembers = await userSideInstance.getAllDaoMembers(daoId);

        const tempDaoProposals = await userSideInstance.getAllDaoProposals(
          daoId
        );

        const membershipSignal = await userSideInstance.checkMembership(
          daoId,
          account.address
        );
        setIsMember(membershipSignal);
      }
    }
  };
  useEffect(() => {
    onLoad();
  }, [router]);

  if (loading) {
    return <Center>Loading...</Center>;
  }

  if (daoInfo.isPrivate && !isMember) {
    return <Center>You are not the member of this DAO.</Center>;
  }

  return (
    <div>
      <div>This is dao number: {Number(daoInfo.daoId)}</div>
      <div>Dao Name: {daoInfo.daoName}</div>
      <div> Dao description: {daoInfo.daoDescription} </div>
      <div> Total Members: {totalMembers} </div>
      <div>
        {" "}
        Creator Name and Wallet Address: {adminInfo.userName} -{" "}
        {adminInfo.userWallet}
      </div>

      <Button mt="2%" m={2} onClick={() => handleSizeClick1("xl")}>
        Add Proposal{" "}
      </Button>

      <Button mt="2%" m={2} onClick={() => handleSizeClick3("xl")}>
        Add member{" "}
      </Button>

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
                  <TableContainer>
                    <Table variant="simple">
                      <TableCaption>All Proposals</TableCaption>
                      <Thead>
                        <Tr>
                          <Th>Proposal Id.</Th>
                          <Th> Title</Th>
                          <Th>Description</Th>
                          <Th>Votin Token</Th>
                          <Th>Voting Threshold</Th>
                          <Th>Token Address</Th>
                          <Th>Vote</Th>
                          <Th>End Voting</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {proposalArray
                          .filter(
                            (proposal) =>
                              proposal.proposalInfo.proposalStage == 1 //ongoing events
                          )
                          .map((proposal) => (
                            <Tr>
                              <Td>
                                {Number(proposal.proposalInfo.proposalId)}
                              </Td>
                              <Td>{proposal.proposalInfo.proposalTitle}</Td>
                              <Td>
                                {proposal.proposalInfo.proposalDesription}
                              </Td>
                              <Td>{proposal.tokenName}</Td>
                              <Td>
                                {Number(proposal.proposalInfo.votingThreshold)}{" "}
                                {proposal.tokenSymbol}
                              </Td>
                              <Td>
                                {proposal.proposalInfo.governanceTokenAddress}
                              </Td>
                              <Td>
                                <Button
                                  onClick={() => {
                                    setProposalForVote(
                                      Number(proposal.proposalInfo.proposalId)
                                    );
                                    handleSizeClick2();
                                  }}
                                >
                                  Vote Now
                                </Button>
                              </Td>
                              {userRole == 1 && (
                                <Td>
                                  <Button
                                    onClick={() => {
                                      endVoting(
                                        Number(proposal.proposalInfo.proposalId)
                                      );
                                    }}
                                  >
                                    End Voting
                                  </Button>
                                </Td>
                              )}
                            </Tr>
                          ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </TabPanel>
                <TabPanel>
                  <TableContainer>
                    <Table variant="simple">
                      <TableCaption>All Proposals</TableCaption>
                      <Thead>
                        <Tr>
                          <Th>Proposal Id.</Th>
                          <Th> Title</Th>
                          <Th>Description</Th>
                          <Th>Votin Token</Th>
                          <Th>Voting Threshold</Th>
                          <Th>Token Address</Th>
                          <Th>Start Voting</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {proposalArray
                          .filter(
                            (proposal) =>
                              proposal.proposalInfo.proposalStage == 0 //for upcoming events
                          )
                          .map((proposal) => (
                            <Tr>
                              <Td>
                                {Number(proposal.proposalInfo.proposalId)}
                              </Td>
                              <Td>{proposal.proposalInfo.proposalTitle}</Td>
                              <Td>
                                {proposal.proposalInfo.proposalDesription}
                              </Td>
                              <Td>{proposal.tokenName}</Td>
                              <Td>
                                {Number(proposal.proposalInfo.votingThreshold)}{" "}
                                {proposal.tokenSymbol}
                              </Td>
                              <Td>
                                {proposal.proposalInfo.governanceTokenAddress}
                              </Td>
                              {userRole == 1 && (
                                <Td>
                                  <Button
                                    onClick={() => {
                                      setStartVotingId(
                                        Number(proposal.proposalInfo.proposalId)
                                      );
                                      startVoting(
                                        Number(proposal.proposalInfo.proposalId)
                                      );
                                    }}
                                  >
                                    Start
                                  </Button>
                                </Td>
                              )}
                            </Tr>
                          ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </TabPanel>
                <TabPanel>
                  <TableContainer>
                    <Table variant="simple">
                      <TableCaption>All Proposals</TableCaption>
                      <Thead>
                        <Tr>
                          <Th>Proposal Id.</Th>
                          <Th> Title</Th>
                          <Th>Description</Th>
                          <Th>Votin Token</Th>
                          <Th>Voting Threshold</Th>
                          <Th>Token Address</Th>
                          <Th>Results</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {proposalArray
                          .filter(
                            (proposal) =>
                              proposal.proposalInfo.proposalStage == 2 //for past events
                          )
                          .map((proposal) => (
                            <Tr>
                              <Td>
                                {Number(proposal.proposalInfo.proposalId)}
                              </Td>
                              <Td>{proposal.proposalInfo.proposalTitle}</Td>
                              <Td>
                                {proposal.proposalInfo.proposalDesription}
                              </Td>
                              <Td>{proposal.tokenName}</Td>
                              <Td>
                                {Number(proposal.proposalInfo.votingThreshold)}{" "}
                                {proposal.tokenSymbol}
                              </Td>
                              <Td>
                                {proposal.proposalInfo.governanceTokenAddress}
                              </Td>
                              <Td>
                                <Button
                                  onClick={() => {
                                    getVotingResults(
                                      Number(proposal.proposalInfo.proposalId)
                                    );
                                    handleSizeClick4();
                                  }}
                                >
                                  View Results
                                </Button>
                              </Td>
                            </Tr>
                          ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
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
                Threshold
              </FormLabel>
              <Input
                id="threshholdToken"
                placeholder="Minimum tokens required to join DAO"
                autoComplete="email"
                onChange={(e) => setThreshold(e.target.value)}
              />
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
          </ModalBody>
          <ModalFooter>
            <Button onClick={createProposal}>Submit</Button>
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
              <option value="yes">Yes</option>
              <option value="no">No</option>
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
            <Button onClick={addmembertoDao}>Submit</Button>
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
                  <Td isNumeric>{votingYes}</Td>
                </Tr>
                <Tr>
                  <Td>No</Td>
                  <Td isNumeric>{votingNo}</Td>
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
