import { OpenAIApi } from "openai";
import { Configuration } from "openai/dist/configuration.js";
import getEnv from "src/utils/getEnv";

class ChatGptService {
  private configuration: Configuration;
  private openAi: OpenAIApi;

  constructor() {
    this.configuration = new Configuration({
      apiKey: getEnv("CHAT_GPT_API_KEY"),
    });
    this.openAi = new OpenAIApi(this.configuration);
  }

  getAnswerFromClient = async (individual: string, question: string) => {
    const response = await this.openAi.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Give me a possible ${individual} answer to ${question}`,
        },
      ],
      max_tokens: 3000,
      temperature: 0.1,
    });
    const { choices } = response.data;
    return choices[0].message?.content as string;
  };
}
const chatGptService = new ChatGptService();
export default chatGptService;
