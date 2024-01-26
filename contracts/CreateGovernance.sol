// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "./GovernanceToken.sol";

contract CreateGovernanceToken {
    //address contractAddress = address(new GovernanceToken(_userAddress));
    mapping(uint256 => address[]) public userIdtoDeployedTokens;

    function deployToken(string memory _tokenName,string memory _tokenSymbol,uint256 _totalSupply,uint256 _userId) public {
        address funcCaller = msg.sender;
        address tokenAddress = address(new GovernanceToken(_tokenName,_tokenSymbol,_totalSupply));
        userIdtoDeployedTokens[_userId].push(tokenAddress);
        GovernanceToken govtToken = GovernanceToken(tokenAddress);
        govtToken.transfer(funcCaller,_totalSupply * 1000000000000000000);
    }

    function getBalance(address _tokenAddress,address _userAddress) public view returns(uint256) {
        GovernanceToken govtToken = GovernanceToken(_tokenAddress);
        return govtToken.balanceOf(_userAddress);
    }

    function getTotalTokesnDeployed(uint256 _userId) public view returns(uint256) {
        return userIdtoDeployedTokens[_userId].length;
    }

}