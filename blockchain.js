const fs = require('fs');
const path = require('path');
const Web3 = require('web3');
const TruffleContract = require('@truffle/contract');
const { ownerDocument } = require('min-document');

const web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
const web3 = new Web3(web3Provider);

const createContractInstance = async artifactName => {
 const artifact = JSON.parse(fs.readFileSync(path.join(__dirname, 'build/contracts', `${artifactName}.json`)));
  const contract = TruffleContract(artifact);
  contract.setProvider(web3Provider);
  return contract.deployed();
};

let PersonRecord;
createContractInstance('PersonRecord').then(instace => {
    PersonRecord = instace;
    console.log(PersonRecord);
});

const addPerson = async (citizenId,firstName,lastName,age,gender,owner) => {
    const pid = Date.now();
    const date = pid.toString;
    const slip = await PersonRecord.addPerson(pid,citizenId,firstName,lastName,age,gender,date, {from: owner,gas:1000000});
    return {slip: slip , pid:pid};
};

const getPerson = async pid => {
    const person  = await PersonRecord.getPerson.call(pid);
    person.personid = pid;
    return person;
}

const getAccounts = () => web3.eth.getAccounts();

const unlockAccount = (address, password) => web3.eth.personal.unlockAccount(address, password);

module.exports = {
    addPerson,
    getPerson,
    getAccounts,
    unlockAccount
}