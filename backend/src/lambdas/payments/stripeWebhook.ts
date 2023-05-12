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
    if (!event.body) {
      return { body: JSON.stringify("JSON body is missing"), statusCode: 400 };
    }
    const eventBody = JSON.parse(event.body);
    switch (eventBody.type) {
      case "invoice.payment_succeeded": {
        const {
          customer_email: customerEmail,
          lines,
          customer,
        } = eventBody.data.object;
        const { subscription: subId } = lines.data[0];
        await usersService.addToSubscribers(customerEmail, subId, customer);
      }
    }
    return { body: JSON.stringify(eventBody), statusCode: 200 };
  } catch (err) {
    return responseCreator.error(err);
  }
};
