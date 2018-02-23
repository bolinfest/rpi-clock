const {pad} = require('./pad');

class TimerAction {
  constructor(seconds, controller) {
    this._seconds = seconds;
    this._controller = controller;
    this._id = null;
  }

  run() {
    // TODO(mbolin): Use precise timing logic.
    let i = this._seconds;
    this._id = setInterval(async () => {
      await this._controller.update({
        digits: formatSeconds(i),
        colon: true,
      });
      i--;
      if (i < 0) {
        i = 0;
      }
    }, 1000);
  }

  stop() {
    if (this._id != null) {
      clearInterval(this._id);
      this._id = null;
    }
  }
}

function formatSeconds(timeInSeconds) {
  const seconds = timeInSeconds % 60;
  const minutes = (timeInSeconds - seconds) / 60;
  if (minutes > 0) {
    return pad(minutes, ' ') + pad(seconds);
  } else {
    // Seconds only.
    return '  ' + pad(seconds);
  }
}

module.exports = {
  TimerAction,
};
