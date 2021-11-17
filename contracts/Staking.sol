// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

import './StakeCoin.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/**
    @title Staking
    @author Alex
    @notice allows to deposit tokens and invests in a business

*/
contract Staking is Ownable {

    /**
     * @notice to know who are all the stakeholders
     */
    address[] internal stakeholders;

    /**
     * @notice The stakes for each stakeholder for each tokens
     */
    mapping(address => mapping(address => uint256)) internal stakesAmount;

    /**
     * @notice To have the date when the stakes for each stakeholder and each token were put in the pool
     */
    mapping(address => mapping(address => uint256)) internal stakesTimestamp;

    /**
     * @notice Number of staking slot
     */
    uint slotsAvailable = 100;

    //reason to tell
    //IERC20 private ERC20Address;
    ERC20 private ERC20Address;

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
     *  @notice list of the events used
     */
    event StakeholderAdded(address stakeholderAddress);         //admin modifier onlyOwner
    event StakeholderRemoved(address stakeholderAddress); //admin
    event StakeCreated(address stakeholderAddress, uint256 stakeholderStake, address tokenAddress);   //admin & user modifier onlyStakeholderOrOwnerOfContract to check
    event StakeRemoved(address stakeholderAddress, uint256 stakeholderStake, address tokenAddress);     //admin & user
    event RewardCalculated(address stakeholderAddress, uint reward, address tokenAddress); //admin & user
    event RewardsDistributed(address stakeholderAddress, address tokenAddress);    //admin & user
    event RewardWithdrawn(address stakeholderAddress, address tokenAddress);       //admin & user

    /**
        @notice modifier to check if the current address is a stakeholder/admin or not
    */
    /*modifier onlyStakeholderOrOwnerOfContract(address _address){
        uint256 i;
        require(isStakeholder(_address) == true || msg.sender == ownerOfContract, "this address is not a stakeholder");
        _;
    }*/

    /**
        @notice to deploy ERC20 token
        @param _ERC20Address address of the token to deploy
    */
    constructor(address _ERC20Address) {
        require(_ERC20Address != address(0));
        ownerOfContract = msg.sender;
        //ERC20Address = IERC20(_ERC20Address);
        ERC20Address = ERC20(_ERC20Address);
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

        if(!_isStakeholder) stakeholders.push(_stakeholder);

        emit StakeholderAdded(_stakeholder);
    }

    /**
        @notice allows to delete a stakeholder from the dynamic array
        @param _stakeholder the stakeholder to remove from the dynamic array
        <!> it works with Remix!
    */
    function removeStakeholder(address _stakeholder) onlyOwner public {

        (bool _isStakeholder, uint256 s) = isStakeholder(_stakeholder);

        if (_isStakeholder) {
            stakeholders[s] = stakeholders[stakeholders.length - 1];
            stakeholders.pop();
        }

        emit StakeholderRemoved(_stakeholder);

    }

    /**
        @notice get the amount of stake of a X StakeHolder
        @param _addressStakeHolder the address of the stakeHolder to put in order to get the stake
        @return The sum in wei
    */
    function stakeOf(address _addressStakeHolder, address _tokenAddress) public view returns (uint256,uint256){

        return(stakesAmount[_addressStakeHolder][_tokenAddress], stakesTimestamp[_addressStakeHolder][_tokenAddress]);
    }

    /**
        @notice aggregates all the stakes of all stakeholders
        @return uint256 The sum of the stakes from all stakeholders
    */
    function sumOfStakes(address _tokenAddress) public view returns(uint256){

        uint256 sumStakes = 0;
        for(uint256 i=0; i < stakeholders.length; i += 1){
            sumStakes = sumStakes + stakesAmount[stakeholders[i]][_tokenAddress];
        }

        return sumStakes;
    }

    /**
        @notice a method for a stakeholder to create a stake
        @param _stake The size of the stake to be created
    */
    function createStake(uint256 _stake, address _tokenAddress) public {

        //stakesAmount for one stakeholder and one tokenAddress
        if(stakesAmount[msg.sender][_tokenAddress] == 0){
            slotsAvailable--;
            addStakeholder(msg.sender);
        }

        stakesAmount[msg.sender][_tokenAddress] += _stake;
        stakesTimestamp[msg.sender][_tokenAddress] = block.timestamp;

        emit StakeCreated(msg.sender, _stake, _tokenAddress);
    }

    /**
        @notice a method for a stakeholder to remove a stake
        @param _stake The size of the stake to be removed
    */
    function removeStake(uint256 _stake, address _tokenAddress) public{

        stakesAmount[msg.sender][_tokenAddress] -= _stake;

        if(stakesAmount[msg.sender][_tokenAddress] == 0){
            removeStakeholder(msg.sender);
            slotsAvailable++;
        }

        emit StakeRemoved(msg.sender, _stake, _tokenAddress);
    }

    /**
        @notice function to allow the stakeholder to check his rewards
        @param _stakeholder to point out the stakeholder identity address
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
        @param _stakeholder The stakeholder to calculate rewards for
        @return uint256 The reward calculated by the formula
    */
    function calculateReward(address _stakeholder, address _tokenAddress) public returns(uint256){

        uint reward;

        /*
        uint now = block.timestamp;
        //Rate - 5%
        uint rate = 5;
        //Dt
        uint dt = now - stakesTimestamp[_stakeholder][_tokenAddress];
        //Perodicity - 1 rate / jour
        uint perio = dt / 1 days;
        //StakeAmount
        uint reward = stakesAmount[_stakeholder][_tokenAddress] * rate / 100 * perio;*/

        //simple case
        //uint reward = stakesAmount[_stakeholder][_tokenAddress] * 5 / 100 *  ((block.timestamp - stakesTimestamp[_stakeholder][_tokenAddress]) / 1 days);

        //complex case - for two successive stakes, the previous calculation doesn't work! reward = 2 instead reward = 3
        /*for (uint256 i = 0; stakesAmount.length; i++) {
            reward = reward + stakesAmount[_stakeholder][_tokenAddress] * 5 / 100 *  ((block.timestamp - stakesTimestamp[_stakeholder][_tokenAddress]) / 1 days);
        }*/

        emit RewardCalculated(_stakeholder, reward, _tokenAddress);
        return reward;
    }

    /**
        @notice function to distribute rewards to all stakeholders
    */
    function distributeRewards(address _tokenAddress) public onlyOwner {

        for (uint256 i = 0; i < stakeholders.length; i++ ){
            address stakeholder = stakeholders[i];
            uint256 reward = calculateReward(stakeholder, _tokenAddress);
            rewards[stakeholder] = rewards[stakeholder] + reward;
        }

        emit RewardsDistributed(msg.sender, _tokenAddress);         //to check
    }

    /**
        @notice function for user to claim rewards
    */
    function claimRewards(address _tokenAddress) public {           //public onlyStakeholder

        uint256 reward = calculateReward(msg.sender, _tokenAddress);
        //rewards[stakeholder] = rewards[msg.sender] + reward;
        rewards[msg.sender] = rewards[msg.sender] + reward;   //Is it that?

    }

    /**
        @notice function to allow the stakeholder to withdraw his rewards
    */
    function withdrawReward(address _stakeholderAddress, address _tokenAddress) public {
        require(rewards[msg.sender] == 0);

        uint256 reward = rewards[msg.sender];
        //maybe the stakeholder will withdraw all his reward in one blow. Evidence: no argument in the signature of
        //the function

        //ERC20Address._mint(msg.sender, reward);

        //to put the rewards at 0
        rewards[msg.sender] = 0;

        emit RewardWithdrawn(_stakeholderAddress, _tokenAddress);       //to check
    }
}

