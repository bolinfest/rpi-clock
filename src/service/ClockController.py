class ClockController:
    def __init__(self, display):
        self._display = display
        self._state = ClockState(' ', ' ', ' ', ' ', colon=False)

    def update(self, digit0, digit1, digit2, digit3, colon=False):
        new_state = ClockState(digit0, digit1, digit2, digit3, colon)
        self._state.render_delta(new_state, self._display)
        self._state = new_state

    def get_state(self):
        return self._state

class ClockState:
    '''Treat this type as if it were immutable.'''
    def __init__(self, digit0, digit1, digit2, digit3, colon):
        # All values are taken from SevenSegment.DIGIT_VALUES.
        # Because we do not use decimal values, we do not store
        # a state for it.
        self.digit0 = digit0
        self.digit1 = digit1
        self.digit2 = digit2
        self.digit3 = digit3
        self.colon = colon

    def render_delta(self, new_state, display):
        is_change = False
        if self.digit0 != new_state.digit0:
            display.set_digit(0, new_state.digit0)
            is_change = True
        if self.digit1 != new_state.digit1:
            display.set_digit(1, new_state.digit1)
            is_change = True
        if self.digit2 != new_state.digit2:
            display.set_digit(2, new_state.digit2)
            is_change = True
        if self.digit3 != new_state.digit3:
            display.set_digit(3, new_state.digit3)
            is_change = True
        if self.colon != new_state.colon:
            display.set_colon(new_state.colon)
            is_change = True

        if is_change:
            display.write_display()
