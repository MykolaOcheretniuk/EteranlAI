import { JSONSchema7 } from "json-schema";

export const bodySchema: JSONSchema7 = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        email: {
          type: "string",
          format: "email",
        },
        password: {
          type: "string",
        },
      },
      required: ["email", "password"],
    },
  },
};
export const refreshAccessTokenBody: JSONSchema7 = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        refreshToken: {
          type: "string",
        },
      },
      required: ["refreshToken"],
    },
  },
};
export const pathParamsSchema: JSONSchema7 = {
  type: "object",
  properties: {
    pathParameters: {
      type: "object",
      properties: {
        action: { type: "string" },
      },
      required: ["action"],
    },
  },
};

export enum Action {
  login = "login",
  signUp = "signUp",
  refresh = "refresh",
}
export interface RefreshAccessToken {
  refreshToken: string;
}
