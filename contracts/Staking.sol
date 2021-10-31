// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

import './StakeCoin.sol';

contract Staking {

    string public name = 'Staking';
    address public owner;
    StakeCoin public stakeCoin;

    //the different participants for our stacking contract
    address[] public stakers;

    //the amount deposited by the stackers (= address)
    mapping(address => uint) public stakingBalance;

    //this stacker (= address) has stacked?
    mapping(address => bool) public hasStaked;

    //this stacker (= address) is staking?
    mapping(address => bool) public isStaking;

    /**
     * @dev Sets the value for {stackCoin}.
     */
    constructor(StakeCoin _stakeCoin) public {
        stakeCoin = _stakeCoin;
    }

    /**
     * title depositTokens
     * @notice allows the stakers to put money in this contract
     * @dev I use transferFrom from OpenZeppelin
     * @param _amount the sum of token ERC20 to stake
     */
    function depositTokens(uint _amount) public {

        //require staking amount to be greater than 0
        require(_amount > 0, 'amount cannot be 0');

        //transfer stackCoin tokens to this contract address for this stakingBalance
        stakeCoin.transferFrom(msg.sender, address(this), _amount);

        //update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        //update staking balance
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }

    function issueTokens() public {
        //require the owner to issue tokens only
        require(msg.sender == owner, 'caller must be the owner');

        for (uint i=0; i<stakers.length; i++){
            address recipient = stakers[i];
            uint balance = stakingBalance(recipient);
            if(balance > 0) {
                rwd.transfer(recipient,balance);
            }
        }
    }

}

