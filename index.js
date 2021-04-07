const fs = require('fs');
const path = require('path');
const Multer = require('multer');
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

const upload = Multer({ dest: 'public/images/', limits: { files: 1 } });
const MAX_IMAGE_SIZE_BYTES = 10485760;

const app = express();
const appPort = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (request, response, next) => {
   response.send('Hello! Welcome to Application!');
});


app.post('/person/add', upload.single('personImageInput'),async (request, response) => {
    try {
    const {citizenIdInput,firstNameInput,lastNameInput,ageInput,genderInput} = request.body;

    if (!citizenIdInput||!firstNameInput||!lastNameInput||!ageInput||!genderInput) {
      return response.json({
        success: false,
        error: 'Please fill the form.',
      });
    }

    // const unlocked = await unlockAccount(ownerInput, accountPassword);
    // if (!unlocked) {
    //   return response.json({
    //     success: false,
    //     error: 'Please type correct account password.',
    //   });
    // }

    const dataResult = await addPerson(citizenIdInput,firstNameInput,lastNameInput,ageInput,genderInput);
    return response.json({
      success: true,
      data: { citizenId: dataResult.citizenId, transactionSlip: dataResult.slip}, 
      error: null,
    });
    }catch (error) {
        return response.json({
          success: false,
          error: error.message,
        });
      }
  });
  //เงื่อนไขที่เลขบัตรประชาชนซ้ำ

  app.post('/person/:citizenId', async (request, response) => {
    try {
       const { citizenId } = request.params;
        const result = await getPerson(citizenId);
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

  app.listen(appPort, () => console.log(`Server is running! it is listening on port ${appPort}...`));
