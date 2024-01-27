// @ts-nocheck comment
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import usersideabi from "../../utils/usersideabi.json";
import governancetokenabi from "../../utils/governancetokenabi.json";

const index = () => {
  const [daos, setDaos] = useState([]);

  const onLoad = async () => {
    if (window.ethereum._state.accounts.length !== 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userSideInstance = new ethers.Contract(
        process.env.NEXT_PUBLIC_USERSIDE_ADDRESS,
        usersideabi,
        signer
      );
      const tempTotalDaos = Number(await userSideInstance.totalDaos());
      let tempCreatorId,
        tempDaoInfo,
        tempCreatorInfo,
        tempTokenAddress,
        tempTokenName,
        tempTokenSymbol;
      for (let i = 1; i <= tempTotalDaos; i++) {
        tempDaoInfo = await userSideInstance.daoIdtoDao(i);
        tempCreatorId = Number(tempDaoInfo.creator);
        console.log("Creator Id: " + tempCreatorId);
        tempCreatorInfo = await userSideInstance.userIdtoUser(tempCreatorId);
        console.log(tempCreatorInfo);
        tempTokenAddress = tempDaoInfo.governanceTokenAddress;
        console.log("TokenAddress: " + tempTokenAddress);
        const governanceTokenInstance = new ethers.Contract(
          tempTokenAddress,
          governancetokenabi,
          signer
        );
        console.log(governanceTokenInstance);
        tempTokenName = await governanceTokenInstance.name();
        console.log("Token Name: " + tempTokenName);
        tempTokenSymbol = await governanceTokenInstance.symbol();
        console.log("Token Symbol: " + tempTokenSymbol);
        setDaos((daos) => [
          ...daos,
          {
            daoInfo: tempDaoInfo,
            creatorInfo: tempCreatorInfo,
            tokenName: tempTokenName,
            tokenSymbol: tempTokenSymbol,
          },
        ]);
      }
    } else {
    }
  };

  useEffect(() => {
    return () => onLoad();
  }, []);

  return <div>index</div>;
};

export default index;
