#!/usr/bin/env python3

import asyncio
import sys
import time


async def main(is_test):
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
    await update_time(display)


async def update_time(display):
    state = None
    while True:
        new_state = get_state()
        if new_state != state:
            state = new_state
            hour, minute, colon = state
            hour = "%2d" % hour
            minute = "%02d" % minute
            display.set_digit(0, hour[0])
            display.set_digit(1, hour[1])
            display.set_digit(2, minute[0])
            display.set_digit(3, minute[1])
            display.set_colon(colon)
            display.write_display()
        # TODO(mbolin): Be smarter about picking sleep value.
        await asyncio.sleep(1.0)


def get_state():
    t = time.localtime()
    hour = t.tm_hour
    if hour == 0:
        hour = 12
    elif hour > 12:
        hour -= 12
    minute = t.tm_min
    colon = t.tm_sec % 2 == 0
    return (hour, minute, colon)


if __name__ == "__main__":
    is_test = len(sys.argv) > 1 and sys.argv[1] == "--test"
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main(is_test))
    loop.close()
