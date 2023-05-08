import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { SignUpLoginModel } from "src/models/users/signUpLogin";
import usersService from "src/services/usersService";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return { body: JSON.stringify("JSON body is missing"), statusCode: 400 };
    }
    if (!event.pathParameters) {
      return {
        body: JSON.stringify("Path params is missing"),
        statusCode: 400,
      };
    }
    const { action } = event.pathParameters;
    const request = JSON.parse(event.body) as SignUpLoginModel;
    switch (action) {
      case "login":
        const loginResult = await usersService.login(request);
        return { body: JSON.stringify(loginResult), statusCode: 200 };
      case "signUp":
        const signUpResult = await usersService.signUp(request);
        return { body: JSON.stringify(signUpResult), statusCode: 200 };
      default: {
        return {
          body: JSON.stringify("Incorrect path parameters"),
          statusCode: 400,
        };
      }
    }
  } catch (err) {
    return { body: JSON.stringify(`${err}`), statusCode: 400 };
  }
};
