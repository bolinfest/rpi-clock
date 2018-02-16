from DisplayThread import DisplayThread


class CounterThread(DisplayThread):
    def run(self):
        for i in range(10000):
            if self.interrupted:
                break
            d0, d1, d2, d3 = '{:4d}'.format(i)
            self.update(d0, d1, d2, d3)
            self.sleep(0.5)
