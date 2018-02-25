const fs = require('fs');
const grpc = require('grpc');
const {Segment7Controller} = require('./Segment7Controller');
const {Server} = require('./Server');
const {createConfig} = require('common/Config');

const SEGMENT7_PROTO_PATH =
  __dirname + '/../../segment7-service/segment7.proto';
const CONTROLLER_PROTO_PATH = __dirname + '/../controller.proto';

class AsyncDisplayClient {
  constructor(client) {
    this._client = client;
  }

  setDisplay(display /*: {digits: string, colon: boolean}*/) {
    return new Promise((resolve, reject) => {
      this._client.setDisplay(display, error => {
        if (error == null) {
          resolve();
        } else {
          reject(error);
        }
      });
    });
  }
}

function main() {
  const key = fs.readFileSync(__dirname + '/../../../certs/server.key');
  const cert = fs.readFileSync(__dirname + '/../../../certs/server.crt');

  const config = createConfig();
  const segment7Host = config.getSegment7Host();
  const segment7Proto = grpc.load(SEGMENT7_PROTO_PATH);
  const {SevenSegmentDisplay} = segment7Proto;
  const syncClient = new SevenSegmentDisplay(
    `${segment7Host.hostname}:${segment7Host.port}`,
    grpc.credentials.createSsl(cert)
  );
  const asyncClient = new AsyncDisplayClient(syncClient);

  const controller = new Segment7Controller(asyncClient);
  const serverImpl = new Server(controller);

  const serverCredentials = grpc.ServerCredentials.createSsl(null, [
    {
      private_key: key,
      cert_chain: cert,
    },
  ]);
  const server = new grpc.Server();
  const controllerProto = grpc.load(CONTROLLER_PROTO_PATH);
  server.addService(controllerProto.Controller.service, serverImpl);
  const {hostname, port} = config.getControllerHost();
  const controllerHost = `${hostname}:${port}`;
  server.bind(controllerHost, serverCredentials);
  console.log(`Starting controller-service on ${controllerHost}`);
  server.start();
}

main();
