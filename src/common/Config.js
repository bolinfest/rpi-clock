const toml = require('toml');
const fs = require('fs');

const DEFAULT_SEGMENT7_HOSTNAME = 'raspberrypi.local';
const DEFAULT_SEGMENT7_PORT = 1337;
const DEFAULT_CONTROLLER_HOSTNAME = 'localhost';
const DEFAULT_CONTROLLER_PORT = 50051;
const DEFAULT_WEBSERVER_HOSTNAME = '0.0.0.0';
const DEFAULT_WEBSERVER_PORT = 8081;

class Config {
  constructor(data) {
    this._data = data;
  }

  getSegment7Host() {
    return this._getHost(
      'segment7-server',
      DEFAULT_SEGMENT7_HOSTNAME,
      DEFAULT_SEGMENT7_PORT
    );
  }

  getControllerHost() {
    return this._getHost(
      'controller-service',
      DEFAULT_CONTROLLER_HOSTNAME,
      DEFAULT_CONTROLLER_PORT
    );
  }

  getWebserverHost() {
    return this._getHost(
      'webserver',
      DEFAULT_WEBSERVER_HOSTNAME,
      DEFAULT_WEBSERVER_PORT
    );
  }

  _getHost(id, defaultHostname, defaultPort) {
    const server = this._data[id];
    let hostname;
    let port;
    if (server != null) {
      hostname = server['hostname'];
      port = server['port'];
    }

    if (hostname == null) {
      hostname = defaultHostname;
    }
    if (port == null) {
      port = defaultPort;
    }
    return `${hostname}:${port}`;
  }
}

function createConfig() {
  const data = toml.parse(fs.readFileSync(__dirname + '/../../config.toml'));
  return new Config(data);
}

module.exports = {
  createConfig,
};
