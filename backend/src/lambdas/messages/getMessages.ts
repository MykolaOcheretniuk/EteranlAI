import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import messagesService from "src/services/messagesService";
import responseCreator from "src/utils/responseCreator";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.requestContext.authorizer) {
      return responseCreator.missedRequestAuthorizerContext();
    }
    if (!event.queryStringParameters) {
      return responseCreator.missedQueryStringParams();
    }
    const { page, limit, individual } = event.queryStringParameters;
    if (!page || !limit || !individual) {
      return responseCreator.missedQueryStringParams();
    }
    const { userId } = event.requestContext.authorizer.lambda;
    const result = await messagesService.getMessages(
      { page, limit, individual },
      userId
    );
    return responseCreator.default(JSON.stringify(result), 200);
  } catch (err) {
    return responseCreator.error(err);
  }
};
