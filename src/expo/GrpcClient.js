// @flow
import {Observable} from 'rxjs/Observable';

export default class GrpcClient {
  _host: string;

  constructor(hostname: string, port: number) {
    this._host = `${hostname}:${port}`;
  }

  useClockMode(is24Hour: boolean): Promise<mixed> {
    return this._postToEndpoint('/clock', {is24Hour});
  }

  startTimer(seconds: number): Promise<mixed> {
    return this._postToEndpoint('/timer', {seconds});
  }

  observeDisplay(): Observable<mixed> {
    return Observable.create(observer => {
      const ws = new WebSocket(`ws://${this._host}/display`);
      // Could this be a buffer rather than a string?
      ws.onmessage = (event) => observer.next(JSON.parse(event.data));
      ws.onerror = (event) => observer.error(event.message);
      ws.onclose = (event) => observer.complete();
      // Currently, we are designed to have one subscriber, so we close the
      // connection when someone unsubscribes.
      return () => ws.close();
    });
  }

  _postToEndpoint(endpoint: string, payload: ?Object = null): Promise<mixed> {
    const headers = new Headers();
    headers.append('X-XSRF', '1');

    let body;
    if (payload != null) {
      body = JSON.stringify(payload);
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'application/json');
    }
    return fetch(`http://${this._host}${endpoint}`, {
      method: 'POST',
      headers,
      body,
    });
  }
}
