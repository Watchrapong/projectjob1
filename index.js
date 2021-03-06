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
    const {citizenIdInput,firstNameInput,lastNameInput,ageInput,genderInput,ownerInput,accountPassword} = request.body;
    const { file } = request;
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.mimetype)) {
      fs.unlinkSync(file.path);
      return response.json({
        success: false,
        error: 'Please upload a file as jpeg, png, or gif.',
      });
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      fs.unlinkSync(file.path);
      return response.json({
        success: false,
        error: 'Please upload smaller file. (10MB)',
      });
    }
    if (!citizenIdInput||!firstNameInput||!lastNameInput||!ageInput||!genderInput||!ownerInput||!accountPassword) {
      return response.json({
        success: false,
        error: 'Please fill the form.',
      });
    }

    const personImagePath = 'images/' + file.filename;

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
  //เงื่อนไขที่เลขบัตรประชาชนซ้ำ

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

  app.listen(appPort, () => console.log(`Server is running! it is listening on port ${appPort}...`));
