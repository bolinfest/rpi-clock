const http = require('http');
const fs = require('fs');
const grpc = require('grpc');
const {createRequestHandler, createWebSocket} = require('./handler');
const {createConfig} = require('common/Config');

const CONTROLLER_PROTO_PATH =
  __dirname + '/../../controller-service/controller.proto';
const protoDescriptor = grpc.load(CONTROLLER_PROTO_PATH);
const {Controller} = protoDescriptor;

/*
 * Launches a simple REST server that expects a special header to prevent
 * XSRF attacks. If you run this locally, then you should be able to put it in
 * counter mode with the following:
 *
 * curl -X POST localhost:8081/count_up -H "X-XSRF: 1"
 */

function main() {
  const config = createConfig();
  const server = createServer(config);

  const {hostname, port} = config.getWebserverHost();
  console.error(`Starting rpi-clock webserver on ${hostname}:${port}`);
  server.listen(port, hostname);
}

function createServer(config) {
  const cert = fs.readFileSync(__dirname + '/../../../certs/server.crt');
  const {hostname, port} = config.getControllerHost();
  const controllerHost = `${hostname}:${port}`;
  console.error(`Connecting to controller on ${controllerHost}`);
  const controllerClient = new Controller(
    controllerHost,
    grpc.credentials.createSsl(cert)
  );
  const handler = createRequestHandler(controllerClient);

  const server = http.createServer();
  server.addListener('request', handler);
  createWebSocket(controllerClient, server);
  return server;
}

main();
