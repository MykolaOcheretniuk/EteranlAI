import {
  APIGatewayAuthorizerResult,
  APIGatewayRequestAuthorizerEventV2,
} from "aws-lambda";
import { JwtPayload } from "jsonwebtoken";
import usersRepository from "src/db/repositories/usersRepository";
import { ApiError } from "src/errors/apiError";
import jwtTokensService from "src/utils/jwtTokensService";

export async function handler(
  event: APIGatewayRequestAuthorizerEventV2
): Promise<APIGatewayAuthorizerResult> {
  try {
    const authToken = event.identitySource[0];
    const { userId } = (await jwtTokensService.validateAccessToken(
      authToken
    )) as JwtPayload;
    const user = await usersRepository.getById(userId);
    if (!user) {
      throw ApiError.NotFound("User");
    }
    return {
      principalId: userId,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: "*",
          },
        ],
      },
      context: {
        userId: userId,
      },
    };
  } catch (err) {
    return {
      principalId: "principalId",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: "*",
          },
        ],
      },
    };
  }
}
