const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const { passwordEncryption } = require("../utils/passwordEncryptor");
async function login(event, context) {

  try {
    const { password, phone } = JSON.parse(event.body);
    const incrypt_password = await passwordEncryption(password);
    var params = {
      FilterExpression: "contains(#phone, :phone) AND #password = :password ",
      ExpressionAttributeNames: { "#phone": "phone", "#password": "password" },
      ExpressionAttributeValues: {
        ':password': incrypt_password,
        ':phone': phone
      },
      TableName: "UserTable"
    };
    const result = await dynamodb
      .scan(params)
      .promise();

    return {
      statusCode: 201,
      body: JSON.stringify(result),
    };
  } catch (ex) {
    return {
      statusCode: 500,
      body: JSON.stringify(ex),
    };
  }
}

export const handler = login;