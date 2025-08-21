import { HTTPRequest } from './requests-core';
import { cancellableRequestType, cancelRequestFunctionType } from './cancellable-requests.d';
export { cancellableJSONRequest, cancellableRequestDelete, cancellableRequestPost, cancellableRequestGetClass };

function cancellableJSONRequest(url: string, method = 'GET', requestBody?: null | object): cancellableRequestType {
  try {
    const controller = new AbortController();

    const cancelRequest: cancelRequestFunctionType = (reason) => {
      // reject promise?
      controller.abort(reason);
    };

    const { signal } = controller;

    const responsePromise = HTTPRequest(url, method, requestBody, signal).then((res) => {
      return res;
    });
    return { responsePromise, cancelRequest };
  } catch (err) {
    console.error(err);
    return { responsePromise: Promise.reject(err), cancelRequest: () => {} };
  }
}

// function cancellableRequestGet(url: string): cancellableRequestType {
//   return cancellableJSONRequest(url, 'GET', null);
// }

function cancellableRequestPost(url: string, requestBody = {}): cancellableRequestType {
  return cancellableJSONRequest(url, 'POST', requestBody);
}

function cancellableRequestDelete(url: string, requestBody = {}): cancellableRequestType {
  return cancellableJSONRequest(url, 'DELETE', requestBody);
}

interface cancellableRequestGetType {
  responsePromise: Promise<unknown>;
  cancelRequest: cancelRequestFunctionType;
  then: (callback: (response: unknown) => void) => Promise<unknown>;
  catch: (callback: (err?: unknown) => void) => Promise<unknown>;
  finally: (callback: () => void) => Promise<unknown>;
}

class cancellableRequestGetClass implements cancellableRequestGetType {
  responsePromise: Promise<unknown>;
  cancelRequest: cancelRequestFunctionType;
  then: (callback: (response: unknown) => void) => Promise<unknown>;
  catch: (callback: (err?: unknown) => void) => Promise<unknown>;
  finally: (callback: () => void) => Promise<unknown>;

  // constructor(url: string queryParams: {} = {}) {
  constructor(url: string) {
    const { responsePromise, cancelRequest } = cancellableJSONRequest(url, 'GET', null);
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
