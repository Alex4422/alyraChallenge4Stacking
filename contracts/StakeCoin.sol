// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakeCoin is ERC20, Ownable {

    //========== variable used ==========
    uint256 private initialSupply;

    /**
        @dev initialises the token with the name & the symbol
     */
    constructor () ERC20('StakeCoin','STC') {
        initialSupply = 10000000000000000000;
    }

    function sendToOperator(address _operator) public onlyOwner {
        _mint(_operator, initialSupply);
    }



}
