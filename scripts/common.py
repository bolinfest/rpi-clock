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
        return toml.load(f)


DEFAULT_HOSTNAME = 'raspberrypi.local'
DEFAULT_PORT = 1337


def get_hostname(config):
    server = config.get('server')
    if server is None:
        return DEFAULT_HOSTNAME
    return server.get('hostname', DEFAULT_HOSTNAME)


def get_port(config):
    server = config.get('server')
    if server is None:
        return DEFAULT_PORT
    return server.get('port', DEFAULT_PORT)
