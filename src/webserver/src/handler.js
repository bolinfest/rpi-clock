const WebSocket = require('ws');
const url = require('url');
const {Observable} = require('rxjs/Observable');

function createRequestHandler(client) {
  const handler = new RequestHandler(client);
  return handler.onRequest.bind(handler);
}

class RequestHandler {
  constructor(client) {
    this._client = client;
  }

  async onRequest(request, response) {
    console.error(`request to ${request.url}`);
    if (request.method !== 'POST') {
      return this._forbidden(response);
    }

    if (request.headers['x-xsrf'] !== '1') {
      return this._forbidden(response);
    }

    const {url} = request;
    if (url === '/clock') {
      const data = await readRequestBody(request);
      const {is24Hour} = data;
      this._client.enableClock(is24Hour, err => {
        if (err == null) {
          return this._ok(response);
        } else {
          return this._error(response, err.toString());
        }
      });
    } else if (url === '/timer') {
      const data = await readRequestBody(request);
      const {seconds} = data;
      this._client.startTimer(seconds, err => {
        if (err == null) {
          return this._ok(response);
        } else {
          return this._error(response, err.toString());
        }
      });
    } else {
      return this._forbidden(response);
    }
  }

  _ok(response) {
    response.writeHead(200);
    response.end();
  }

  _error(response, message) {
    response.writeHead(500);
    response.end(message);
  }

  _forbidden(response) {
    response.writeHead(403);
    response.end();
  }
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let chunks = [];
    request
      .on('data', chunk => chunks.push(chunk))
      .on('end', () => {
        const body = Buffer.concat(chunks).toString();
        const data = JSON.parse(body);
        resolve(data);
      })
      .on('error', reject);
  });
}

function createWebSocket(controllerClient, server) {
  const ws = new WebSocket.Server({server});
  let numWebSocketConnections = 0;
  ws.on('connection', (connection, req) => {
    numWebSocketConnections++;
    const location = url.parse(req.url, /* parseQueryString */ true);
    if (location.pathname !== '/display') {
      return;
    }

    console.error(`New WebSocket connection: ${numWebSocketConnections}`);

    // TODO(mbolin): Share one observable across all connections.
    const observable = subscribeToDisplay(controllerClient);
    const subscription = observable.subscribe(
      value => connection.send(JSON.stringify(value)),
      err => console.error('error in subscribeToDisplay() gRPC call: ', err),
      () => console.error('subscribeToDisplay() complete')
    );

    function disconnect() {
      numWebSocketConnections--;
      console.error(`WebSocket disconnected: ${numWebSocketConnections}`);
      subscription.unsubscribe();
    }

    connection.on('close', disconnect);
    connection.on('error', disconnect);
  });
}

function subscribeToDisplay(client) {
  return Observable.create(observer => {
    const call = client.subscribeToDisplay({});
    call.on('data', display => {
      observer.next(display);
    });
    call.on('status', status => console.error('Status:', status));
    call.on('end', () => observer.complete());
  });
}

module.exports = {
  createRequestHandler,
  createWebSocket,
};
