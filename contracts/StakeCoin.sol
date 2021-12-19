// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";

/**
    @title StakeCoin
    @author Alex
    @notice Creates a basic ERC20 staking token with incentive distribution
*/
contract StakeCoin is Context, ERC20, Ownable {


    uint public initialStakeCoinSupply = 100 * 10 ** decimals();



    /*constructor(uint initialStakeCoinSupply) ERC20("Stake Coin Token", "STC") {
        _mint(owner(), initialStakeCoinSupply);
    }*/

    constructor() public ERC20("Stake Coin Token", "STC") {
        _mint(_msgSender(), 10000 * (10 ** uint256(decimals())));
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

    function transferCoin(address recipient, uint256 amount) public returns (bool success) {
        _transfer(msg.sender, recipient, amount);
        return(true);
    }

    function transferCoinFrom(address _from, address _to, uint256 _value) public returns (bool success) {

        transferFrom(_from,_to,_value);
        return true;
    }

    function approve(address owner, address spender, uint256 amount) public returns (bool) {
        _approve(owner, spender, amount);
        return true;
    }


}
