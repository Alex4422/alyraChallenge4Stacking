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
     * Management of the stakeholder adding zone
     */
    describe('A. Registering stakeholders', function() {

        it('1. Registers a stakeholder', async function () {

            await this.stakingInstance.addStakeholder(accounts[1], {from:owner});
            let stakeholdersAddresses = await this.stakingInstance.getStakeholders();

            expect(stakeholdersAddresses[0]).to.equal(accounts[1]);
        });

        it('2. Sends an event when a stakeholder is added to the list', async function() {

            expectEvent( await this.stakingInstance.addStakeholder(accounts[1], {from: owner}),
                'StakeholderAdded', {stakeholderAddress:accounts[1]});
        });

        it('3. Reverts adding a stakeholder if you are not the owner', async function() {

            await expectRevert( this.stakingInstance.addStakeholder(accounts[2], {from: stakeholder1}),
                'Ownable: caller is not the owner');
        });

        it('4. reverts -- adding the stakeholder -- if the address is already registered in the list', async function() {

            await this.stakingInstance.addStakeholder(accounts[2], {from: owner});
            await expectRevert( this.stakingInstance.addStakeholder(accounts[2], {from: owner}),
                'this address is already a stakeholder');
        });

    });

    /**
     * Management of the stakeholder removing zone
     */
    describe('B. Removing stakeholders', function() {

        beforeEach( async function() {

           //make all the operations needed before
            await this.stakingInstance.addStakeholder(stakeholder1, {from: owner});

        });

        xit('5. Removes a stakeholder', async function() {

            await this.stakingInstance.removeStakeholder(stakeholder1, {from:owner});
            let stakeholdersAddresses = await this.stakingInstance.getStakeholders();

            //NO!
            expect(stakeholdersAddresses[0]).to.equal(accounts[1]);
        });

        it('6. Sends an event when the stakeholder is removed from the list', async function () {

            expectEvent( await this.stakingInstance.removeStakeholder(stakeholder1, {from: owner}),
                'StakeholderRemoved',{stakeholderAddress: stakeholder1});
        });

        it('7. Reverts removing a stakeholder if you are not the owner', async function() {

            await expectRevert(this.stakingInstance.removeStakeholder(stakeholder1, {from: stakeholder2}),
                'Ownable: caller is not the owner');
        });

        it('8. reverts -- removing the stakeholder -- if the address is already removed from the list', async function() {

            await this.stakingInstance.removeStakeholder(stakeholder1, {from: owner});
            await expectRevert(this.stakingInstance.removeStakeholder(stakeholder1, {from: owner}),
                'this address (= stakeholder) is already removed');
        });

    });

    /**
     * Zone of the management (creation) of the stakes
     */
    describe('C. adding stakes', function() {

        it('1. Test of the stake creation', async function() {
            // We transfer some tokens to stakeholder1
            //await this.stakeCoinInstance.transfer(stakeholder1, amount1, {from:owner});

            //we use the balanceOf function of stakeCoinInstance to check that stakeholder1
            //has received the tokens and which corresponds to amount1
            //const balance = await this.stakeCoinInstance.balanceOf(stakeholder1);
            //expect(balance).to.equal(amount1);

            // We stake the event 'StakeCreated' when stakeholder1 stakes
            //expectEvent(await this.stakingInstance.createStake(amount1, {from: stakeholder1}),
            //'StakeCreated', {stakeholderStake: amount1 });

            // vérifier le montant staké (stakeOf)
        
    });


    /**
     * Zone of the management (removing) of the stakes
     */
    describe('C. removing stakes', function() {


    });





    /**
     *
     */
    /*
    describe('B. Tests of the different staking functions group', function() {


        })

    });
*/

})