// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.9;

import './StakeCoin.sol';

/**
    @title Staking
    @author Alex
    @notice allows to deposit tokens and invests in a business

*/
contract Staking {

    //************* variables *************
    //to watch the stakeholders
    address[] internal stakeholders;

    //The stakes for each stakeholder
    mapping(address => uint256) internal stakes;

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

    //(bool _isStakeholder, ) = isStakeholder(_stakeholder);

    //if (_isStakeholder) stakeholders.remove(_stakeholder);

    (bool _isStakeholder, uint256 s) = isStakeholder(_stakeholder);

    if (_isStakeholder) {
        stakeholders[s] = stakeholders[stakeholders.length - 1];
        stakeholders.pop();
    }

    }





}

