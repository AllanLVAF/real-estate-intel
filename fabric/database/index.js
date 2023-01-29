const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");
// const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

const options = {
    region: "us-west-2",
    credentials: {
        accessKeyId: "AKIATPG6MO7F4NUV4DWO",
        secretAccessKey: "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",
    }
};
const ddbClient = new DynamoDB(options);
const ddbDocClient = DynamoDBDocument.from(ddbClient);

module.exports = ddbDocClient;
