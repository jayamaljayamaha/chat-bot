
const AWS = require('aws-sdk');

const s3Client = new AWS.S3();

module.exports.writeData = async (data) => {

    let oldData = await this.getAllData();

    const params = {
        Bucket: process.env.bucketName,
        Body: oldData + data,
        Key: "dailytasks.txt"
    }

    const newData = await s3Client.putObject(params).promise();

    if(!newData){
        throw Error("there was an error writing the file");
    }

}

module.exports.getAllData = async () => {
    const params = {
        Bucket: process.env.bucketName,
        Key: "dailytasks.txt"
    }

    let data = await s3Client.getObject(params).promise();
    

    if(!data){
        throw Error("there was an error reading the file");
    }
    console.log(data.Body.toString('ascii'));
    return data.Body.toString('ascii');
    
}