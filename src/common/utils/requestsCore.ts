import type {
  cancellableRequestClassType,
  cancellableRequestBase,
  cancelRequestFunctionType,
} from "../types/cancellableRequests";

export {
  getFullURLWithParams,
  cancellableRequestGet,
  cancellableRequestPost,
  cancellableRequestDelete,
};

async function _handleRequestCodes(res: Response) {
  if (!res.ok) {
    // error handling for codes like 503 here
    console.log(res);
    return Promise.reject(new Error("bad response"));
  }

  return await res.json();
}

function _handlePromiseErrorCatch(err: Error) {
  return Promise.reject(err);
}

function addURLParams(endpoint: string, params = {}): string {
  return Object.entries(params).length > 0
    ? `${endpoint}?${new URLSearchParams(params)}`
    : endpoint;
}

function getFullURLWithParams(endpoint: string, params = {}): string {
  const url = new URL(endpoint);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, String(value));
  }
  return url.href;
}

async function HTTPRequest(
  url: string,
  method = "GET",
  body: null | object = {},
  signal: AbortSignal | null = null,
) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };

    const params = {
      headers,
      method,
      ...(body && { body: JSON.stringify(body) }),
      ...(signal && { signal }),
    };
    return await fetch(url, params)
      .then(_handleRequestCodes)
      .catch(_handlePromiseErrorCatch);
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
}

function cancellableJSONRequest(
  url: string,
  method = "GET",
  requestBody?: null | object,
): cancellableRequestBase {
  try {
    const controller = new AbortController();

    const cancelRequest: cancelRequestFunctionType = (reason) => {
      // reject promise?
      controller.abort(reason);
    };

    const { signal } = controller;

    const responsePromise = HTTPRequest(url, method, requestBody, signal).then(
      (res) => {
        return res;
      },
    );
    return { responsePromise, cancelRequest };
  } catch (err) {
    console.error(err);
    return { responsePromise: Promise.reject(err), cancelRequest: () => {} };
  }
}

class CancellableRequestClass implements cancellableRequestClassType {
  responsePromise: Promise<unknown>;
  cancelRequest: cancelRequestFunctionType;
  then: (callback: (response: unknown) => void) => Promise<unknown>;
  catch: (callback: (err?: unknown) => void) => Promise<unknown>;
  finally: (callback: () => void) => Promise<unknown>;

  constructor(url: string, method: string, requestBody?: object | null) {
    const { responsePromise, cancelRequest } = cancellableJSONRequest(
      url,
      method,
      requestBody,
    );
    this.responsePromise = responsePromise;
    this.cancelRequest = cancelRequest;

    this.then = function (callback) {
      return this.responsePromise.then(callback);
    };
    this.catch = function (callback) {
      return this.responsePromise.catch(callback);
    };
    this.finally = function (callback) {
      return this.responsePromise.finally(callback);
    };
  }
}

function cancellableRequestGet(
  url: string,
  params = {},
): cancellableRequestClassType {
  return new CancellableRequestClass(addURLParams(url, params), "GET", null);
}

function cancellableRequestPost(
  url: string,
  requestBody = {},
): cancellableRequestClassType {
  return new CancellableRequestClass(url, "POST", requestBody);
}

function cancellableRequestDelete(
  url: string,
  requestBody = {},
): cancellableRequestClassType {
  return new CancellableRequestClass(url, "DELETE", requestBody);
}
