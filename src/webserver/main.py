import os
import sys
# Add gen/grpc/ to sys.path:
sys.path.append(
    os.path.join(
        os.path.dirname(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        'gen', 'grpc'))
# Add scripts/ to sys.path:
sys.path.append(
    os.path.join(
        os.path.dirname(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        'scripts'))

import common
import grpc
import service_pb2_grpc
import webserver


def main():
    '''Launches a simple REST server that expects a special header to prevent
    XSRF attacks. If you run this locally, then you should be able to put it in
    counter mode with the following:

    curl -X POST localhost:8081/count_up -H "X-XSRF: 1"
    '''
    config = common.read_config()
    hostname = common.get_hostname(config)
    port = common.get_port(config)

    repo_root = common.find_repo_root()
    certs_dir = os.path.join(repo_root, 'certs')
    with open(os.path.join(certs_dir, 'server.crt')) as f:
        certificate_chain = f.read()

    credentials = grpc.ssl_channel_credentials(
        root_certificates=certificate_chain)
    channel = grpc.secure_channel('{}:{}'.format(hostname, port), credentials)

    stub = service_pb2_grpc.SevenSegmentDisplayStub(channel)
    server = webserver.create_server(stub)
    server.run(host='0.0.0.0', port=8081)


if __name__ == '__main__':
    main()
