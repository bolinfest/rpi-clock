const {EventEmitter} = require('events');

const DISPLAY_CHANGED_EVENT = 'display';

class Segment7Controller extends EventEmitter {
  constructor(client) {
    super();
    this._client = client;
    this._currentDisplay = {digits: ' '.repeat(4), colon: false};
  }

  async update(display) {
    const {digits, colon} = this._currentDisplay;
    if (digits !== display.digits || colon !== display.colon) {
      await this._client.setDisplay(display);
      this._currentDisplay = display;
      this.emit(DISPLAY_CHANGED_EVENT, display);
    }
  }

  getCurrentDisplay() {
    // For safety, return a copy of this._currentDisplay.
    // (Not using "object spread" in case running Node<8.3.)
    return Object.assign({}, this._currentDisplay);
  }
}

module.exports = {
  DISPLAY_CHANGED_EVENT,
  Segment7Controller,
};
