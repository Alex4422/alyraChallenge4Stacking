const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const Staking = artifacts.require('Staking');
const StakeCoin = artifacts.require('StakeCoin');

contract("Staking", accounts => {

    const owner = accounts[0];
    const stakeholder1 = accounts[1];
    const stakeholder2 = accounts[2];
    const amount1 = new BN(10);
    const amount2 = new BN(20);

    /**
     * Clean each time the instance of the smart contract
     */
    beforeEach(async function () {

        this.stakingInstance = await Staking.new({from: owner});
        this.stakeCoinInstance = await StakeCoin.new({from: owner});
    });


    /**
     *
     */
    describe('A. Tests of the different functions', function() {

        it('1. stake creation test', async function() {
            // transferer des tokens à stakeholder1
            await this.stakeCoinInstance.transfer(stakeholder1, amount1, {from:owner});

            // stakeholder1 stake (on teste l'event)
            expectEvent(await this.stakingInstance.createStake(amount1, {from: stakeholder1}),
                'StakeCreated', {stakeholderStake: amount1 });

            // on utilise la fonction balanceOf de stakeCoinInstance pour vérifier que stakeholder1 a bien reçu
            // les tokens et qui correspond à amount1
            const balance = await this.stakeCoinInstance.balanceOf(stakeholder1);
            expect(balance).to.equal(amount1);

            // vérifier le montant staké (stakeOf)
        })

    });

    /**
     *  Management of the different events of the staking smart contract
     */
    describe('B. Tests of the events of the staking smart contract', function() {

        //need to specify {from: owner}?
        it('1. Sends an event after to have added a stakeholder', async function() {
            expectEvent(await this.stakingInstance.addStakeholder(stakeholder1, {from: owner}),
                'StakeholderAdded', {stakeholderAddress: stakeholder1 });
        });

        //need to specify {from: owner}?
        it('2. Sends an event after to have removed a stakeholder ', async function() {
            expectEvent( await this.stakingInstance.removeStakeholder(stakeholder1, {from:owner}),
                'StakeholderRemoved', {stakeholderAddress: stakeholder1});
        });

        it('3. Sends an event after the stake was created', async function() {
            expectEvent( await this.stakingInstance.createStake(amount2, {from:stakeholder2}),
                'StakeCreated', {stakeholderStake: amount2 });
        });

        it('4. Sends an event after the stake was removed', async function() {
            expectEvent( await this.stakingInstance.removeStake(amount2, {from:stakeholder2}),
                'StakeRemoved', {stakeholderStake: amount2});
        })

    });



    /*
    describe('Yield farming', async() => {

        it('Reverts if the amount given is equal to zero', async function() {

            await expectRevert(this.StakingInstance.depositTokens(0, {from:owner}),
            'amount cannot be 0');

        })
    });
    */

})