import errno
import os
import subprocess
import toml


def find_repo_root():
    stdout = subprocess.check_output([
        'git',
        'rev-parse',
        '--show-toplevel',
    ])
    return stdout.rstrip()


def mkdirp(path):
    try:
        os.mkdir(path)
    except OSError as e:
        if e.errno == errno.EEXIST:
            pass
        else:
            raise


def read_config():
    repo_root = find_repo_root()
    with open(os.path.join(repo_root, 'config.toml')) as f:
        data = toml.load(f)
    return Config(data)


# This must stay in sync with src/common/Config.js.
DEFAULT_SEGMENT7_HOSTNAME = 'raspberrypi.local'
DEFAULT_SEGMENT7_PORT = 1337
DEFAULT_CONTROLLER_PORT = 50051
DEFAULT_WEBSERVER_PORT = 8081


class Config:
    def __init__(self, data):
        self._data = data

    def get_segment7_host(self):
        return self._get_host(
            'segment7-server',
            DEFAULT_SEGMENT7_HOSTNAME,
            DEFAULT_SEGMENT7_PORT,
        )

    def get_controller_host(self):
        default_hostname, _ = self.get_segment7_host()
        return self._get_host(
            'controller-service',
            default_hostname,
            DEFAULT_CONTROLLER_PORT,
        )

    def get_webserver_host(self):
        default_hostname, _ = self.get_segment7_host()
        return self._get_host(
            'webserver',
            default_hostname,
            DEFAULT_WEBSERVER_PORT,
        )

    def _get_host(self, id, default_hostname, default_port):
        server = self._data.get(id)
        hostname = None
        port = None
        if server is not None:
            hostname = server.get('hostname')
            port = server.get('port')

        if hostname is None:
            hostname = default_hostname
        if port is None:
            port = default_port

        return hostname, port
