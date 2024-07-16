// @ts-nocheck comment
import {
  Modal,
  Text,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Select,
} from "@chakra-ui/react";

export default function VoteModal({
  isVoteOpen,
  onVoteClose,
  proposalForVote,
  authorizeContract,
  setUserResponse,
  userResponse,
}) {
  return (
    <Modal isOpen={isVoteOpen} onClose={onVoteClose}>
      <ModalOverlay backdropFilter="blur(4px)" />
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
          Please Authorize first and wait for the transaction to end. Then press
          Submit
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
  );
}
