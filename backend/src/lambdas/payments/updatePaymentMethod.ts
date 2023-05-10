import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return { body: JSON.stringify("JSON body is missing"), statusCode: 400 };
    }
    return {
      body: JSON.stringify("hello world"),
      statusCode: 200,
    };
  } catch (err) {
    return { body: JSON.stringify(`${err}`), statusCode: 400 };
  }
};
