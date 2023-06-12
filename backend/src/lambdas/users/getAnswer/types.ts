import { JSONSchema7 } from "json-schema";

export const getAnswerBody: JSONSchema7 = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        question: {
          type: "string",
        },
      },
      required: ["question"],
    },
  },
};
export interface GetAnswer {
  question: string;
}
