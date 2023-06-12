import AWS, { ApiGatewayManagementApi } from "aws-sdk";
import getEnv from "src/utils/getEnv";

class SocketsService {
  private socketClient: ApiGatewayManagementApi;
  constructor() {
    this.socketClient = new AWS.ApiGatewayManagementApi({
      endpoint: getEnv("SOCKET_CONNECTION_URL"),
    });
  }
  sendMessage = async (connectionId: string, message: string) => {
    await this.socketClient
      .postToConnection({
        ConnectionId: connectionId,
        Data: message,
      })
      .promise();
  };
}

const socketsService = new SocketsService();
export default socketsService;
