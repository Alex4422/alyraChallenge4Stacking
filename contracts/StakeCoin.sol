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
        @notice the constructor for the Staking coin token
        @dev the owner is the admin of the interface
        @param initialStakeCoinSupply The amount of initial tokens to mint on construction
        <!> it works with Remix!
    */
    constructor(uint initialStakeCoinSupply) ERC20("Stake Coin Token", "STC") {
        _mint(owner(), initialStakeCoinSupply);
    }

    /**
     *   @notice produces some tokens for a smart contract
     *   @param to address of the recipient
     *   @param value amount of tokens to produce
     *   @return boolean did we produce some tokens?
     *  <!> it works with Remix!
     */
    function mint(address to, uint256 value) public onlyOwner returns (bool) {
        _mint(to, value);
        return true;
    }
}
