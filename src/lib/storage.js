import {inject}                         from 'aurelia-dependency-injection';
import {AureliaConfiguration as Config} from 'aurelia-configuration';
import core                             from 'crypto-js';
import aes                              from 'crypto-js/aes';

@inject(Config)

/**
 * Provides methods for storing data.
 *
 * @requires Config
 */
export class Storage {

  /**
   * Create a new instance of Storage.
   *
   * @param {Config} Config
   *   Config instance.
   */
  constructor(Config) {
    this.config = Config
    this.prefix = this.config.get('storage.prefix');
  }

  /**
   * Return values for a given key.
   *
   * @memberof Storage
   * @method getItem
   *
   * @param {String} key
   *   Storage item key name.
   *
   * @param {String} secret
   *   Encrypt using secret (optional).
   *
   * @return {*|undefined}
   */
  getItem(key, secret = null) {
    if (typeof key === 'string') {
      let val = sessionStorage.getItem(this.getKeyName(key));
      if (val) {
        if (secret) {
          val = aes.decrypt(
            val, secret
          ).toString(core.enc.Utf8);
        }

        if (Storage.isValidJson(val)) {
          return JSON.parse(val);
        }
      }
    }
  }

  /**
   * Store values for a given key.
   *
   * @memberof Storage
   * @method setItem
   *
   * @param {String} key
   *   Storage item key name.
   *
   * @param {String} secret
   *   Encrypt using secret (optional).
   *
   * @param {*} data
   *   sessionStorage data.
   *
   * @return {Boolean|void}
   */
  setItem(key, data, secret = null) {
    if (typeof key === 'string') {
      if (secret) {
        data = aes.encrypt(
          JSON.stringify(data), secret
        ).toString();
      } else {
        data = JSON.stringify(data);
      }

      return sessionStorage.setItem(this.getKeyName(key), data);
    }
  }

  /**
   * Remove values for a given key.
   *
   * @memberof Storage
   * @method removeItem
   *
   * @param {String} key
   *   Storage item key name.
   *
   * @return {Boolean|void}
   */
  removeItem(key) {
    if (typeof key === 'string') {
      return sessionStorage.removeItem(this.getKeyName(key));
    }
  }

  /**
   * Return prefixed key name.
   *
   * @memberof Storage
   * @method getKeyName
   *
   * @param {String} str
   *   Storage item key name.
   *
   * @return {String}
   */
  getKeyName(str) {
    return this.prefix + str;
  }

  /**
   * Check string is valid JSON format.
   *
   * @memberof Storage
   * @method isValidJson
   * @static
   *
   * @param {String} str
   *   JSON as string.
   *
   * @return {Boolean|undefined}
   */
  static isValidJson(str) {
    if (typeof str === 'string') {
      try {
        JSON.parse(str);
      } catch (err) {
        return false;
      }

      return true;
    }
  }
}
