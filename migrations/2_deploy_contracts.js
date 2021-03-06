const Token = artifacts.require('Token');
const PersonRecord = artifacts.require('PersonRecord');

module.exports = function(deployer, networks, accounts) {
  deployer
    .deploy(Token, 10000000)
    .then(async () => {
      const tokenContract = await Token.deployed();
      return deployer.deploy(PersonRecord, tokenContract.address);
    })
    .then(async () => {
      const token = await Token.deployed();
      const coinbase = accounts[0];
      const value = 500;
      await token.transfer(coinbase, accounts[1], value);
    });
};
