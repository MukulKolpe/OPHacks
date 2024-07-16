// @ts-nocheck comment
import {
  SimpleGrid,
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
  Flex,
  Text,
  Stack,
  Box,
  FormControl,
  FormLabel,
  Icon,
  Input,
  VisuallyHidden,
  chakra,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function FileShare({
  handleSizeClick5,
  isUploadOpen,
  onUploadClose,
  docName,
  setDocName,
  docDesc,
  setDocDesc,
  profileImage,
  inputRef,
  changeHandler,
  uploadIPFS,
  handleSubmit,
  daoInfo,
}) {
  const router = useRouter();
  return (
    <Flex
      flexDir={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      ml={10}
    >
      {" "}
      <Box>
        <Button onClick={handleSizeClick5}>
          Share Files with the DAO members
        </Button>
        <Modal isOpen={isUploadOpen} onClose={onUploadClose}>
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent>
            <ModalHeader>Upload File</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div>
                {" "}
                <Box
                  borderWidth="1px"
                  rounded="lg"
                  shadow="1px 1px 3px rgba(0,0,0,0.3)"
                  maxWidth={800}
                  p={6}
                  m="10px auto"
                  as="form"
                >
                  <SimpleGrid columns={1} spacing={6}>
                    <FormControl mr="2%">
                      <FormLabel htmlFor="name" fontWeight={"normal"}>
                        File Name
                      </FormLabel>
                      <Input
                        id="name"
                        placeholder="Name"
                        autoComplete="name"
                        onChange={(e) => setDocName(e.target.value)}
                      />
                    </FormControl>

                    <FormControl id="bio">
                      <FormLabel
                        fontSize="sm"
                        fontWeight="md"
                        color="gray.700"
                        _dark={{
                          color: "gray.50",
                        }}
                      >
                        File description
                      </FormLabel>
                      <Textarea
                        placeholder="Describe the content of the file"
                        rows={3}
                        shadow="sm"
                        focusBorderColor="brand.400"
                        fontSize={{
                          sm: "sm",
                        }}
                        onChange={(e) => setDocDesc(e.target.value)}
                      />
                      <FormHelperText>
                        Short Description. URLs are hyperlinked.
                      </FormHelperText>
                    </FormControl>

                    <FormControl>
                      <FormLabel
                        fontWeight={"normal"}
                        color="gray.700"
                        _dark={{
                          color: "gray.50",
                        }}
                      >
                        Attach File
                      </FormLabel>

                      <Flex
                        mt={1}
                        justify="center"
                        px={6}
                        pt={5}
                        pb={6}
                        borderWidth={2}
                        _dark={{
                          color: "gray.500",
                        }}
                        borderStyle="dashed"
                        rounded="md"
                      >
                        <Stack spacing={1} textAlign="center">
                          <Icon
                            mx="auto"
                            boxSize={12}
                            color="gray.400"
                            _dark={{
                              color: "gray.500",
                            }}
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </Icon>
                          <Text>{profileImage?.name}</Text>
                          <Flex
                            fontSize="sm"
                            color="gray.600"
                            _dark={{
                              color: "gray.400",
                            }}
                            alignItems="baseline"
                          >
                            <chakra.label
                              cursor="pointer"
                              rounded="md"
                              fontSize="md"
                              color="brand.600"
                              _dark={{
                                color: "brand.200",
                              }}
                              pos="relative"
                              _hover={{
                                color: "brand.400",
                                _dark: {
                                  color: "brand.300",
                                },
                              }}
                            >
                              <span>{"Upload Image"}</span>
                              <VisuallyHidden>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  ref={inputRef}
                                  onChange={changeHandler}
                                  accept=".png, .jpg, .jpeg"
                                />
                              </VisuallyHidden>
                            </chakra.label>
                            <Text pl={1}>or drag and drop</Text>
                          </Flex>
                          <Text
                            fontSize="xs"
                            color="gray.500"
                            _dark={{
                              color: "gray.50",
                            }}
                          >
                            PNG, JPG, JPEG up to 10MB
                          </Text>
                        </Stack>
                      </Flex>
                    </FormControl>
                    <Button onClick={uploadIPFS}>Upload to IPFS</Button>
                  </SimpleGrid>
                </Box>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                display="block"
                mx="auto"
                mt={6}
                w="10rem"
                colorScheme="purple"
                variant="solid"
                onClick={handleSubmit}
              >
                Upload
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
      <Box>
        <Button
          onClick={() => router.push(`/dao/files/${daoInfo.daoId}`)}
          mt={10}
        >
          View all files
        </Button>
      </Box>
    </Flex>
  );
}
