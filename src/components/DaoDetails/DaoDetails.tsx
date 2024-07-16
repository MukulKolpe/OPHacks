// @ts-nocheck comment
import { Button, Heading, Text, Stack, Box } from "@chakra-ui/react";

export default function DaoDetails({
  daoInfo,
  totalMembers,
  adminInfo,
  isMember,
  address,
  handleSizeClick1,
  handleSizeClick3,
}) {
  return (
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
  );
}
