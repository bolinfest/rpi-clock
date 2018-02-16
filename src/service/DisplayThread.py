import time
import threading

class DisplayThread(threading.Thread):
    def __init__(self, controller):
        super(DisplayThread, self).__init__(name=self.__class__.__name__)
        self._controller = controller
        self._interrupted = False

    def run(self):
        '''Implementations should periodically check self.interrupted and should
        exit as soon as possible if it is set.
        '''
        pass

    def update(self, d0, d1, d2, d3, colon=False):
        self._controller.update(d0, d1, d2, d3, colon)

    def interrupt(self):
        self._interrupted = True

    @property
    def interrupted(self):
        return self._interrupted

    def sleep(self, duration_in_seconds=1.00):
        time.sleep(duration_in_seconds)
