// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

import './StakeCoin.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import "@openzeppelin/contracts/access/Ownable.sol";

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
     * @notice The stakes for each stakeholder
     */
    mapping(address => uint256) internal stakes;

    /**
     * @notice Number of staking slot
     */
    uint slotsAvailable = 100;

    /**
     * @notice The accumulated rewards for each stakeholder
     */
    mapping(address => uint256) internal rewards;


    /**
        @notice determines if the address Ethereum is stakeHolder or not
        @param _address are you a stakeholder?
        @return bool whether you are stakeholder or not
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
        @dev writing to memorize
        @param _stakeholder a new stakeholder to add
    */
    function addStakeholder(address _stakeholder) public {

        (bool _isStakeholder, ) = isStakeholder(_stakeholder);

        if(!_isStakeholder) stakeholders.push(_stakeholder);
    }

    /**
        @notice allows to delete a stakeholder from the dynamic array
        @param _stakeholder the stakeholder to remove from the dynamic array
        @dev writing to memorize
    */
    function removeStakeholder(address _stakeholder) public {

        (bool _isStakeholder, uint256 s) = isStakeholder(_stakeholder);

        if (_isStakeholder) {
            stakeholders[s] = stakeholders[stakeholders.length - 1];
            stakeholders.pop();
        }
    }

    /**
        @notice get the amount of stake of a X StakeHolder
        @param _addressStakeHolder the address of the stakeHolder to put in order to get the stake
        @return The sum in wei
    */
    function stakeOf(address _addressStakeHolder) public view returns (uint256){

        return(stakes[_addressStakeHolder]);
    }

    /**
        @notice aggregates all the stakes of all stakeholders
        @return uint256 The sum of the stakes from all stakeholders
    */
    function sumOfStakes() public view returns(uint256){

        uint256 sumStakes = 0;
        for(uint256 i=0; i < stakeholders.length; i += 1){
            sumStakes = sumStakes + stakes[stakeholders[i]] ;
        }

        return sumStakes;
    }

    /**
        @notice a method for a stakeholder to create a stake
        @param _stake The size of the stake to be created
    */
    function createStake(uint256 _stake) public {

        if(stakes[msg.sender] == 0){
            slotsAvailable--;
            addStakeholder(msg.sender);
        }

        stakes[msg.sender] = stakes[msg.sender] + _stake;
    }

    /**
        @notice a method for a stakeholder to remove a stake
        @param _stake The size of the stake to be removed
    */
    function removeStake(uint256 _stake) public{

        stakes[msg.sender] = stakes[msg.sender] - _stake;

        if(stakes[msg.sender] == 0){
            removeStakeholder(msg.sender);
            slotsAvailable++;
        }
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
    function totalRewards() public view returns(uint256){

        uint256 totalRewards = 0;

        for(uint256 i=0; i<stakeholders.length; i++){
            totalRewards = totalRewards + rewards[stakeholders[i]];
        }

        return totalRewards;
    }

    /**    **** CHANGE THE FORMULA ******
        @notice function to calculate rewards for each stakeholder
        @param _stakeholder The stakeholder to calculate rewards for
        @return uint256 The reward calculated by the formula
    */
    function calculateReward(address _stakeholder) public view returns(uint256){

        return stakes[_stakeholder] * 60 / 100;

    }

    /**
        @notice function to distribute rewards to all stakeholders
    */
    function distributeRewards() public onlyOwner {

        for (uint256 i = 0; i < stakeholders.length; i++ ){
            address stakeholder = stakeholders[i];
            uint256 reward = calculateReward(stakeholder);
            rewards[stakeholder] = rewards[stakeholder] + reward;
        }
    }

    /**
        @notice function to allow the stakeholder to withdraw his rewards
    */
    function withdrawReward() public {

        uint256 reward = rewards[msg.sender];
        //maybe the stakeholder will withdraw all his reward in one blow
        if(rewards[msg.sender] == 0){
            slotsAvailable++;
        }

        //rewards[msg.sender] = 0;
        //_mint(msg.sender, reward);  NO!


    }
}

