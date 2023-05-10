import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import stripeService from "src/services/stripeService";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.requestContext.authorizer) {
      return {
        body: JSON.stringify(`Authorizer context is missing`),
        statusCode: 400,
      };
    }
    const { userId } = event.requestContext.authorizer.lambda;
    await stripeService.cancelSubscription(userId);
    return {
      body: JSON.stringify("subscription canceled"),
      statusCode: 200,
    };
  } catch (err) {
    return { body: JSON.stringify(`${err}`), statusCode: 400 };
  }
};
