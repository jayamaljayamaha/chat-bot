
'use strict';

const AWS = require('aws-sdk');
const fileUtils = require('./fileUtils')

const SES = new AWS.SES();

module.exports.sendemail = async () => {
    
    let data = await fileUtils.getAllData();
    console.log(data);
    let tasks = "";
    if(data== ""){
        tasks = "No any tasks"
    } else {
        tasks = data
    }
    

    let to = "jayamaljayamaha2@gmail.com";
    let from ="jayamaljayamaha2@gmail.com";
    let subject = "Daily tasks";
    let text = tasks;

    const params = {
        Destination: {
            ToAddresses: [ to ]
        },
        Message: {
            Body: {
                Text: { Data : tasks }
            },
            Subject: {
                Data: subject
            }
        },

        Source: from
    }
    console.log(params)
    await SES.sendEmail(params).promise();

    const response = {
        statusCode: 200,
        body: JSON.stringify({ "msg": "Success" })
    }
    return response;
}
    