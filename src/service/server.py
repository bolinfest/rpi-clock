import service_pb2
import service_pb2_grpc

from ClockThread import ClockThread
from CounterThread import CounterThread
from NoopThread import NoopThread


class SevenSegmentDisplayServicer(service_pb2_grpc.SevenSegmentDisplayServicer):
    def __init__(self, controller):
        self._controller = controller
        self._display_thread = None

    def GetDisplay(self, request, context):
        clock_state = self._controller.get_state()
        digits = (clock_state.digit0 + clock_state.digit1 +
                  clock_state.digit2 + clock_state.digit3)
        colon = clock_state.colon
        return service_pb2.Display(digits=digits, colon=colon)

    def SetDisplay(self, request, context):
        self._cancel_display_thread()
        d0, d1, d2, d3 = extract_digits(request.digits)
        self._controller.update(d0, d1, d2, d3, request.colon)
        return service_pb2.Empty()

    def EnableClock(self, request, context):
        self._cancel_display_thread()
        self._display_thread = ClockThread(self._controller)
        self._display_thread.start()
        return service_pb2.Empty()

    def EnableCounter(self, request, context):
        self._cancel_display_thread()
        self._display_thread = CounterThread(self._controller)
        self._display_thread.start()
        return service_pb2.Empty()

    def _cancel_display_thread(self):
        if self._display_thread is None:
            return
        self._display_thread.interrupt()
        self._display_thread.join()
        self._display_thread = None


EXTRACT_DIGITS_FALLBACK = (' ', ' ', ' ', ' ')
VALID_DIGITS = set([
    ' ',
    '-',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
])


def extract_digits(digit_str):
    if digit_str is None or len(digit_str) != 4:
        return EXTRACT_DIGITS_FALLBACK
    for d in digit_str:
        if d not in VALID_DIGITS:
            return EXTRACT_DIGITS_FALLBACK
    d0, d1, d2, d3 = digit_str
    return (d0, d1, d2, d3)
