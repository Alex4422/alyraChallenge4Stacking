// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

import './StackCoin.sol';

contract Stacking {

    string public name = 'Stacking';
    address public owner;
    StackCoin public stackCoin;

    //the different participants for our stacking contract
    address[] public stakers;

    //the amount deposited by the stackers (= address)
    mapping(address => uint) public stakingBalance;

    //this stacker (= address) has stacked?
    mapping(address => bool) public hasStaked;

    //this stacker (= address) is stacked?
    mapping(address => bool) public isStaked;

    /**
     * @dev Sets the value for {stackCoin}.
     */
    constructor(StackCoin _stackCoin) public {
        stackCoin = _stackCoin;
    }

    /**
     * title depositTokens
     * @author Alex
     * @notice allows the stakers to put money in this contract
     * @dev I use transferFrom from OpenZeppelin
     * @param _amount
     */
    function depositTokens(uint _amount) public {

        //transfer stackCoin tokens to this contract address for this stakingBalance
        stackCoin.transferFrom(msg.sender, address(this), _amount);

        //update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        if(!hasStaked) {
            stakers.push[msg.sender];
        }

        //update staking balance
        isStaked[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }
}
