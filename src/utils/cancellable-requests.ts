import { HTTPRequest } from './requests-core';
import { cancellableRequestType, cancelRequestFunctionType } from './cancellable-requests.d';
export { cancellableJSONRequest, cancellableRequestDelete, cancellableRequestPost, cancellableRequestGet };

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

function cancellableRequestGet(url: string): cancellableRequestType {
  return cancellableJSONRequest(url, 'GET', null);
}

function cancellableRequestPost(url: string, requestBody = {}): cancellableRequestType {
  return cancellableJSONRequest(url, 'POST', requestBody);
}

function cancellableRequestDelete(url: string, requestBody = {}): cancellableRequestType {
  return cancellableJSONRequest(url, 'DELETE', requestBody);
}
