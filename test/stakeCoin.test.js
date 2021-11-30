const { BN, ether, constants, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect, assert} = require("chai");
const ERC20Token = artifacts.require("./StakeCoin");

contract("ERC20", (accounts) => {

    const _name = "Stake Coin Token";
    const _symbol = "STC";
    const _initialStakeCoinSupply = new BN(10).pow(new BN(18));
    const [owner, user, recipient] = accounts;

    /**
     * Clean each time the instance of the smart contract
     */
    beforeEach(async () => {
        erc20 = await ERC20Token.new(_initialStakeCoinSupply, {from: owner});
    });

    /**
     * Zone of basic tests for ERC20 token
     */
    describe('A. Basic tests for ERC20 token', () => {
        it("1. Has a name", async () => {
            expect(await erc20.name()).to.equal(_name);
        });

        it("2. Has typeOf string for name", async () => {
            assert.typeOf(_name, "string");
        });

        it("3. Has a symbol", async () => {
            expect(await erc20.symbol()).to.equal(_symbol);
        });

        it("4. Checks _initialSupply after a deploy", async () => {

            let response = await erc20.totalSupply({ from: owner});
            expect(response).to.be.bignumber.equal(_initialStakeCoinSupply);
        });

        it("5. Checks owner's balance", async () => {

            let ownerBalance = await erc20.balanceOf(owner);
            let stakeCoinTotalSupply = await erc20.totalSupply();

            expect(ownerBalance).to.be.bignumber.equal(stakeCoinTotalSupply);
        });
    });

    /**
     *  Transfer operation tests zone
     */
    describe('B. Tests of the transfer operation tests', () => {

        it("6. Checks if the transfer of tokens between X and Y is successful", async () => {

            let balanceOwnerBeforeTransfer = await erc20.balanceOf(owner);
            let balanceRecipientBeforeTransfer = await erc20.balanceOf(recipient);

            let amount = new BN(10);
            await erc20.transfer(recipient, amount, { from : owner});

            let balanceOwnerAfterTransfer = await erc20.balanceOf(owner);
            let balanceRecipientAfterTransfer = await erc20.balanceOf(recipient);

            expect( balanceOwnerAfterTransfer).to.be.bignumber.equal(balanceOwnerBeforeTransfer.sub(amount));
            expect( balanceRecipientAfterTransfer).to.be.bignumber.equal(balanceRecipientBeforeTransfer.add(amount));
        });

        it("7. We test the event related to the function transfer", async () => {

            expectEvent(await erc20.transfer(recipient, new BN(20), {from: owner}),
                "Transfer",{from: owner, to: recipient, value: new BN(20) });
        });
    });

    /**
     *  Revert operation tests zone
     */
    describe("C. Revert operation tests", () => {

        it("8. Reverts when transfer recipient is address(0)", async () => {
           await expectRevert( erc20.transfer(constants.ZERO_ADDRESS, new BN(20), {from: owner}),
              "ERC20: transfer to the zero address" );
        });

        it("9. Reverts when the balance's off", async () => {
            await expectRevert(erc20.transfer(owner, new BN(20), {from: recipient}),
                "ERC20: transfer amount exceeds balance");
        });

        it("10. Reverts with the function transferFrom when the amount is not allowed", async () => {
            let amount = new BN(20);
            await expectRevert(erc20.transferFrom(owner, user, amount, { from: recipient}),
                "ERC20: transfer amount exceeds allowance");
        });
    });
});