import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResultV2,
} from "aws-lambda/trigger/api-gateway-proxy";
import { Card } from "src/models/card";
import stripeService from "src/services/stripeService";
import { responseCreator } from "src/utils/responseCreator";
import { paymentMethodSchema } from "../types/paymentMethodSchema";
import { validateAuthContextSchema } from "../types/validateAuthContextSchema";

const updatePaymentMethod = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResultV2> => {
  try {
    const card = event.body as unknown as Card;
    const { userId } = event.requestContext.authorizer?.lambda;
    await stripeService.updatePaymentMethod(userId, card);
    return {
      statusCode: 200,
    };
  } catch (err) {
    return responseCreator.error(err);
  }
};
export const handler = middy()
  .use(jsonBodyParser())
  .use(validator({ eventSchema: transpileSchema(validateAuthContextSchema) }))
  .use(validator({ eventSchema: transpileSchema(paymentMethodSchema) }))
  .use(httpErrorHandler())
  .handler(updatePaymentMethod);
