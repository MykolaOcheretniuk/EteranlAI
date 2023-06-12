import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { validateAuthContextSchema } from "src/lambdas/types/validateAuthContextSchema";
import usersService from "src/services/usersService";
import {responseCreator} from "src/utils/responseCreator";
import { GetAnswer, getAnswerBody } from "./types";

const getAnswer = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { userId } = event.requestContext.authorizer?.lambda;
    const { question } = event.body as unknown as GetAnswer;
    const answer = (await usersService.getAnswer(question, userId)) as string;
    return responseCreator.default(
      JSON.stringify({ answer: answer.replace(/"/g, "") }),
      200
    );
  } catch (err) {
    return responseCreator.error(err);
  }
};
export const handler = middy()
  .use(httpErrorHandler())
  .use(jsonBodyParser())
  .use(validator({ eventSchema: transpileSchema(validateAuthContextSchema) }))
  .use(validator({ eventSchema: transpileSchema(getAnswerBody) }))
  .handler(getAnswer);
