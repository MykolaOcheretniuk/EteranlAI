import { JwtPayload } from "jsonwebtoken";
import refreshTokensRepository from "src/db/repositories/refreshTokensRepository";
import { ApiError } from "src/errors/apiError";
import jwtTokensService from "./jwtTokensService";

const refreshAccessToken = async (token: string): Promise<string> => {
  const { userId } = (await jwtTokensService.validateRefreshToken(
    token
  )) as JwtPayload;
  const { refreshToken: tokenFromDb } =
    await refreshTokensRepository.getRefreshToken(userId);
  if (!tokenFromDb) {
    throw ApiError.Unauthorized();
  }
  if (tokenFromDb !== token) {
    throw ApiError.Unauthorized();
  }
  const { accessToken } = await jwtTokensService.generateAccessToken(userId);
  return accessToken;
};
export default refreshAccessToken;
