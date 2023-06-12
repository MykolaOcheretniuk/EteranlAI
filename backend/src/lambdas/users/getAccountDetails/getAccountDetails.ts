import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { validateAuthContextSchema } from "src/lambdas/types/validateAuthContextSchema";
import usersService from "src/services/usersService";
import {responseCreator} from "src/utils/responseCreator";

const getAccountDetails = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { userId } = event.requestContext.authorizer?.lambda;
    const accountDetails = await usersService.getAccountDetails(userId);
    return responseCreator.default(JSON.stringify(accountDetails), 200);
  } catch (err) {
    return responseCreator.error(err);
  }
};
export const handler = middy()
  .use(httpErrorHandler())
  .use(validator({ eventSchema: transpileSchema(validateAuthContextSchema) }))
  .handler(getAccountDetails);
