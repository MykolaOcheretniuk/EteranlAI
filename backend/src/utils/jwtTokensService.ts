import * as jwt from "jsonwebtoken";
import getEnv from "./getEnv";

class JwtTokensService {
  generateAccessToken = (userId: string) => {
    const accessToken = jwt.sign(
      { userId },
      getEnv("ACCESS_TOKEN_SECRET") as string,
      { expiresIn: "1d" }
    );

    return { accessToken: accessToken };
  };
  generateRefreshToken = (userId: string) => {
    const refreshToken = jwt.sign(
      { userId },
      getEnv("REFRESH_TOKEN_SECRET") as string,
      { expiresIn: "30d" }
    );
    return { refreshToken: refreshToken };
  };
  validateRefreshToken = async (token: string) => {
    return jwt.verify(token, getEnv("REFRESH_TOKEN_SECRET") as string);
  };
  validateAccessToken = async (token: string) => {
    return jwt.verify(token, getEnv("ACCESS_TOKEN_SECRET") as string);
  };
}
const jwtTokensService = new JwtTokensService();
export default jwtTokensService;
