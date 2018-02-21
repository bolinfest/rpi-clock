function createRequestHandler(client) {
  const handler = new RequestHandler(client);
  return handler.onRequest.bind(handler);
}

class RequestHandler {
  constructor(client) {
    this._client = client;
  }

  onRequest(request, response) {
    if (request.method !== 'POST') {
      return this._forbidden(response);
    }

    if (request.headers['x-xsrf'] !== '1') {
      return this._forbidden(response);
    }

    const {url} = request;
    if (url === '/clock') {
      const options = {is24Hour: false};
      this._client.enableClock(options, err => {
        if (err == null) {
          this._ok(response);
        } else {
          this._error(response, err.toString());
        }
      });
    } else if (url === '/count_up') {
      const options = {
        start: 0,
        end: 100,
        increment: 1,
      };
      this._client.enableCounter(options, err => {
        if (err == null) {
          this._ok(response);
        } else {
          this._error(response, err.toString());
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

// TODO(mbolin): Set up a websocket to support subscribeToDisplay().

// const {Observable} = require('rxjs/Observable');
// function subscribeToDisplay(client) {
//   return Observable.create(observer => {
//     const empty = new Empty();
//     const call = client.subscribeToDisplay(empty);
//     call.on('data', display => {
//       observer.next(display);
//     });
//     call.on('status', status => console.error('Status:', status));
//     call.on('end', () => observer.complete());
//   });
// }
//
// const observable = subscribeToDisplay(client);
// const subscription = observable.subscribe({
//   next: x => console.log('got value ', x),
//   error: err => console.error('something wrong occurred: ' + err),
//   complete: () => console.log('done'),
// });
// // Note: call subscription.unsubscribe(), as appropriate.

module.exports = {
  createRequestHandler,
};
