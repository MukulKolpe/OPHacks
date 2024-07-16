// @ts-nocheck comment
import {
  FormHelperText,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Textarea,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Select,
  useDisclosure,
} from "@chakra-ui/react";

const convertString = (dateString: any) => {
  const date = new Date(dateString);
  const millisecondsSinceEpoch = date.getTime() / 1000;
  return millisecondsSinceEpoch;
};

export default function ProposalModal({
  setTitle,
  setDescription,
  setVotingThreshold,
  setPassingThreshold,
  setTokenAddress,
  setStartDate,
  setEndTime,
  setvoteOnce,
  setProposalType,
  addProposal,
  isAddOpen,
  onAddClose,
}) {
  return (
    <Modal isOpen={isAddOpen} onClose={onAddClose}>
      <ModalOverlay backdropFilter="blur(4px)" />
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
  );
}
