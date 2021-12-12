// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

import './StakeCoin.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
    @title Staking
    @author Alex
    @notice allows to deposit tokens and invests in a business
*/
contract Staking is Ownable {

    /**
     * @notice this structure contains two attributes the amount staked and when it's staked
     *         which are useful for the calculation of the reward
     */
    struct Stake{
        uint amount;
        uint dateStaked;
    }


    /**
     * @notice historyStake connects the address of a stakeholder and a specific token one to an
     *         array of stake type
     */
    mapping (address => mapping(address => Stake[])) public historyStake;

    /*
    function getHistoryStake(address stakeholderAddress) public view returns(address, uint, uint){
        return historyStake[stakeholderAddress];
    }
    */

    /**
     * @notice to know who are all the stakeholders
     */
    address[] public stakeholders;

    /**
     * @notice Number of staking slot
     */
    uint slotsAvailable = 100;

    /**
     * @notice We will use stakeCoinToken for the business functions to mint for example
     */
    StakeCoin private stakeCoinToken;

    /**
     * @notice The accumulated rewards for each stakeholder
     */
    mapping(address => uint256) internal rewards;

    /**
     * @notice Rate used to calculate the reward
     */
    uint256 rate = 5;

    /**
     * @notice the address or the person who deploys the contract
     */
    address public ownerOfContract;


    /**
     * @notice priceFeed consumes price data with AggregatorV3Interface
     */
    AggregatorV3Interface internal priceFeed;

    /**
     *  @notice list of the events used
     */
    //admin modifier onlyOwner
    event StakeholderAdded(address stakeholderAddress);
    //admin modifier onlyOwner
    event StakeholderRemoved(address stakeholderAddress);
    //admin & user modifier
    //event StakeCreated(address stakeholderAddress, uint256 stakeholderStake, address tokenAddress);`

    event StakeCreated();

    //admin & user modifier
    //event StakeRemoved(address stakeholderAddress, uint256 stakeholderStake, address tokenAddress);
    event StakeRemoved(address stakeholderAddress, address tokenAddress);

    //admin & user modifier
    event RewardCalculated(address stakeholderAddress, uint reward, address tokenAddress);
    //admin & user modifier
    event RewardsDistributed(address stakeholderAddress, address tokenAddress);
    //admin & user modifier
    event RewardWithdrawn(address stakeholderAddress);

    /**
     *  @notice to deploy ERC20 token
     *  @param _stakeCoin StakeCoin token to instantiate
     */
    constructor(StakeCoin _stakeCoin) {
        ownerOfContract = msg.sender;
        if (address(_stakeCoin) == address(0)){
            stakeCoinToken = new StakeCoin(0);
        }else{
            stakeCoinToken = _stakeCoin;
        }
        priceFeed = AggregatorV3Interface(0x3Af8C569ab77af5230596Acf0E8c2F9351d24C38);
    }

    /**
        @notice modifier to check if the current address is a stakeholder/admin one or not
    */
    modifier onlyStakeholderOrOwnerOfContract(address _address) {
        (bool stakeholderFlag, uint256 i) = isStakeholder(_address);
        require(stakeholderFlag == true || msg.sender == ownerOfContract, "the address is not a stakeholder/admin!");
        _;
    }


    //======== Helper functions ========
    /**
     *   @notice gives the list of the addresses of the stakeholders
     *   @return list of addresses corresponding to the stakeholders
     *   <!> it works with Remix!
     */
    function getStakeholders() public view returns(address[] memory){
        return stakeholders;
    }

    /**
        @notice return the current market value of the locked-in asset
        @return price the current market value
    */
    function getPrice() public view returns (int) {

        (uint80 roundID, int256 price, uint256 startedAt, uint256 timeStamp, uint80 answeredInRound) = priceFeed.latestRoundData();

        return price;

    }

    /**
        @notice determines if the address Ethereum is stakeHolder or not
        @param _address are you a stakeholder?
        @return bool whether you are stakeholder or not
        <!> it works with Remix!
    */
    function isStakeholder(address _address) public view returns(bool, uint256){

        for (uint256 i=0; i < stakeholders.length; i += 1){
            if( _address == stakeholders[i])
                return (true, i);

        }
        return (false, 0);
    }

    /**
        @notice allows to register a stakeholder in the dynamic array
        @param _stakeholder a new stakeholder to add
        <!> it works with Remix!
    */
    function addStakeholder(address _stakeholder) onlyOwner public {

        (bool _isStakeholder, ) = isStakeholder(_stakeholder);

        require(!_isStakeholder,'this address is already a stakeholder');
        stakeholders.push(_stakeholder);

        emit StakeholderAdded(_stakeholder);
    }

    /**
        @notice allows to delete a stakeholder from the dynamic array
        @param _stakeholder the stakeholder to remove from the dynamic array
        <!> it works with Remix!
    */
    function removeStakeholder(address _stakeholder) onlyOwner public {

        (bool _isStakeholder, uint256 s) = isStakeholder(_stakeholder);

        require(_isStakeholder,'this address (= stakeholder) is already removed');

        stakeholders[s] = stakeholders[stakeholders.length - 1];
        stakeholders.pop();

        emit StakeholderRemoved(_stakeholder);
    }

    /**
        @notice A method to retrieve the array of stake for a stakeholder with a token given in argument.
        @param _addressStakeHolder the address of the stakeHolder to put in order to get the stake
        @param _tokenAddress We get the stake related to a specific tokenAddress
        @return The sum in wei
        <!> TO TEST AGAIN!
    */
    function stakeOf(address _addressStakeHolder, address _tokenAddress) public view returns(Stake[] memory){

        return(historyStake[_addressStakeHolder][_tokenAddress]);

    }

    /**
        @notice aggregates all the amounts staked of all stakeholders for a given token
        @param _tokenAddress We sum the staked amounts for this token
        @return uint256 The sum of the staked amounts from all stakeholders
        <!> TO TEST AGAIN!!
    */
    function sumOfStakes(address _tokenAddress) public view returns(uint256){

        uint256 sumStakes = 0;
        for(uint256 i=0; i < stakeholders.length; i += 1){
            sumStakes = sumStakes + historyStake[stakeholders[i]][_tokenAddress][i].amount;
        }

        return sumStakes;
    }

    /**
        @notice a method for a stakeholder to create a stake
        @param _stake The size of the stake to be created
        @param _tokenAddress we are managing the stake related to this token
        <!> it works with Remix!
    */
    function createStake(uint256 _stake, address _tokenAddress) /*onlyStakeholderOrOwnerOfContract(msg.sender)*/ public {

        //Is it a erc20? to REMOVE
        //require(IERC20(_tokenAddress).totalSupply() > 0,'Not an ERC20');

        historyStake[msg.sender][_tokenAddress].push(Stake(_stake, block.timestamp));

        // transfert des tokens situés sur _tokenAddress de msg.sender vers le contract du montant _stake
        //IERC20(_tokenAddress).approve()

        /*
        function approveToken(address token) external {
            IERC20(token).approve(address(this), 1000);
        }


        await IERC20(_tokenAddress).approve(recipient, amount1, {from:owner});
        IERC20(_tokenAddress).transferFrom(msg.sender, address(this), _stake);

        //emit StakeCreated(msg.sender, _stake, _tokenAddress);
        */
        emit StakeCreated();
    }

    /**
        @notice a method for a stakeholder to remove a stake
        @param _tokenAddress we are managing the stake related to this token
        <!> it works with Remix!
    */
    function removeStake(address _tokenAddress) onlyStakeholderOrOwnerOfContract(msg.sender) public{

        //Is it a erc20?
        require(IERC20(_tokenAddress).totalSupply() > 0);

        //TODO
        //calcul de la reward lié au token
        uint256 removeStakeReward = calculateReward(msg.sender, _tokenAddress);

        //transfer du token reward vers msg.sender
        IERC20(_tokenAddress).transfer(msg.sender, removeStakeReward);

        //calcul du nombre de token "staked"
        uint stakedTokenSum;
        for (uint i; i < historyStake[msg.sender][_tokenAddress].length; i++)
            stakedTokenSum = stakedTokenSum + historyStake[msg.sender][_tokenAddress][i].amount;

        //transferer ce montant de token vers msg.sender
        IERC20(_tokenAddress).transfer(msg.sender,stakedTokenSum);

        //delete l'historique pour repartir à 0
        delete historyStake[msg.sender][_tokenAddress];

        //emit StakeRemoved(msg.sender, _stake, _tokenAddress);
        emit StakeRemoved(msg.sender, _tokenAddress);
    }

    /**
        @notice function to allow the stakeholder to check his rewards
        @param _stakeholder to point out the stakeholder identity address
        @return We get these rewards for this stakeholder
        <!> TO TEST AGAIN!
    */
    function rewardOf(address _stakeholder) public view returns(uint256) {
        return rewards[_stakeholder];
    }

    /**
        @notice function to aggregate rewards from all stakeholders
        @return uint256 The aggregated rewards from all stakeholders
        <!> TO TEST AGAIN!
    */
    function getTotalRewards() public view returns(uint256){

        uint256 totalRewards = 0;

        for(uint256 i=0; i<stakeholders.length; i++){
            totalRewards = totalRewards + rewards[stakeholders[i]];
        }

        return totalRewards;
    }

    /**
        @notice function to calculate rewards for each stakeholder
        @param _stakeholder We will calculate the reward for this stakeholder
        @param _tokenAddress We will calculate the reward related to this token
        @return uint256 The reward calculated by the formula
        <!> it works with Remix!
    */
    function calculateReward(address _stakeholder, address _tokenAddress) onlyStakeholderOrOwnerOfContract(msg.sender) public returns(uint256){

        uint reward = 0;

        for (uint256 i = 0; i < historyStake[_stakeholder][_tokenAddress].length; i++) {
            reward = reward +
            historyStake[_stakeholder][_tokenAddress][i].amount * 5 / 100 *
            //for the test in remix, change 1 days to 1 second otherwise it's too long to test
            ((block.timestamp - historyStake[_stakeholder][_tokenAddress][i].dateStaked) / 1 seconds);
        }

        emit RewardCalculated(_stakeholder, reward, _tokenAddress);
        return reward;
    }

    /**
        @notice function to distribute rewards to all stakeholders
        @param _tokenAddress we will distribute the rewards associated to this tokenAddress
        <!> TO TEST AGAIN!
    */
    function distributeRewards(address _tokenAddress) public payable onlyOwner {

        uint rewardQuantity;
        for (uint256 i = 0; i < stakeholders.length; i++ ){
            address stakeholder = stakeholders[i];
            rewardQuantity = calculateReward(stakeholder, _tokenAddress);
            rewards[stakeholder] = rewards[stakeholder] + rewardQuantity;

            //Conversion reward de _tokenAddress vers stakeCoinToken
            int256 tokenPrice = getPrice(); // unit tokenPrice
            uint rewardsToDistribute = rewardQuantity / uint(tokenPrice); // if 1 STC = 1 ETH

            stakeCoinToken.mint(address(this),rewards[stakeholder]);
            stakeCoinToken.transfer(stakeholder, rewards[stakeholder]);

        }

        emit RewardsDistributed(msg.sender, _tokenAddress);
    }

    /**
        @notice function to allow the stakeholder to withdraw his rewards
    */
    function withdrawReward() onlyStakeholderOrOwnerOfContract(msg.sender) public {

        require(rewards[msg.sender] > 0, "No reward to withdraw");
        uint reward = rewards[msg.sender];
        rewards[msg.sender] = 0;
        stakeCoinToken.mint(msg.sender,reward);

        emit RewardWithdrawn(msg.sender);
    }

}

