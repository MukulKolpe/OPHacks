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
  Input,
} from "@chakra-ui/react";

export default function InviteModal({
  isStartOpen,
  onStartClose,
  setInviteAddress,
  inviteAddress,
}) {
  return (
    <Modal isOpen={isStartOpen} onClose={onStartClose}>
      <ModalOverlay backdropFilter="blur(4px)" />
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
  );
}
