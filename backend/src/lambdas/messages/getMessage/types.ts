import { JSONSchema7 } from "json-schema";

export const queryStringParams: JSONSchema7 = {
  type: "object",
  properties: {
    queryStringParameters: {
      type: "object",
      properties: {
        page: { type: "integer" },
        limit: { type: "integer" },
        individual: { type: "string" },
      },
      required: ["action"],
    },
  },
};

export interface PaginationOptions {
  page: string;
  limit: string;
  individual: string;
}
