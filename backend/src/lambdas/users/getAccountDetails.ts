import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import usersService from "src/services/usersService";
import responseCreator from "src/utils/responseCreator";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.requestContext.authorizer) {
      return responseCreator.missedRequestAuthorizerContext();
    }
    const { userId } = event.requestContext.authorizer.lambda;
    const accountDetails = await usersService.getAccountDetails(userId);
    return {
      body: JSON.stringify(accountDetails),
      statusCode: 200,
    };
  } catch (err) {
    return responseCreator.error(err);
  }
};
