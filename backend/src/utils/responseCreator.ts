import { ApiError } from "src/errors/apiError";
type Headers =
  | {
      [header: string]: boolean | number | string;
    }
  | undefined;

class ResponseCreator {
  default = (data: string, statusCode: number, headers?: Headers) => {
    if (headers) {
      return {
        statusCode: statusCode,
        headers: headers,
        body: data,
      };
    }
    return {
      statusCode: statusCode,
      body: data,
    };
  };
  error = (err: unknown) => {
    if (err instanceof ApiError) {
      return {
        statusCode: err.code,
        body: JSON.stringify(`${err}`),
      };
    }
    return {
      statusCode: 400,
      body: JSON.stringify(`Bad request: ${err}`),
    };
  };
}
export const responseCreator = new ResponseCreator();
