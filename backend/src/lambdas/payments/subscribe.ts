import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { Card } from "src/models/card";
import stripeService from "src/services/stripeService";
import responseCreator from "src/utils/responseCreator";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.requestContext.authorizer) {
      return responseCreator.missedRequestAuthorizerContext();
    }
    if (!event.body) {
      return { body: JSON.stringify("JSON body is missing"), statusCode: 400 };
    }
    const card = JSON.parse(event.body) as Card;
    const { userId } = event.requestContext.authorizer.lambda;
    await stripeService.subscribeUser(userId, card);
    return {
      body: JSON.stringify("subscription created"),
      statusCode: 200,
    };
  } catch (err) {
    return responseCreator.error(err);
  }
};
