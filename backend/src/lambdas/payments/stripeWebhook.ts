import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda/trigger/api-gateway-proxy";
import usersService from "src/services/usersService";
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return { body: JSON.stringify("JSON body is missing"), statusCode: 400 };
    }
    const eventBody = JSON.parse(event.body);
    switch (eventBody.type) {
      case "invoice.payment_succeeded": {
        const { customer_email: customerEmail, lines } = eventBody.data.object;
        const { end, start } = lines.data[0].period;
        const { subscription: subId } = lines.data[0];
        await usersService.addToSubscribers(customerEmail, end, start, subId);
      }
    }
    return { body: JSON.stringify(eventBody), statusCode: 200 };
  } catch (err) {
    return { body: JSON.stringify(err), statusCode: 400 };
  }
};
