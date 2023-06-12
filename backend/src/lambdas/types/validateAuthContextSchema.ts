import { JSONSchema7 } from "json-schema";

export const validateAuthContextSchema: JSONSchema7 = {
  type: "object",
  properties: {
    requestContext: {
      type: "object",
      properties: {
        authorizer: {
          type: "object",
          properties: {
            lambda: {
              type: "object",
              properties: {
                userId: {
                  type: "string",
                },
              },
            },
          },
        },
      },
      required: ["authorizer"],
    },
  },
};
