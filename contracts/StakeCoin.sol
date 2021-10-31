// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import "@openzeppelin/contracts/access/Ownable.sol";

/**
    @title StakeCoin
    @author Alex
    @notice Creates a basic ERC20 staking token with incentive distribution
*/
contract StakeCoin is ERC20, Ownable {

    /**
        @notice the constructor for the Staking token
        @param _owner The address to receive all tokens
        @param _initialSupply The amount of initial tokens to mint on construction
    */
    constructor(address _owner, uint256 _initialSupply) public{

        _mint(_owner, _initialSupply);
    }







}
