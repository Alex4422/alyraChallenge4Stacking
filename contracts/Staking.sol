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

    /**
     * @notice to know who are all the stakeholders
     */
    address[] internal stakeholders;

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

    //the variable is it still useful to keep? I've to check again pls!
    uint reward;

    /**
     *  @notice list of the events used
     */
    //admin modifier onlyOwner
    event StakeholderAdded(address stakeholderAddress);
    //admin modifier onlyOwner
    event StakeholderRemoved(address stakeholderAddress);
    //admin & user modifier
    event StakeCreated(address stakeholderAddress, uint256 stakeholderStake, address tokenAddress);
    //admin & user modifier
    event StakeRemoved(address stakeholderAddress, uint256 stakeholderStake, address tokenAddress);
    //admin & user modifier
    event RewardCalculated(address stakeholderAddress, uint reward, address tokenAddress);
    //admin & user modifier
    event RewardsDistributed(address stakeholderAddress, address tokenAddress);
    //admin & user modifier
    event RewardWithdrawn(address stakeholderAddress, address tokenAddress);

    /**
        @notice modifier to check if the current address is a stakeholder/admin one or not
    */
    modifier onlyStakeholderOrOwnerOfContract(address _address) {
        (bool stakeholderFlag, uint256 i) = isStakeholder(_address);
        require(stakeholderFlag == true || msg.sender == ownerOfContract, "the address is not a stakeholder/admin!");
        _;
    }

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
    }

    //======== Helper functions ========
    /**
     *   @notice gives the list of the addresses of the stakeholders
     *   @return list of addresses corresponding to the stakeholders
     */
    function getStakeholders() public view returns(address[] memory){
        return stakeholders;
    }

    /**
        @notice return the current market value of the locked-in asset
        @param conversionPriceAddress where to find the price to convert
        @return price the current market value
    */
    function getPrice(address conversionPriceAddress) public view returns (int) {

        AggregatorV3Interface conversionPrice = AggregatorV3Interface(conversionPriceAddress);

        (uint80 roundID, int256 price, uint256 startedAt, uint256 timeStamp, uint80 answeredInRound) = conversionPrice.latestRoundData();

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

        //What is the best? if or require. I think "require(...)" it is the best
        //in order to make a test with chai
        //if(!_isStakeholder) stakeholders.push(_stakeholder);
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

        if (_isStakeholder) {
            stakeholders[s] = stakeholders[stakeholders.length - 1];
            stakeholders.pop();
        }
        emit StakeholderRemoved(_stakeholder);
    }

    /**
        @notice A method to retrieve the array of stake for a stakeholder and a token given.
        @param _addressStakeHolder the address of the stakeHolder to put in order to get the stake
        @param _tokenAddress We get the stake related to a specific tokenAddress
        @return The sum in wei
        <!> it works with Remix!
    */
    function stakeOf(address _addressStakeHolder, address _tokenAddress) onlyStakeholderOrOwnerOfContract(msg.sender) public view returns(Stake[] memory){

        return(historyStake[_addressStakeHolder][_tokenAddress]);

    }

    /**
        @notice aggregates all the amounts staked of all stakeholders for a given token
        @param _tokenAddress We sum the staked amounts for this token
        @return uint256 The sum of the staked amounts from all stakeholders
        <!> it works with Remix!
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
    function createStake(uint256 _stake, address _tokenAddress) onlyStakeholderOrOwnerOfContract(msg.sender) public {

        if (historyStake[msg.sender][_tokenAddress].length > 0){
            slotsAvailable--;
            addStakeholder(msg.sender);
        }

        historyStake[msg.sender][_tokenAddress].push(Stake(_stake, block.timestamp));

        emit StakeCreated(msg.sender, _stake, _tokenAddress);
    }

    /**
        @notice a method for a stakeholder to remove a stake
        @param _stake The size of the stake to be removed
        @param _tokenAddress we are managing the stake related to this token
        <!> it works with Remix!
    */
    function removeStake(uint256 _stake, address _tokenAddress) onlyStakeholderOrOwnerOfContract(msg.sender) public{

        historyStake[msg.sender][_tokenAddress].pop();

        if(historyStake[msg.sender][_tokenAddress].length == 0){
            removeStakeholder(msg.sender);
            slotsAvailable++;
        }

        emit StakeRemoved(msg.sender, _stake, _tokenAddress);
    }

    /**
        @notice function to allow the stakeholder to check his rewards
        @param _stakeholder to point out the stakeholder identity address
        @return We get these rewards for this stakeholder
    */
    function rewardOf(address _stakeholder) public view returns(uint256) {
        return rewards[_stakeholder];
    }

    /**
        @notice function to aggregate rewards from all stakeholders
        @return uint256 The aggregated rewards from all stakeholders
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
    */
    function calculateReward(address _stakeholder, address _tokenAddress) onlyStakeholderOrOwnerOfContract(msg.sender) public returns(uint256){

        //uint reward;

        for (uint256 i = 0; i < historyStake[_stakeholder][_tokenAddress].length; i++) {
            reward = reward +
                historyStake[_stakeholder][_tokenAddress][i].amount * 5 / 100 *
                ((block.timestamp - historyStake[_stakeholder][_tokenAddress][i].dateStaked) / 1 days);
        }

        emit RewardCalculated(_stakeholder, reward, _tokenAddress);
        return reward;
    }

    /**
        @notice function to distribute rewards to all stakeholders
        @param _tokenAddress we will distribute the rewards associated to this tokenAddress
    */
    function distributeRewards(address _tokenAddress) onlyStakeholderOrOwnerOfContract(msg.sender)
    public onlyOwner {

        for (uint256 i = 0; i < stakeholders.length; i++ ){
            address stakeholder = stakeholders[i];
            uint256 reward = calculateReward(stakeholder, _tokenAddress);
            rewards[stakeholder] = rewards[stakeholder] + reward;
            //Conversion reward de _tokenAddress vers stakeCoinToken
            //
            stakeCoinToken.mint(address(this),rewards[stakeholder]);
            stakeCoinToken.transfer(stakeholder, rewards[stakeholder]);

        }

        emit RewardsDistributed(msg.sender, _tokenAddress);
    }

    /**
        @notice function for user to claim rewards
        @param _tokenAddress address of the token to get my reward
    */
    function claimRewards(address _tokenAddress) onlyStakeholderOrOwnerOfContract(msg.sender) public {

        uint256 reward = calculateReward(msg.sender, _tokenAddress) + rewards[msg.sender];
        rewards[msg.sender] = rewards[msg.sender] + reward;
    }

    /**
        @notice function to allow the stakeholder to withdraw his rewards
        @param _stakeholderAddress address of the stakeholder who wants to withdraw his rewards
        @param _tokenAddress token associated to this reward asked
    */
    function withdrawReward(address _stakeholderAddress, address _tokenAddress) onlyStakeholderOrOwnerOfContract(msg.sender) public {
        require(rewards[msg.sender] > 0);

        uint256 reward = rewards[_stakeholderAddress];
        //maybe the stakeholder will withdraw all his reward in one blow. Evidence: no argument in the signature of
        //the function

        //reward = calculateReward(msg.sender, _tokenAddress) + rewards[msg.sender];

        //ERC20Address._mint(msg.sender, reward);

        //to put the rewards at 0
        rewards[msg.sender] = 0;

        emit RewardWithdrawn(_stakeholderAddress, _tokenAddress);
    }
}

