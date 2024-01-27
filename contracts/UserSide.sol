// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "contracts/GovernanceToken.sol";
//import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "https://github.com/fractional-company/contracts/blob/master/src/OpenZeppelin/math/SafeMath.sol";


contract UserSide{
    using SafeMath for uint256;

    address public userSideAdmin;
    uint256 public totalUsers = 0;
    uint256 public totalProposals = 0;
    uint256 public totalDaos = 0;
    uint256 public contractCreationTime = 0;
    uint256 public totalDocuments = 0;

    constructor() {
        userSideAdmin = msg.sender;
        contractCreationTime = block.timestamp;
    }

    struct user {
        uint256 userId;
        string userName;
        string userEmail;
        string description;
        string profileImage;
        address userWallet;
    }

    struct dao {
        uint256 daoId;
        uint256 creator;
        string daoName;
        string daoDescription;
        uint256 joiningThreshold;
        uint256 proposingThreshold;
        address governanceTokenAddress;
        bool isPrivate;
    }

    struct proposal {
        uint256 proposalId;
        uint256 proposalType;
        string proposalTitleAndDesc;
        uint256 proposerId;
        uint256 votingThreshold;
        uint256 daoId;
        address votingTokenAddress; // address of the token to be used for voting
        uint256 beginningTime;
        uint256 endingTime;
        uint256 passingThreshold;
        bool voteOnce;
    }

    struct Document{
        uint256 documentId;
        string ipfsHash;
        uint256 upoladerId;
        uint256 daoId;
    }

    mapping(uint256 => user) public userIdtoUser;
    mapping(address => uint256) public userWallettoUserId;
    mapping(uint256 => dao) public daoIdtoDao;
    mapping(uint256 => proposal) public proposalIdtoProposal;
    mapping(uint256 => uint256[]) public daoIdtoMembers;
    mapping(uint256 => uint256[]) public daoIdtoProposals;
    mapping(uint256 => uint256[]) public proposalIdtoVoters;
    mapping(uint256 => uint256[]) public proposalIdtoYesVoters;
    mapping(uint256 => uint256[]) public proposalIdtoNoVoters;
    mapping(uint256 => uint256[]) public proposalIdtoAbstainVoters;
    mapping(uint256 => uint256[]) public userIdtoDaos;
    // proposalId => ( userId => weights )
    mapping(uint256 => mapping(uint256 => uint256)) public quadraticYesMappings;
    mapping(uint256 => mapping(uint256 => uint256)) public quadraticNoMappings;

    mapping(uint256 => Document) public documentIdtoDocument;
    mapping(uint256 => uint256[]) public daoIdtoDocuments;
    

    function createUser(
        string memory _userName,
        string memory _userEmail,
        string memory _description,
        string memory _profileImage,
        address _userWalletAddress
    ) public {
        totalUsers++;
        user memory u1 = user(
            totalUsers,
            _userName,
            _userEmail,
            _description,
            _profileImage,
            _userWalletAddress
        );
        userIdtoUser[totalUsers] = u1;
        userWallettoUserId[_userWalletAddress] = totalUsers;
    }

    function createDao(
        string memory _daoName,
        string memory _daoDescription,
        uint256 _joiningThreshold,
        uint256 _proposingThreshold,
        address _joiningTokenAddress,
        bool _isPrivate,
        address _userWalletAddress
    ) public {
        totalDaos++;
        uint256 creatorId = userWallettoUserId[_userWalletAddress];
        require(creatorId != 0, "User is not registered into the system");
        dao memory d1 = dao(
            totalDaos,
            creatorId,
            _daoName,
            _daoDescription,
            _joiningThreshold * 1000000000000000000,
            _proposingThreshold * 1000000000000000000,
            _joiningTokenAddress,
            _isPrivate
        );
        daoIdtoDao[totalDaos] = d1;
        daoIdtoMembers[totalDaos].push(creatorId);
        userIdtoDaos[creatorId].push(totalDaos);
    }

    function createProposal(
        uint256 _proposalType,
        string memory _proposalTitleAndDesc,
        uint256 _votingThreshold,
        uint256 _daoId,
        address _governanceTokenAddress,
        address _userWalletAddress,
        uint256 _beginningTime,
        uint256 _endingTime,
        uint256 _passingThreshold,
        bool _voteOnce
    ) public {
        address daoGovernanceToken = daoIdtoDao[_daoId].governanceTokenAddress;
        GovernanceToken govtToken = GovernanceToken(daoGovernanceToken);
        require(govtToken.balanceOf(_userWalletAddress) >= daoIdtoDao[_daoId].proposingThreshold,"You do nt have enough tokens");
        totalProposals++;
        uint256 tempProposerId = userWallettoUserId[_userWalletAddress];
        proposal memory p1 = proposal(
            totalProposals,
            _proposalType,
            _proposalTitleAndDesc,
            tempProposerId,
            _votingThreshold * 1000000000000000000,
            _daoId,
            _governanceTokenAddress,
            _beginningTime,
            _endingTime,
            _passingThreshold,
            _voteOnce
        );
        proposalIdtoProposal[totalProposals] = p1;
        daoIdtoProposals[_daoId].push(totalProposals);
    }


    function addMembertoDao(
        uint256 _daoId,
        address _userWalletAddress,
        address _adminWalletAddress
    ) public {
        uint256 tempUserId = userWallettoUserId[_adminWalletAddress];
        require(tempUserId == daoIdtoDao[_daoId].creator, "Only admin can add users to the dao");
        uint256 newUserId = userWallettoUserId[_userWalletAddress];
        require(newUserId > 0, "User is not registered into the system");
        daoIdtoMembers[_daoId].push(newUserId);
        userIdtoDaos[newUserId].push(_daoId);
    }

    function joinDao(uint256 _daoId, address _callerWalletAddress) public {
        require(daoIdtoDao[_daoId].isPrivate == false, "Dao is Private");
        //require(balanceOf(msg.sender) >= daoIdtoDao[_daoId].joiningThreshold,"Not enough tokens");
        address tempTokenAddress = daoIdtoDao[_daoId].governanceTokenAddress;
        GovernanceToken govtToken = GovernanceToken(tempTokenAddress);
        uint256 userBalance = govtToken.balanceOf(_callerWalletAddress);
        require(
            userBalance >= daoIdtoDao[_daoId].joiningThreshold,
            "Not enough Tokens"
        );
        uint256 newUserId = userWallettoUserId[_callerWalletAddress];
        require(newUserId > 0, "User is not registered into the system");
        daoIdtoMembers[_daoId].push(newUserId);
        userIdtoDaos[newUserId].push(_daoId);
    }

    function checkMembership(
        uint256 _daoId,
        address _callerWalletAddress
    ) public view returns (bool) {
        uint256 tempUserId = userWallettoUserId[_callerWalletAddress];
        uint256 totalMembers = daoIdtoMembers[_daoId].length;
        for (uint256 i = 0; i < totalMembers; i++) {
            if (tempUserId == daoIdtoMembers[_daoId][i]) {
                return true;
            }
        }
        return false;
    }

    function uploadDocument(uint256 _daoId,string memory _ipfsHash) public {
        checkMembership(_daoId,msg.sender);
        totalDocuments++;
        uint256 tempUserId = userWallettoUserId[msg.sender];
        Document memory d1 = Document(totalDocuments,_ipfsHash,tempUserId,_daoId);
        documentIdtoDocument[totalDocuments] = d1;
        daoIdtoDocuments[_daoId].push(totalDocuments);
    }

    function hasVoted(uint256 _userId,uint256 _proposalId) public view returns(bool) {
        for(uint256 i = 0;i < proposalIdtoVoters[_proposalId].length;i++){
            if(_userId == proposalIdtoVoters[_proposalId][i]){
                return true;
            }
        }
        return false;
    }

    function voteForProposal(
        uint256 _proposalId,
        uint256 _voteFor,
        address _callerWalletAddress
    ) public {
        address funcCaller = _callerWalletAddress;
        uint256 tempDaoId = proposalIdtoProposal[_proposalId].daoId;
        require(
            checkMembership(tempDaoId, _callerWalletAddress),
            "Only members of the can vote"
        );
        require(block.timestamp >= proposalIdtoProposal[_proposalId].beginningTime,"Voting has not started");
        require(block.timestamp < proposalIdtoProposal[_proposalId].endingTime,"Voting Time has ended");
        require(proposalIdtoProposal[_proposalId].proposalType == 1,"Voting Type is not yes/no");
        address votingTokenAddress = proposalIdtoProposal[_proposalId].votingTokenAddress;
        GovernanceToken govtToken = GovernanceToken(votingTokenAddress);
        uint256 userBalance = govtToken.balanceOf(msg.sender);
        uint256 tempUserId = userWallettoUserId[msg.sender];
        require(
            userBalance >= proposalIdtoProposal[_proposalId].votingThreshold,
            "Not enough Tokens"
        );
        bool voteSignal = hasVoted(tempUserId,_proposalId);
        if(proposalIdtoProposal[_proposalId].voteOnce){
            require(!voteSignal,"User has Voted");
        }
        //require(balanceOf(msg.sender) >= tempVotingthreshold,"Not enough tokens");
        require(
            userBalance >= proposalIdtoProposal[_proposalId].votingThreshold,
            "Not enough Tokens"
        );
        
        if(proposalIdtoProposal[_proposalId].voteOnce){
            require(!voteSignal,"User has Voted");
        }
        //govtToken.approve(address(this), proposalIdtoProposal[_proposalId].votingThreshold);
        govtToken.transferFrom(
            funcCaller,
            address(this),
            proposalIdtoProposal[_proposalId].votingThreshold
        );
        if (_voteFor == 1) {
            proposalIdtoYesVoters[_proposalId].push(tempUserId);
        } else if(_voteFor == 2) {
            proposalIdtoNoVoters[_proposalId].push(tempUserId);
        }
        else{
            proposalIdtoAbstainVoters[_proposalId].push(tempUserId);
        }
    }

    function sqrt(uint x) internal pure returns (uint y) {
        uint z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }

    function qvVoting(uint256 _proposalId,uint256 _numTokens,address _callerWalletAddress,uint256 _voteFor) public {
        address funcCaller = _callerWalletAddress;
        uint256 tempDaoId = proposalIdtoProposal[_proposalId].daoId;
        require(
            checkMembership(tempDaoId, _callerWalletAddress),
            "Only members of the can vote"
        );
        require(block.timestamp >= proposalIdtoProposal[_proposalId].beginningTime,"Voting has not started");
        require(block.timestamp < proposalIdtoProposal[_proposalId].endingTime,"Voting Time has ended");
        address votingTokenAddress = proposalIdtoProposal[_proposalId].votingTokenAddress;
        GovernanceToken govtToken = GovernanceToken(votingTokenAddress);
        uint256 userBalance = govtToken.balanceOf(msg.sender);
        uint256 tempUserId = userWallettoUserId[msg.sender];
        require(
            userBalance >= proposalIdtoProposal[_proposalId].votingThreshold,
            "Not enough Tokens"
        );
        require(
            _numTokens >= proposalIdtoProposal[_proposalId].votingThreshold,
            "Not enough Tokens"
        );
        govtToken.transferFrom(
            funcCaller,
            address(this),
            _numTokens
        );
        uint256 weight = sqrt(_numTokens);
        if(_voteFor == 1){
            quadraticYesMappings[_proposalId][tempUserId] += weight;
        }
        else{
            quadraticNoMappings[_proposalId][tempUserId] += weight;
        }
    }

    function getAllDaoMembers(uint256 _daoId) public view returns (uint256[] memory) {
        return daoIdtoMembers[_daoId];
    }

    function getAllDaoProposals(uint256 _daoId) public view returns (uint256[] memory) {
        return daoIdtoProposals[_daoId];
    }

    function getAllVoters(uint256 _proposalId) public view returns(uint256[] memory) {
        return proposalIdtoVoters[_proposalId];
    }

    function getAllYesVotes(uint256 _proposalId) public view returns (uint256[] memory) {
        return proposalIdtoYesVoters[_proposalId];
    }

    function getAllNoVotes(uint256 _proposalId) public view returns (uint256[] memory) {
        return proposalIdtoNoVoters[_proposalId];
    }

    function getAllAbstainVotes(uint256 _proposalId) public view returns (uint256[] memory) {
        return proposalIdtoAbstainVoters[_proposalId];
    }

    function getAllUserDaos(uint256 _userId) public view returns (uint256[] memory) {
        return userIdtoDaos[_userId];
    }

    function getAllDaoDocuments(uint256 _daoId) public view returns(uint256[] memory) {
        return daoIdtoDocuments[_daoId];
    }
    
}
