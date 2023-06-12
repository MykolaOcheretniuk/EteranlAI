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
          maximum: 12,
          minimum: 1,
        },
        exp_year: {
          type: "integer",
          minimum: 2023,
        },
        cvc: {
          type: "string",
          maxLength: 3,
        },
      },
      required: ["number", "exp_month", "exp_year", "cvc"],
    },
  },
};
