const fs = require('fs');
const path = require('path');
const Web3 = require('web3');
const TruffleContract = require('@truffle/contract');

const web3Provider = new Web3.providers.HttpProvider('https://kovan.infura.io/v3/2af9d0ecfe494d44bf54963a71bffdec');
const web3 = new Web3(web3Provider);

const createContractInstance = async artifactName => {
 const artifact = JSON.parse(fs.readFileSync(path.join(__dirname, 'build/contracts', `${artifactName}.json`)));
  const contract = TruffleContract(artifact);
  contract.setProvider(web3Provider);
  return contract.deployed();
};

const getAccounts = () => web3.eth.getAccounts();


let personRecord;
createContractInstance('PersonRecord').then(instace => {
    personRecord = instace;
});

const addPerson = async (citizenId,firstName,lastName,age,gender) => {
    const date = Date.now();
    const slip = await personRecord.addPerson.call(citizenId,firstName,lastName,age,gender,date ,{from:getAccounts[0]});
    return {slip: slip , citizenId:citizenId};
};

const getPerson = async citizenId => {
    const person  = await personRecord.getPerson.call(citizenId);
    person.citizenId = citizenId;
    return person;
}


// const unlockAccount = (address, password) => web3.eth.personal.unlockAccount(address, password);

module.exports = {
    addPerson,
    getPerson,
    getAccounts,
    
   // unlockAccount
}

