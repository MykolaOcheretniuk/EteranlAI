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
    if (!event.body) {
      return { body: JSON.stringify("JSON body is missing"), statusCode: 400 };
    }
    const { userId } = event.requestContext.authorizer.lambda;
    const { question } = JSON.parse(event.body);
    const answer = (await usersService.getAnswer(question, userId)) as string;
    return responseCreator.default(
      JSON.stringify({ answer: answer.replace(/"/g, "") }),
      200
    );
  } catch (err) {
    return responseCreator.error(err);
  }
};
