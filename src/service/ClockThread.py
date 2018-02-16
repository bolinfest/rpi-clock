from DisplayThread import DisplayThread

import datetime


class ClockThread(DisplayThread):
    def run(self):
        colon = False
        while not self.interrupted:
            now = datetime.datetime.now()
            hour = now.hour
            minute = now.minute

            # TODO: Support 12 vs 24-hour time.
            d0, d1, d2, d3 = '{:2d}{:02d}'.format(hour, minute)
            colon = not colon

            self.update(d0, d1, d2, d3, colon)

            # In practice, this is the colon blink rate.
            self.sleep(1.00)
