// @ts-nocheck comment
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import usersideabi from "../../../utils/usersideabi.json";
import {
  Grid,
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  VStack,
  Flex,
  Image,
  Center,
} from "@chakra-ui/react";

import { ethers } from "ethers";
const DocumentCard = ({ document, openModal }) => (
  <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p="4">
    <VStack spacing="2" align="start">
      <Text fontSize="xl" fontWeight="bold" textAlign="left">
        {document[1]}
      </Text>
      <Text textAlign="left">{document[2]}</Text>
    </VStack>
    <Flex justify="space-between" mt="4">
      <Button onClick={() => openModal(document)}>View</Button>
    </Flex>
  </Box>
);
const Files = () => {
  const router = useRouter();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async () => {
    const daoId = router.query.daoId;
    console.log(daoId);
    if (daoId) {
      if (window.ethereum._state.accounts.length !== 0) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          process.env.NEXT_PUBLIC_USERSIDE_ADDRESS,
          usersideabi,
          signer
        );
        const accounts = await provider.listAccounts();
        const tempDocsArray = await contract.getAllDaoDocuments(daoId);
        console.log(tempDocsArray);
        for (let i = 0; i < tempDocsArray.length; i++) {
          const tempDoc = await contract.documentIdtoDocument(tempDocsArray[i]);
          console.log(tempDoc);
          setFiles((files) => [...files, tempDoc]);
        }
      }
    }
  };
  console.log(files);
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [selectedDocument, setSelectedDocument] = React.useState(null);

  const openModal = (document) => {
    setSelectedDocument(document);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedDocument(null);
    setModalIsOpen(false);
  };
  return (
    <div>
      <Grid templateColumns="repeat(3, 1fr)" gap={6} mt={6} ml={3}>
        {files.map((document) => (
          <DocumentCard
            key={document[0].toString}
            document={document}
            openModal={openModal}
          />
        ))}
      </Grid>

      {selectedDocument && (
        <Modal isOpen={modalIsOpen} onClose={closeModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedDocument[1]}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* <object data={selectedDocument} width="100%" height="100%">
                <p>Document could not be loaded</p>
              </object> */}
              <Center>
                <Image
                  alt="Document"
                  srcSet={selectedDocument[3]}
                  width={400}
                  height={400}
                  objectFit={"cover"}
                ></Image>
              </Center>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default Files;
