import { BaseRepository } from "./baseRepository";
import { ChatLogInsert, chatLog } from "../schema/chatLog";
import { and, eq } from "drizzle-orm";
import { ChatLogModel } from "src/models/chatLogModel";
class ChatLogRepository extends BaseRepository {
  createChatLog = async (insertChatLog: ChatLogInsert) => {
    await this.db.insert(chatLog).values(insertChatLog);
  };
  getMessages = async (
    individual: string,
    userId: string,
    limit: number,
    offset: number
  ): Promise<ChatLogModel[]> => {
    const result = await this.db
      .select({ question: chatLog.question, answer: chatLog.answer })
      .from(chatLog)
      .where(
        and(eq(chatLog.individual, individual), eq(chatLog.userId, userId))
      )
      .limit(limit)
      .offset(offset);
    return result;
  };
}

const chatLogRepository = new ChatLogRepository(chatLog);
export default chatLogRepository;
