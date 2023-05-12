import { ApiError } from "src/errors/apiError";

class ResponseCreator {
  default = (data: string, statusCode: number) => {
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
  missedAuthHeader = () => {
    return {
      statusCode: 400,
      body: JSON.stringify(`Authorization header is missing.`),
    };
  };
  missedEventBody = () => {
    return {
      statusCode: 400,
      body: JSON.stringify(`JSON body is missing.`),
    };
  };
  missedQueryStringParams = () => {
    return {
      statusCode: 400,
      body: JSON.stringify(`Query string params is missing.`),
    };
  };
  missedRequestAuthorizerContext = () => {
    return {
      statusCode: 400,
      body: JSON.stringify(`Request authorizer context is missing.`),
    };
  };
}
const responseCreator = new ResponseCreator();
export default responseCreator;