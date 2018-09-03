import {inject}                         from 'aurelia-dependency-injection';
import {AureliaConfiguration as Config} from 'aurelia-configuration';

// Local modules.
import {Events}  from 'lib/events';
import {Storage} from 'lib/storage';

@inject(Config, Events)

/**
 * Provides Storage methods with Events handling.
 *
 * @requires Config
 * @requires Events
 */
export class Actions extends Storage {

  /**
   * Create a new instance of Actions.
   *
   * @param {Config} Config
   *   Config instance.
   *
   * @param {Events} Events
   *   Events instance.
   */
  constructor(Config, Events) {
    super(Config);

    this.events = Events;
  }

  /**
   * @inheritdoc
   */
  getItem(key) {
    this.events
      .publish('getItem', { key });

    return super.getItem(key);
  }

  /**
   * @inheritdoc
   */
  setItem(key, data) {
    this.events
      .publish('setItem', { key, data });

    return super.setItem(key, data);
  }

  /**
   * @inheritdoc
   */
  removeItem(key) {
    this.events
      .publish('removeItem', { key });

    return super.removeItem(key);
  }

  /**
   * Observe set/remove events for a given key.
   *
   * @memberof Actions
   * @method listen
   *
   * @param {String} key
   *   Storage item key name.
   *
   * @param {Function} callback
   *   Event callback method.
   */
  listen(key, callback) {
    this.events
      .subscribe('setItem', obj => {
        if (obj && obj.key === key) {
          callback(obj.data);
        }
      });

    this.events
      .subscribe('removeItem', () => {
        callback();
      });
  }
}
