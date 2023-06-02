import chatLogRepository from "src/db/repositories/chatLogRepository";
import { ChatLogModel } from "src/models/chatLogModel";
import { GetChatLogModel } from "src/models/getChatLogModel";

class MessagesService {
  getMessages = async (
    params: GetChatLogModel,
    userId: string
  ): Promise<ChatLogModel[]> => {
    let { limit, page, individual } = params;
    const offset = (+page - 1) * +limit;
    return await chatLogRepository.getMessages(
      individual,
      userId,
      +limit,
      +offset
    );
  };
}

const messagesService = new MessagesService();
export default messagesService;
