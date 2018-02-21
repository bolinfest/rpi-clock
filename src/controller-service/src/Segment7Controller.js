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
}

module.exports = {
  DISPLAY_CHANGED_EVENT,
  Segment7Controller,
};
