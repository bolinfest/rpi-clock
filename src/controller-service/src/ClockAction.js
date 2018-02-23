const {pad} = require('./pad');

class ClockAction {
  constructor(is24Hour, controller) {
    this._is24Hour = is24Hour;
    this._controller = controller;
    this._id = null;
  }

  run() {
    // We run the loop more often than every 1000ms to try to minimize
    // clock skew.
    this._id = setInterval(async () => {
      const date = new Date();
      let hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();

      let digits;
      if (this._is24Hour) {
        digits = `${pad(hour)}${pad(minute)}`;
      } else {
        if (hour === 0) {
          hour = 12;
        } else if (hour > 12) {
          hour -= 12;
        }
        digits = `${pad(hour, ' ')}${pad(minute)}`;
      }
      const colon = second % 2 == 0;

      await this._controller.update({
        digits,
        colon,
      });
    }, 75);
  }

  stop() {
    if (this._id != null) {
      clearInterval(this._id);
      this._id = null;
    }
  }
}

module.exports = {
  ClockAction,
};
