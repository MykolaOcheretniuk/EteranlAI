import { JSONSchema7 } from "json-schema";

export const paymentMethodSchema: JSONSchema7 = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        number: {
          type: "string",
        },
        exp_month: {
          type: "integer",
        },
        exp_year: {
          type: "integer",
        },
        cvc: {
          type: "string",
        },
      },
      required: ["number", "exp_month", "exp_year", "cvc"],
    },
  },
};
