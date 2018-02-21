class FakeSevenSegment:
    def begin(self):
        print('FakeSevenSegment::begin()')

    def clear(self):
        print('FakeSevenSegment::clear()')

    def write_display(self):
        print('FakeSevenSegment::write_display()')

    def set_digit(self, index, value):
        print('FakeSevenSegment::set_digit(%d, %s)' % (index, value))

    def set_colon(self, enable):
        print('FakeSevenSegment::set_colon(%s)' % enable)
