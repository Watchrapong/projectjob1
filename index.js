const express = require('express');
const bodyParser = require('body-parser');
const {
    addPerson,
    getPerson,
    getAccounts,
    unlockAccount
}=require('./blockchain');
// const { json } = require('body-parser');
// const { body } = require('min-document');


const app = express();
const appPort = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (request, response, next) => {
   response.send('Hello! Welcome to Application!');
});

app.listen(appPort, () => console.log(`Server is running! it is listening on port ${appPort}...`));

app.post('/person/add',async (request, response) => {
    try {
    const {citizenIdInput,firstNameInput,lastNameInput,ageInput,genderInput,ownerInput,accountPassword} = request.body;
    const unlocked = await unlockAccount(ownerInput, accountPassword);
    if (!unlocked) {
      return response.json({
        success: false,
        error: 'Please type correct account password.',
      });
    }
    const dataResult = await addPerson(citizenIdInput,firstNameInput,lastNameInput,ageInput,genderInput,ownerInput);
    return response.json({
      success: true,
      data: { pid: dataResult.pid, transactionSlip: dataResult.slip}, 
      error: null,
    });
    }catch (error) {
        return response.json({
          success: false,
          error: error.message,
        });
      }
  });

  app.post('/person/:pid', async (request, response) => {
    try {
       const { pid } = request.params;
        const result = await getPerson(pid);
        return response.json({
           success: true,
           data: result,
           error: null,
        });
    }
    catch (error) {
      return response.json({
        success: false,
        error: error.message,
      });
    }
  });

