const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const Staking = artifacts.require('Staking');
const StakeCoin = artifacts.require('StakeCoin');

contract("Staking", accounts => {

    const owner = accounts[0];
    const stakeholder1 = accounts[1];
    const stakeholder2 = accounts[2];
    const amount1 = new BN('10');
    const amount2 = new BN('20');
    const stakingBalanceTest = new BN('0');
    //const initialStakeCoinSupply = new BN('10').pow(new BN('18'));

    function tokens(number) {
        return web3.utils.toWei(number, 'ether')
    }

    /**
     * Clean each time the instance of the smart contract
     */
    beforeEach(async function () {

        //this.stakeCoinInstance = await StakeCoin.new(new BN('10').pow(new BN('18')));
        this.stakeCoinInstance = await StakeCoin.new();
        this.stakingInstance = await Staking.new(this.stakeCoinInstance.address);
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

            const amountTransferred = new BN('100');

            //make all the operations needed before
            await this.stakingInstance.addStakeholder(stakeholder1, {from: owner});
            // Transfer 100 mock Stake coin to stakeholder1
            await this.stakeCoinInstance.transfer(stakeholder1, amountTransferred, {from: owner})

        });

        it('9. Management of the stake', async function() {

            const amountTransferred = new BN('100');
            const amountStaked = new BN('100');

            let result;

            //Check: stakeholder1 balance - stakeholder1 mock wallet balance before staking
            result = (await this.stakeCoinInstance.balanceOf(stakeholder1)).toString();
            console.log('result, balance of SK1:', result);
            expect(result).to.be.bignumber.equal(amountTransferred);

            // Check Staking For stakeholder1 of 100 tokens
            await this.stakeCoinInstance.approve(this.stakingInstance.address, amountStaked, {from: stakeholder1});
            await this.stakingInstance.createStake(amountStaked, this.stakeCoinInstance.address, {from: stakeholder1});

            // Check Updated Balance of stakeholder1
            result = (await this.stakeCoinInstance.balanceOf(stakeholder1)).toString();
            //stakeholder1 mock wallet balance after staking 100 tokens
            expect(result).to.be.bignumber.equal(new BN('0'));

            // Check Updated Balance of Staking SC
            result = (await this.stakeCoinInstance.balanceOf(this.stakingInstance.address)).toString();

            //Staking SC mock wallet balance after staking from stakeholder1
            expect(result).to.be.bignumber.equal(amountStaked);

            // Is Staking Update
            result = (await this.stakingInstance.isStaking(stakeholder1)).toString();
            //stakeholder1 is staking status after staking
            expect(result).to.equal('true');

            // distribute Rewards -- doesn't work, why? to investigate
            const rewardCalculation = await this.stakingInstance.calculateReward(stakeholder1, this.stakeCoinInstance.address);
            //await this.stakingInstance.distributeRewards(this.stakeCoinInstance.address, {from: owner});

            // Ensure Only the owner can distribute Tokens
            //await this.stakingInstance.distributeRewards({from: stakeholder1}).should.be.rejected;

            await expectRevert( this.stakingInstance.distributeRewards(this.stakeCoinInstance.address, {from: stakeholder1}),
                'Ownable: caller is not the owner');

            //The staking balance must be greater than 0 in the function removeStake - NO !
            //await expectRevert( this.stakingInstance.removeStake(this.stakeCoinInstance.address, {from: stakeholder1}),
              //  'Staking balance cannot be less than 0');

            // Remove stake
            //await this.stakingInstance.removeStake(this.stakeCoinInstance.address, {from: stakeholder1});

            // Check Unstaking Balances: stakeholder1 mock wallet balance after unstaking
            result = (await this.stakeCoinInstance.balanceOf(stakeholder1)).toString();
            //expect(result).to.be.bignumber.equal(amountStaked);

            // Check Updated Balance of Staking SC: Staking mock wallet balance after staking from stakeholder1
            result = (await this.stakeCoinInstance.balanceOf(this.stakingInstance.address)).toString();
            //expect(result).to.be.bignumber.equal(new BN('0'));

            // Is Staking Update
            result = (await this.stakingInstance.isStaking(stakeholder1)).toString();
            //expect(result).to.equal('false');
        });

        xit('10. Checks stakeOf', async function() {

            //let stakedAmount = new BN('10');

            const stakedAmount = web3.utils.toWei('1', 'ether');

            await this.stakeCoinInstance.approve(this.stakingInstance.address, stakedAmount, {from: owner});
            await this.stakingInstance.createStake(stakedAmount, stakeCoinAddress);

            //let result = await this.stakingInstance.stakeOf(stakeholder1, stakeCoinAddress);
            let currentStakeOf = await this.stakingInstance.stakeOf[stakeholder1][stakeCoinAddress][1].amount;

            expect(currentStakeOf).to.equal(stakedAmount);

            //console.log('result', result);

        });

        xit('11. Transfer between 2 users', async function() {
            // We transfer some tokens to stakeholder1
            await this.stakeCoinInstance.transfer(stakeholder1, amount1, {from:owner});

            /* we use the balanceOf function of stakeCoinInstance to check that stakeholder1 has received the tokens and which corresponds to amount1 */
            const balance = await this.stakeCoinInstance.balanceOf(stakeholder1);
            expect(balance).to.be.bignumber.equal(amount1);

            //We test if the function "transferFrom" works
            let ownerBalanceBeforeTransfer = await this.stakeCoinInstance.balanceOf(owner);
            let stakeholder2BalanceBeforeTransfer = await this.stakeCoinInstance.balanceOf(stakeholder2);

            await this.stakeCoinInstance.approve(stakeholder1, amount1, {from:owner});
            await this.stakeCoinInstance.transferFrom(owner, stakeholder2, amount1, {from: stakeholder1});

            let ownerBalanceAfterTransfer = await this.stakeCoinInstance.balanceOf(owner);
            let stakeholder2BalanceAfterTransfer = await this.stakeCoinInstance.balanceOf(stakeholder2);

            expect(ownerBalanceAfterTransfer.toString()).to.be.equal((ownerBalanceBeforeTransfer.sub(amount1).toString()));
            expect(stakeholder2BalanceAfterTransfer.toString()).to.be.equal(stakeholder2BalanceBeforeTransfer.add(amount1).toString());

        });


        /**
         * Zone of the management (removing) of the stakes
         */ //How is the process?
        describe('D. removing stakes', function() {

            xit('12. Test of the stake deletion', async function() {

            });

        });


        /**
         * Zone of the calculation of the reward
         */
        describe('E. Calculating of the reward', function() {

            beforeEach( async function() {

                //make all the operations needed before
                await this.stakingInstance.addStakeholder(stakeholder1, {from: owner});
                const receipt = await this.stakingInstance.createStake(new BN('10'), stakeCoinAddress, {from: owner});

            });



            xit('13. Sends an event when the reward is calculated', async function() {

                //expectEvent( await this.stakingInstance.calculateReward()...)
            });
        });


        /**
         * Zone of the management of the reward
         */
        describe('F. Reward management zone', function() {

            beforeEach( async function() {

                //make all the operations needed before
                await this.stakingInstance.addStakeholder(stakeholder2, {from: owner});

                await this.stakeCoinInstance.approve(stakeholder1, amount1, {from:owner});
                await this.stakeCoinInstance.transferFrom(owner, stakeholder2, amount1, {from: stakeholder1});
            });

            it('14. Revert operation: rewards can only be distributed by the contract owner', async function () {

                await expectRevert(this.stakingInstance.distributeRewards(this.stakeCoinInstance.address, {from: stakeholder2}),
                    "Ownable: caller is not the owner");

            });

            xit('15. Sends an event after the rewards are distributed.', async function () {

                expectEvent( await this.stakingInstance.distributeRewards(this.stakeCoinInstance.address, {from: owner}),
                    'RewardsDistributed', {stakeholderAddress: owner, tokenAddress: this.stakeCoinInstance.address});
            });

            it('16. Reverts withdrawn operation if there is no reward to withdraw', async function () {

                await expectRevert(this.stakingInstance.withdrawReward(), 'No reward to withdraw');
            });

            xit('17. Rewards can be withdrawn', async function () {

                expectEvent( await this.stakingInstance.withdrawReward(),
                    'RewardWithdrawn', {stakeholderAddress: owner});
            });

        });

    });
})
