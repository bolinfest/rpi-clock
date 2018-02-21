// @flow
import {Observable} from 'rxjs/Observable';

export default class GrpcClient {
  _host: string;

  constructor(hostname: string, port: number) {
    this._host = `${hostname}:${port}`;
  }

  useClockMode(): Promise<mixed> {
    return this._postToEndpoint('/clock');
  }

  useCounter(): Promise<mixed> {
    return this._postToEndpoint('/count_up');
  }

  observeDisplay(): Observable<mixed> {
    return Observable.create(observer => {
      const ws = new WebSocket(`ws://${this._host}/display`);
      // Could this be a buffer rather than a string?
      ws.onmessage = (event) => observer.next(JSON.parse(event.data));
      ws.onerror = (event) => observer.error(event.message);
      ws.onclose = (event) => observer.complete();
    });
  }

  _postToEndpoint(endpoint: string): Promise<mixed> {
    return fetch(`http://${this._host}${endpoint}`, {
      method: 'POST',
      headers: {
        'X-XSRF': '1',
      },
    });
  }
}
