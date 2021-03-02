const Migrations = artifacts.require("Migrations");
const PersonRecord = artifacts.require("PersonRecord");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(PersonRecord);
};
