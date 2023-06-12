import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import jsonBodyParser from "@middy/http-json-body-parser";
import validator from "@middy/validator";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResultV2,
} from "aws-lambda/trigger/api-gateway-proxy";
import refreshAccessToken from "src/utils/refreshAccessToken";
import { responseCreator } from "src/utils/responseCreator";
import { RefreshAccessToken, refreshAccessTokenBody } from "./types";
import { transpileSchema } from "@middy/validator/transpile";
const refresh = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResultV2> => {
  try {
    const { refreshToken: token } = event.body as unknown as RefreshAccessToken;
    const access = await refreshAccessToken(token);
    return responseCreator.default(
      JSON.stringify({ accessToken: access }),
      200
    );
  } catch (err) {
    return responseCreator.error(err);
  }
};

export const handler = middy()
  .use(jsonBodyParser())
  .use(validator({ eventSchema: transpileSchema(refreshAccessTokenBody) }))
  .use(httpErrorHandler())
  .handler(refresh);
