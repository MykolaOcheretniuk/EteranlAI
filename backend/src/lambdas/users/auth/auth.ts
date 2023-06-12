import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import validator from "@middy/validator";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventPathParameters,
  APIGatewayProxyResultV2,
} from "aws-lambda/trigger/api-gateway-proxy";
import { SignUpLoginModel } from "src/models/users/signUpLogin";
import usersService from "src/services/usersService";
import {responseCreator} from "src/utils/responseCreator";
import { Action, bodySchema, pathParamsSchema } from "./types";
import { transpileSchema } from "@middy/validator/transpile";
const auth = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResultV2> => {
  try {
    const payload = event.body as unknown as SignUpLoginModel;
    const { action } =
      event.pathParameters as APIGatewayProxyEventPathParameters;
    switch (action) {
      case Action.login:
        const { accessToken, refreshToken } = await usersService.login(payload);
        return responseCreator.default(
          JSON.stringify({ accessToken: accessToken }),
          200,
          {
            "Set-Cookie": `refreshToken=${refreshToken}; HttpOnly`,
          }
        );
      case Action.signUp:
        await usersService.signUp(payload);
        return { statusCode: 200 };
    }
    return { statusCode: 200 };
  } catch (err) {
    return responseCreator.error(err);
  }
};

export const handler = middy()
  .use(jsonBodyParser())
  .use(validator({ eventSchema: transpileSchema(bodySchema) }))
  .use(validator({ eventSchema: transpileSchema(pathParamsSchema) }))
  .use(httpErrorHandler())
  .handler(auth);
