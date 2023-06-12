import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { UserUpdate } from "src/models/users/user";
import usersService from "src/services/usersService";
import { responseCreator } from "src/utils/responseCreator";
import { validateAuthContextSchema } from "../../types/validateAuthContextSchema";
import { updateAccountInfo } from "./types";

const updateAccountDetails = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { userId } = event.requestContext.authorizer?.lambda;
    const userUpdate = event.body as unknown as UserUpdate;
    const result = await usersService.updateUser(userUpdate, userId);
    return responseCreator.default(JSON.stringify(result), 200);
  } catch (err) {
    return responseCreator.error(err);
  }
};
export const handler = middy()
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(validator({ eventSchema: transpileSchema(validateAuthContextSchema) }))
  .use(validator({ eventSchema: transpileSchema(updateAccountInfo) }))
  .handler(updateAccountDetails);
