const {DISPLAY_CHANGED_EVENT} = require('./Segment7Controller');
const {ClockAction} = require('./ClockAction');
const {CountAction} = require('./CountAction');

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

  enableCounter(call, callback) {
    const counterOptions = call.request;
    this._enableCounterImpl(counterOptions);
    callback(null, {});
  }

  _enableCounterImpl(counterOptions) {
    // TODO(mbolin): Honor counterOptions.
    const countAction = new CountAction(this._controller);
    this._replaceAction(countAction);
  }

  _replaceAction(newAction) {
    if (this._currentAction != null) {
      this._currentAction.stop();
    }
    this._currentAction = newAction;
    newAction.run();
  }

  subscribeToDisplay(call) {
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
