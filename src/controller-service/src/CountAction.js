class CountAction {
  constructor(controller) {
    this._controller = controller;
    this._id = null;
  }

  run() {
    let i = 0;
    this._id = setInterval(async () => {
      await this._controller.update({
        digits: String(i),
        colon: false,
      });
      i++;
      if (i >= 10000) {
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
  CountAction,
};
