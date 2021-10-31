const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const Staking = artifacts.require('Staking');

contract("Staking", accounts => {

    const owner = accounts[0];

    /**
     * Clean each time the instance of the smart contract
     */
    beforeEach(async function () {

        this.StakingInstance = await Staking.new({from: owner});
    });

    describe('Yield farming', async() => {

        it('Reverts if the amount given is equal to zero', async function() {

            await expectRevert(this.StakingInstance.depositTokens(0, {from:owner}),
            'amount cannot be 0');

        })
    });


})