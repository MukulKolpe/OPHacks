// @ts-nocheck comment
import React, { useEffect, useState, useRef } from "react";
import { ParticleProvider } from "@particle-network/provider";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import usersideabi from "../../utils/usersideabi.json";
import DaoDetails from "@/components/DaoDetails/DaoDetails";
import FileShare from "@/components/FileShare/FileShare";
import ProposalTab from "@/components/ProposalTab/ProposalTab";
import ProposalModal from "@/components/ProposalModal/ProposalModal";
import VoteModal from "@/components/VoteModal/VoteModal";
import InviteModal from "@/components/InviteModal/InviteModal";
import VoteResults from "@/components/VoteResults/VoteResults";
import {
  useDisclosure,
  useToast,
  Center,
  Flex,
  chakra,
  Grid,
  GridItem,
  VStack,
  Divider,
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
  const [inviteAddress, setInviteAddress] = useState("");
  const [endTime, setEndTime] = useState();
  const [finalVerdict, setFinalVerdict] = useState("");
  const [docName, setDocName] = useState("");
  const [docDesc, setDocDesc] = useState("");
  const [ipfsUrl, setIpfsUrl] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const inputRef = useRef(null);

  const changeHandler = () => {
    setProfileImage(inputRef.current?.files[0]);
  };
  const uploadIPFS = async () => {
    const form = new FormData();
    form.append("file", profileImage ? profileImage : "");

    const options = {
      method: "POST",
      body: form,
      headers: {
        Authorization: process.env.NEXT_PUBLIC_NFTPort_API_KEY,
      },
    };

    await fetch("https://api.nftport.xyz/v0/files", options)
      .then((response) => response.json())
      .then((response) => {
        // console.log(response);
        console.log(response.ipfs_url);
        setIpfsUrl(response.ipfs_url);
        if (profileImage) {
          toast({
            title: "File Uploaded to the IPFS.",
            description: "Congratulations 🎉 ",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: "File not Uploaded to the IPFS.",
            description: "Please attach the Image.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      })
      .catch((err) => console.error(err));
  };
  const handleSubmit = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_USERSIDE_ADDRESS,
        usersideabi,
        signer
      );
      const accounts = await provider.listAccounts();
      const tx = await contract.uploadDocument(
        docName,
        docDesc,
        daoInfo.daoId,
        ipfsUrl
      );

      await tx.wait();

      toast({
        title: "Document Uploaded",
        description: "Your document has been uploaded",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
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
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_USERSIDE_ADDRESS,
        usersideabi,
        signer
      );

      const tx = await contract.uploadDocument(
        docName,
        docDesc,
        daoInfo.daoId,
        ipfsUrl
      );

      await tx.wait();

      toast({
        title: "Document Uploaded",
        description: "Your document has been uploaded",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };

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

  //open upload file form
  const {
    isOpen: isUploadOpen,
    onOpen: onUploadOpen,
    onClose: onUploadClose,
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

  const handleSizeClick5 = (newSize) => {
    setSize(newSize);
    onUploadOpen();
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
      setPropSignal(true);
    }
  };

  const addProposal = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
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
    }
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
      <Center>
        <Flex flexDir={"row"} justifyContent={"center"} alignItems={"center"}>
          {" "}
          <DaoDetails
            daoInfo={daoInfo}
            totalMembers={totalMembers}
            adminInfo={adminInfo}
            isMember={isMember}
            address={address}
            handleSizeClick1={handleSizeClick1}
            handleSizeClick3={handleSizeClick3}
          />
          {isMember && (
            <>
              <FileShare
                handleSizeClick5={handleSizeClick5}
                isUploadOpen={isUploadOpen}
                onUploadClose={onUploadClose}
                docName={docName}
                setDocName={setDocName}
                docDesc={docDesc}
                setDocDesc={setDocDesc}
                profileImage={profileImage}
                inputRef={inputRef}
                changeHandler={changeHandler}
                uploadIPFS={uploadIPFS}
                handleSubmit={handleSubmit}
                daoInfo={daoInfo}
              />
            </>
          )}
        </Flex>
      </Center>
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
      <ProposalTab
        propSignal={propSignal}
        proposalArray={proposalArray}
        isMember={isMember}
        currentTimestamp={currentTimestamp}
        setProposalForVote={setProposalForVote}
        handleSizeClick2={handleSizeClick2}
        handleSizeClick4={handleSizeClick4}
        getVotingResults={getVotingResults}
        loadAllProposals={loadAllProposals}
        filteringDaos={filteringDaos}
      />

      <ProposalModal
        setTitle={setTitle}
        setDescription={setDescription}
        setVotingThreshold={setVotingThreshold}
        setPassingThreshold={setPassingThreshold}
        setProposalType={setProposalType}
        setTokenAddress={setTokenAddress}
        setStartDate={setStartDate}
        setEndTime={setEndTime}
        setvoteOnce={setvoteOnce}
        addProposal={addProposal}
        isAddOpen={isAddOpen}
        onAddClose={onAddClose}
      />
      <VoteModal
        isVoteOpen={isVoteOpen}
        onVoteClose={onVoteClose}
        proposalForVote={proposalForVote}
        authorizeContract={authorizeContract}
        setUserResponse={setUserResponse}
        userResponse={userResponse}
      />
      <InviteModal
        isStartOpen={isStartOpen}
        onStartClose={onStartClose}
        setInviteAddress={setInviteAddress}
        inviteAddress={inviteAddress}
      />
      <VoteResults
        isEndOpen={isEndOpen}
        onEndClose={onEndClose}
        yesVotes={yesVotes}
        noVotes={noVotes}
        abstainVotes={abstainVotes}
        finalVerdict={finalVerdict}
      />
    </div>
  );
};

export default index;
