var StakeCoin = artifacts.require("./StakeCoin.sol");
var Staking = artifacts.require("./Staking.sol");

module.exports = async function (deployer) {

  await deployer.deploy(StakeCoin, 1e8);
  const token = await StakeCoin.deployed();
  await deployer.deploy(Staking, token.address);


};