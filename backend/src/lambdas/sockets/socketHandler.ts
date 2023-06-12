import { APIGatewayProxyEvent, APIGatewayProxyResultV2 } from "aws-lambda";
import { JwtPayload } from "jsonwebtoken";
import usersRepository from "src/db/repositories/usersRepository";
import { ApiError } from "src/errors/apiError";
import socketsService from "src/services/socketsService";
import usersService from "src/services/usersService";
import jwtTokensService from "src/utils/jwtTokensService";
import responseCreator from "src/utils/responseCreator";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResultV2> => {
  try {
    if (event.requestContext) {
      const { routeKey, connectionId } = event.requestContext;
      if (!connectionId) {
        return {
          statusCode: 400,
        };
      }
      switch (routeKey) {
        case "$connect":
          const token = event.headers.Authorization;
          if (!token) {
            throw ApiError.Unauthorized();
          }
          const { userId } = (await jwtTokensService.validateAccessToken(
            token
          )) as JwtPayload;
          const user = await usersRepository.getById(userId);
          if (!user) {
            throw ApiError.NotFound("User");
          }
          await usersRepository.connectToSocket(userId, connectionId);
          break;
        case "$disconnect":
          await usersRepository.disconnectFromSocket(connectionId);
          break;
        case "setIndividual":
          if (event.body) {
            const { userId } = await usersRepository.getConnectedUser(
              connectionId
            );
            const { individual } = JSON.parse(event.body);
            await usersRepository.setIndividual(individual, userId);
            await socketsService.sendMessage(
              connectionId,
              `Individual ${individual} was set to ${userId}`
            );
          }
          break;
        case "getAnswer":
          if (event.body) {
            const { userId } = await usersRepository.getConnectedUser(
              connectionId
            );
            const { question } = JSON.parse(event.body);
            const answer = await usersService.getAnswer(question, userId);
            await socketsService.sendMessage(connectionId, answer);
          }
          break;
      }
    }
    return {
      statusCode: 200,
    };
  } catch (err) {
    return responseCreator.error(err);
  }
};
