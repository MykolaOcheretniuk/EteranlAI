import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { SignUpLoginModel } from "src/models/users/signUpLogin";
import usersService from "src/services/usersService";
import refreshAccessToken from "src/utils/refreshAccessToken";
import responseCreator from "src/utils/responseCreator";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return responseCreator.missedEventBody();
    }
    if (!event.pathParameters) {
      return responseCreator.missedPathParameters();
    }
    const { action } = event.pathParameters;
    const request = JSON.parse(event.body) as SignUpLoginModel;
    switch (action) {
      case "login":
        const { accessToken, refreshToken } = await usersService.login(request);
        return responseCreator.default(
          JSON.stringify({ accessToken: accessToken }),
          200,
          {
            "Set-Cookie": `refreshToken=${refreshToken}; HttpOnly`,
          }
        );
      case "signUp":
        await usersService.signUp(request);
        return responseCreator.default(JSON.stringify("User created"), 200);
      case "refresh":
        const { refreshToken: token } = JSON.parse(event.body);
        const access = await refreshAccessToken(token);
        return responseCreator.default(
          JSON.stringify({ accessToken: access }),
          200
        );
      default: {
        return responseCreator.default(
          JSON.stringify("Incorrect path parameters"),
          400
        );
      }
    }
  } catch (err) {
    return responseCreator.error(err);
  }
};
