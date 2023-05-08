import axios from "axios";
import getEnv from "src/utils/getEnv";

class ChatGptService {
  getAnswer = async (individual: string, question: string) => {
    const requestUrl = getEnv("CHAT_GPT_URL") as string;
    const { data } = await axios.post(
      requestUrl,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Give me a possible ${individual} answer to question ${question}`,
          },
        ],
      },
      {
        headers: {
          Authorization: "Bearer " + getEnv("CHAT_GPT_API_KEY"),
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  };
}
const chatGptService = new ChatGptService();
export default chatGptService;
