const {DISPLAY_CHANGED_EVENT} = require('./Segment7Controller');
const {ClockAction} = require('./ClockAction');
const {TimerAction} = require('./TimerAction');

class Server {
  constructor(controller) {
    this._controller = controller;
    this._currentAction = null;
    // Start the clock by default.
    this._enableClockImpl({is24Hour: false});
  }

  enableClock(call, callback) {
    const clockOptions = call.request;
    this._enableClockImpl(clockOptions);
    callback(null, {});
  }

  _enableClockImpl(clockOptions) {
    const clockAction = new ClockAction(
      clockOptions.is24Hour,
      this._controller
    );
    this._replaceAction(clockAction);
  }

  startTimer(call, callback) {
    const timerOptions = call.request;
    this._startTimerImpl(timerOptions);
    callback(null, {});
  }

  _startTimerImpl(timerOptions) {
    const timerAction = new TimerAction(timerOptions.seconds, this._controller);
    this._replaceAction(timerAction);
  }

  _replaceAction(newAction) {
    if (this._currentAction != null) {
      this._currentAction.stop();
    }
    this._currentAction = newAction;
    newAction.run();
  }

  subscribeToDisplay(call) {
    // Start by sending the current value of the display.
    call.write(this._controller.getCurrentDisplay());

    const listener = display => call.write(display);
    this._controller.on(DISPLAY_CHANGED_EVENT, listener);
    call.on('end', () =>
      this._controller.removeListener(DISPLAY_CHANGED_EVENT, listener)
    );
  }
}

module.exports = {
  Server,
};
