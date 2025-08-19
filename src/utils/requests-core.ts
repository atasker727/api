export { HTTPRequest };

async function HTTPRequest(url: string, method = 'GET', body: null | object = {}, signal: AbortSignal | null = null) {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    const params = {
      headers,
      method,
      ...(body && { body: JSON.stringify(body) }),
      ...(signal && { signal }),
    };
    return await fetch(url, params).then(_handleRequestCodes).catch(_handlePromiseErrorCatch);
  } catch (err) {
    console.error(err);
    return Promise.reject(err);
  }
}

async function _handleRequestCodes(res: Response) {
  if (!res.ok) {
    // error handling for codes like 503 here
    return Promise.reject(new Error('bad response'));
  }

  return await res.json();
}

function _handlePromiseErrorCatch(err: Error) {
  return Promise.reject(err);
}
