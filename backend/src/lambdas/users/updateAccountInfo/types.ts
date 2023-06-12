import { JSONSchema7 } from "json-schema";

export const updateAccountInfo: JSONSchema7 = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        name: {
          anyOf: [{ type: "string" }, { type: "null" }],
        },
        email: {
          anyOf: [{ type: "string", format: "email" }, { type: "null" }],
        },
        phoneNumber: {
          anyOf: [
            {
              type: "string",
              pattern: "^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$",
            },
            {
              type: "null",
            },
          ],
        },
        password: {
          anyOf: [{ type: "string" }, { type: "null" }],
        },
      },
    },
  },
};
