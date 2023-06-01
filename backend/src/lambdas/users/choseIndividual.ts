import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import { ChoseIndividual } from "src/models/users/choseIndividualModel";
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
      return responseCreator.missedEventBody();
    }
    const { userId } = event.requestContext.authorizer.lambda;
    const { individual } = JSON.parse(event.body) as ChoseIndividual;
    await usersService.setIndividual(individual, userId);
    return responseCreator.default(JSON.stringify("Individual set"), 200);
  } catch (err) {
    return responseCreator.error(err);
  }
};
