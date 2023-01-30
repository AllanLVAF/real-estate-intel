const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");
// const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const options = {
    region: process.env.region,
    credentials: {
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey,
    }
};
const ddbClient = new DynamoDB(options);
const ddbDocClient = DynamoDBDocument.from(ddbClient);

module.exports = ddbDocClient;
