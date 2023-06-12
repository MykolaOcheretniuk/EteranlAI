import { JSONSchema7 } from "json-schema";

export const choseIndividualBody: JSONSchema7 = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        individual: {
          type: "string",
        },
      },
      required: ["individual"],
    },
  },
};
