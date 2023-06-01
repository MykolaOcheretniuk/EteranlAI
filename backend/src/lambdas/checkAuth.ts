import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import jwtTokensService from "src/utils/jwtTokensService";
import responseCreator from "src/utils/responseCreator";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const authHeader = event.headers.Authorization;
    if (!authHeader) {
      return responseCreator.default(JSON.stringify("Unauthorized"), 401);
    }
    const jwtPayload = await jwtTokensService.validateAccessToken(authHeader);
    return {
      body: JSON.stringify(jwtPayload),
      statusCode: 200,
    };
  } catch (err) {
    return responseCreator.default(JSON.stringify("Unauthorized"), 401);
  }
};
