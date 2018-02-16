import service_pb2

from bottle import Bottle, request


def create_server(stub):
    app = Bottle()

    @app.post('/clock')
    def clock():
        check_xsrf()
        clock_options = service_pb2.ClockOptions()
        stub.EnableClock(clock_options)
        return 'Clock displayed.\n'

    @app.post('/count_up')
    def count_up():
        check_xsrf()
        counter_options = service_pb2.CounterOptions()
        stub.EnableCounter(counter_options)
        return 'Counting.\n'

    return app


def check_xsrf():
    if request.get_header('X-XSRF') != '1':
        raise Exception('Missing XSRF header!')
