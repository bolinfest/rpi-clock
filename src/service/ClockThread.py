from DisplayThread import DisplayThread

import datetime


class ClockThread(DisplayThread):
    def __init__(self, controller):
        super(ClockThread, self).__init__(controller)
        self._is_24_hour_time = False

    def run(self):
        colon = False
        while not self.interrupted:
            now = datetime.datetime.now()
            hour = now.hour
            minute = now.minute

            if self._is_24_hour_time:
                # Use leading zeroes for the hour in 24h time.
                fmt = '{:02d}{:02d}'
            else:
                fmt = '{:2d}{:02d}'
                if hour == 0:
                    hour = 12
                elif hour > 12:
                    hour -= 12

            # TODO: Support 12 vs 24-hour time.
            d0, d1, d2, d3 = fmt.format(hour, minute)
            colon = not colon

            self.update(d0, d1, d2, d3, colon)

            # In practice, this is the colon blink rate.
            self.sleep(1.00)
