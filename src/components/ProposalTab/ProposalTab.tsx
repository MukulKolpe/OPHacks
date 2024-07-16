// @ts-nocheck comment
import {
  Button,
  Flex,
  Text,
  Box,
  Grid,
  GridItem,
  TableCaption,
  TableContainer,
  TabPanels,
  Tab,
  TabPanel,
  TabList,
  Tabs,
  Heading,
  Center,
} from "@chakra-ui/react";

export default function ProposalTab({
  propSignal,
  proposalArray,
  isMember,
  currentTimestamp,
  setProposalForVote,
  handleSizeClick2,
  handleSizeClick4,
  getVotingResults,
  loadAllProposals,
  filteringDaos,
}) {
  return (
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
  );
}
