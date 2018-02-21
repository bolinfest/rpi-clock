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
import signal
import segment7_pb2
import segment7_pb2_grpc

from ClockController import ClockController
from concurrent import futures
from server import SevenSegmentDisplayServicer


def main(is_test):
    if is_test:
        import FakeSevenSegment
        display = FakeSevenSegment.FakeSevenSegment()
    else:
        # Create display instance on default I2C address (0x70) and bus number.
        from Adafruit_LED_Backpack import SevenSegment
        display = SevenSegment.SevenSegment()

    # Initialize the display. Must be called once before using the display.
    display.begin()
    display.clear()
    display.write_display()

    # Read the certificate/key pair.
    repo_root = common.find_repo_root()
    certs_dir = os.path.join(repo_root, 'certs')
    with open(os.path.join(certs_dir, 'server.key')) as f:
        private_key = f.read()
    with open(os.path.join(certs_dir, 'server.crt')) as f:
        certificate_chain = f.read()
    server_credentials = grpc.ssl_server_credentials(((
        private_key,
        certificate_chain,
    ), ))

    server = grpc.server(futures.ThreadPoolExecutor(max_workers=1))
    servicer = SevenSegmentDisplayServicer(display)
    segment7_pb2_grpc.add_SevenSegmentDisplayServicer_to_server(
        servicer, server)

    config = common.read_config()
    port = common.get_port(config)
    address = '[::]:%d' % port
    server.add_secure_port(address, server_credentials)

    server.start()
    print('PID=%d Server started on %s' % (os.getpid(), address))
    try:
        while True:
            signal.pause()
    except KeyboardInterrupt:
        pass
    servicer.shutdown()
    server.stop(0)


if __name__ == '__main__':
    is_test = len(sys.argv) > 1 and sys.argv[1] == '--test'
    main(is_test)
