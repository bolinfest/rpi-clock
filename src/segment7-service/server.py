import segment7_pb2
import segment7_pb2_grpc


class SevenSegmentDisplayServicer(segment7_pb2_grpc.SevenSegmentDisplayServicer):
    def __init__(self, display):
        self._display = display

    def SetDisplay(self, request, context):
        d0, d1, d2, d3 = extract_digits(request.digits)
        self._display.set_digit(0, d0)
        self._display.set_digit(1, d1)
        self._display.set_digit(2, d2)
        self._display.set_digit(3, d3)
        self._display.set_colon(request.colon)
        self._display.write_display()
        return segment7_pb2.Empty()

    def shutdown(self):
        pass


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
    if digit_str is None:
        return EXTRACT_DIGITS_FALLBACK
    num_digits = len(digit_str)
    if num_digits > 4:
        return EXTRACT_DIGITS_FALLBACK
    elif num_digits < 4:
        digit_str = ((4 - num_digits) * ' ') + digit_str

    for d in digit_str:
        if d not in VALID_DIGITS:
            return EXTRACT_DIGITS_FALLBACK
    d0, d1, d2, d3 = digit_str
    return (d0, d1, d2, d3)
