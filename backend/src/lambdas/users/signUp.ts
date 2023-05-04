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
    const signInRequest = JSON.parse(event.body) as SignUpLoginModel;
    const a = await usersService.signUp(signInRequest);
    return { body: JSON.stringify(a), statusCode: 200 };
  } catch (err) {
    return { body: JSON.stringify(err), statusCode: 400 };
  }
};
