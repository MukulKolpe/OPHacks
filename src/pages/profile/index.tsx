// @ts-nocheck comment
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import usersideabi from "../../utils/usersideabi.json";
import governancetokenabi from "../../utils/governancetokenabi.json";
import { Center } from "@chakra-ui/react";

const Profile = () => {
  const account = useAccount();
  const [userDaos, setUserDaos] = useState([]);

  const onLoad = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userSideInstance = new ethers.Contract(
        process.env.NEXT_PUBLIC_USERSIDE_ADDRESS,
        usersideabi,
        signer
      );
      console.log(userSideInstance);
      const tempUserId = await userSideInstance.userWallettoUserId(
        account.address
      );
      console.log(tempUserId);
      const tempUserInfo = await userSideInstance.userIdtoUser(tempUserId);
      console.log(tempUserInfo);
      const tempUserDaos = await userSideInstance.getAllUserDaos(tempUserId);
      console.log(tempUserDaos);
      let tempDaoInfo,
        tempAdminId,
        tempAdminInfo,
        tempDaoCreatorInfo,
        tempDaoTokenInfo,
        govtTokenName,
        govtTokenSymbol;
      for (let i = 0; i < tempUserDaos.length; i++) {
        tempDaoInfo = await userSideInstance.daoIdtoDao(tempUserDaos[i]);
        console.log(tempDaoInfo);
        tempAdminId = tempDaoInfo.creator;
        tempAdminInfo = await userSideInstance.userIdtoUser(tempAdminId);
        console.log(tempAdminInfo);
        // //token Info
        const governanceTokenInstance = new ethers.Contract(
          tempDaoInfo.governanceTokenAddress,
          governancetokenabi,
          signer
        );
        console.log(governanceTokenInstance);
        govtTokenName = await governanceTokenInstance.name();
        govtTokenSymbol = await governanceTokenInstance.symbol();
        console.log(govtTokenName);
        console.log(govtTokenSymbol);
        setUserDaos((daos) => [
          ...daos,
          {
            daoInfo: tempDaoInfo,
            creatorInfo: tempAdminInfo,
            tokenName: govtTokenName,
            tokenSymbol: govtTokenSymbol,
          },
        ]);
      }
    }
  };

  useEffect(() => {
    return () => onLoad();
  }, []);

  return <div>Profile</div>;
};

export default Profile;
