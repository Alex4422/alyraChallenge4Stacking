const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const Staking = artifacts.require('Staking');
const StakeCoin = artifacts.require('StakeCoin');

contract("Staking", accounts => {

    const owner = accounts[0];
    const stakeholder1 = accounts[1];
    const stakeholder2 = accounts[2];
    const stakeCoinAddress = accounts[3];
    const amount1 = new BN(10);
    const amount2 = new BN(20);
    const initialSupply = new BN(6000000);


    /**
     * Clean each time the instance of the smart contract
     */
    beforeEach(async function () {

        //Is it correct to write this? {from: owner}
        this.stakingInstance = await Staking.new(stakeCoinAddress);
        //this.stakingInstance = await Staking.new({from: owner}, stakeCoinAddress);
        this.stakeCoinInstance = await StakeCoin.new(1e8);

        //this.stakingInstance = await Staking.new(_ERC20Address ,{from: owner});
        //this.stakeCoinInstance = await StakeCoin.new(initialSupply, {from: owner});
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

        it('4. reverts the operation -- adding the stakeholder -- if this stakeholder (address) is already registered in the list', async function() {

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

        it('5. Removes a stakeholder', async function() {

            await this.stakingInstance.removeStakeholder(stakeholder1, {from:owner});
            let stakeholdersAddresses = await this.stakingInstance.getStakeholders();

            expect(stakeholdersAddresses.length === 0);
        });

        it('6. Sends an event when the stakeholder is removed from the list', async function () {

            expectEvent( await this.stakingInstance.removeStakeholder(stakeholder1, {from: owner}),
                'StakeholderRemoved',{stakeholderAddress: stakeholder1});
        });

        it('7. Reverts the operation -- removing a stakeholder -- if you are not the owner', async function() {

            await expectRevert(this.stakingInstance.removeStakeholder(stakeholder1, {from: stakeholder2}),
                'Ownable: caller is not the owner');
        });

        it('8. reverts the operation -- removing the stakeholder -- if this stakeholder (address) is already removed from the list', async function() {

            await this.stakingInstance.removeStakeholder(stakeholder1, {from: owner});
            await expectRevert(this.stakingInstance.removeStakeholder(stakeholder1, {from: owner}),
                'this address (= stakeholder) is already removed');
        });

    });

    /**
     * Zone of the management (creation) of the stakes
     */
    describe('C. adding stakes', function() {

        beforeEach( async function() {

            //make all the operations needed before
            await this.stakingInstance.addStakeholder(stakeholder1, {from: owner});

        });

        xit('9. Reverts the creation of the stake if the token address is false', async function() {
            //await expectRevert(this.stakingInstance.createStake(100,accounts[100], {from: stakeholder1}),
              //  'This token address is false');

        });

        xit('10. Reverts the creation of the stake if it is not an ERC20', async function() {
            //this.stakeCoinInstance.IERC20(stakeCoinAddress).totalSupply() = 0;
            //this.stakeCoinInstance.totalSupply() = 0;
            //IERC20(stakeCoinAddress).totalSupply() = 0;

            //await expectRevert(this.stakingInstance.createStake...)
        })

        it('11. Test of the stake creation', async function() {
            // We transfer some tokens to stakeholder1
            await this.stakeCoinInstance.transfer(stakeholder1, amount1, {from:owner});

            /* we use the balanceOf function of stakeCoinInstance to check that stakeholder1 has
            received the tokens and which corresponds to amount1 */
            const balance = await this.stakeCoinInstance.balanceOf(stakeholder1);

            expect(balance).to.be.bignumber.equal(amount1);

            // We stake the event 'StakeCreated' when stakeholder1 stakes
            await this.stakeCoinInstance.transferFrom(stakeholder1, amount1, {from:owner});

            //await this.stakingInstance.createStake(amount1, stakeCoinAddress, {from: stakeholder1});
            expectEvent(await this.stakingInstance.createStake(amount1, stakeCoinAddress, {from: stakeholder1}),
               'StakeCreated', {stakeholderAddress: stakeholder1,stakeholderStake: amount1, tokenAddress: stakeCoinAddress});

            // check the amount staked (stakeOf)

        });

        xit('12. Sends an event when the stake is created', async function() {

            expectEvent(await this.stakingInstance.createStake(amount2, stakeCoinAddress, {from: stakeholder1}),
            'StakeCreated', {stakeholderAddress: stakeholder1,stakeholderStake: amount2, tokenAddress: stakeCoinAddress});


        });

        /**
         * Zone of the management (removing) of the stakes
         */ //How is the process?
        describe('D. removing stakes', function() {

            xit('10. Test of the stake deletion', async function() {

            });


        });


        /**
         * Zone of the calculation of the reward
         */
        describe('E. Calculating of the reward', function() {

            xit(' . Sends an event when the reward is calculated', async function() {

                //expectEvent( await this.stakingInstance.calculateReward()...)
            });
        });


        /**
         * Zone of the management of the reward
         */
        describe('F. Reward management zone', function() {

            xit(' . Rewards can only be distributed by the contract owner', async function () {

                //expectEvent( await this.stakingInstance.___()...)
            });

            xit(' . Rewards are distributed.', async function () {

                //expectEvent( await this.stakingInstance.___()...)
            });

            xit(' . Rewards can be withdrawn', async function () {

                //expectEvent( await this.stakingInstance.___()...)
            });


        });

    });
})
