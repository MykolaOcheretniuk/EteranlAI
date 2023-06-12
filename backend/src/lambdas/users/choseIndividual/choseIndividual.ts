import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResultV2,
} from "aws-lambda/trigger/api-gateway-proxy";
import { validateAuthContextSchema } from "src/lambdas/types/validateAuthContextSchema";
import { ChoseIndividual } from "src/models/users/choseIndividualModel";
import usersService from "src/services/usersService";
import { responseCreator } from "src/utils/responseCreator";
import { choseIndividualBody } from "./types";

const choseIndividual = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResultV2> => {
  try {
    const { userId } = event.requestContext.authorizer?.lambda;
    const { individual } = event.body as unknown as ChoseIndividual;
    await usersService.setIndividual(individual, userId);
    return { statusCode: 200 };
  } catch (err) {
    return responseCreator.error(err);
  }
};
export const handler = middy()
  .use(jsonBodyParser())
  .use(httpErrorHandler())
  .use(validator({ eventSchema: transpileSchema(validateAuthContextSchema) }))
  .use(validator({ eventSchema: transpileSchema(choseIndividualBody) }))
  .handler(choseIndividual);
