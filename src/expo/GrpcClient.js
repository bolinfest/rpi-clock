// @flow

export default class GrpcClient {
  _host: string;

  constructor(hostname: string, port: number) {
    this._host = `http://${hostname}:${port}`;
  }

  useClockMode(): Promise<mixed> {
    return this._postToEndpoint('/clock');
  }

  useCounter(): Promise<mixed> {
    return this._postToEndpoint('/count_up');
  }

  _postToEndpoint(endpoint: string): Promise<mixed> {
    return fetch(`${this._host}${endpoint}`, {
      method: 'POST',
      headers: {
        'X-XSRF': '1',
      },
    });
  }
}
