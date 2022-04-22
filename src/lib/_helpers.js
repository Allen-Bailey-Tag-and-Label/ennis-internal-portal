export const serverFetch = async (params) => {
  let body, headers, href, method, responseType;

  // check if string supplied
  if (typeof params === 'string') {
    href = params;
    method = 'GET';
    responseType = 'JSON';
  } else {
    body = params.body;
    href = params.href;
    method = params.method;
    headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };
    responseType = 'JSON';
    if ('headers' in params) headers = params.headers;
    if ('responseType' in params) responseType = params.responseType;
  }

  let options = { method };

  if (method.toUpperCase() !== 'GET') {
    options.body = JSON.stringify(body);
    options.headers = headers;
  }

  const response = await fetch(href, options);
  const data = await (responseType === 'JSON' ? response.json() : response.text());
  return data;
};
