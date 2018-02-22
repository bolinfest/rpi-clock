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
        // TODO(mbolin): Formatting, e.g., 90s as 1m30s.
        digits: String(i),
        colon: false,
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

module.exports = {
  TimerAction,
};
