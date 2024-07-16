// @ts-nocheck comment
import {
  Modal,
  Text,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  TableContainer,
  Table,
  Tr,
  Td,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
} from "@chakra-ui/react";

export default function VoteResults({
  isEndOpen,
  onEndClose,
  yesVotes,
  noVotes,
  abstainVotes,
  finalVerdict,
}) {
  return (
    <Modal isOpen={isEndOpen} onClose={onEndClose}>
      <ModalOverlay backdropFilter="blur(4px)" />
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
  );
}
