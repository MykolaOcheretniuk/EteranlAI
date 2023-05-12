import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import stripeService from "src/services/stripeService";
import responseCreator from "src/utils/responseCreator";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.requestContext.authorizer) {
      return responseCreator.missedRequestAuthorizerContext();
    }
    const { userId } = event.requestContext.authorizer.lambda;
    await stripeService.cancelSubscription(userId);
    return responseCreator.default(
      JSON.stringify("Subscription canceled"),
      200
    );
  } catch (err) {
    return responseCreator.error(err);
  }
};
