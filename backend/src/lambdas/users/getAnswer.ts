import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import usersService from "src/services/usersService";

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
    if (!event.body) {
      return { body: JSON.stringify("JSON body is missing"), statusCode: 400 };
    }
    const { userId } = event.requestContext.authorizer.lambda;
    const { question } = JSON.parse(event.body);
    const answer = await usersService.getAnswer(question, userId);
    return {
      body: JSON.stringify(answer),
      statusCode: 200,
    };
  } catch (err) {
    return { body: JSON.stringify(`${err}`), statusCode: 400 };
  }
};
