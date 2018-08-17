import {inject}                         from 'aurelia-dependency-injection';
import {AureliaConfiguration as Config} from 'aurelia-configuration';
import ethers                           from 'ethers';

@inject(Config)

/**
 * Ethers wrapper (shorthand methods).
 *
 * @requires Config
 */
export class Ethers {

  /**
   * Create a new instance of Ethers.
   *
   * @param {Config} config
   *   Config instance.
   */
  constructor(config) {
    this.network = ethers.providers.networks[config.get('provider.name')];
  }

  /**
   * Return a new wallet instance.
   *
   * @memberof Ethers
   * @method createWallet
   *
   * @return {Object|null}
   */
  createWallet() {
    let instance = ethers.Wallet.createRandom();
    instance.provider = this.getProvider();
    return instance;
  }

  /**
   * Return a decrypted wallet instance.
   *
   * @memberof Ethers
   * @method decryptWallet
   *
   * @param {Object} obj
   *   Wallet object.
   *
   * @param {String} password
   *   Wallet password.
   *
   * @return {Promise}
   */
  decryptWallet(obj, password) {
    return ethers.Wallet.fromEncryptedWallet(obj, password)
      .then(instance => {
        instance.provider = this.getProvider();
        return instance;
      });
  }

  /**
   * Return Ether amount as decimal.
   *
   * @memberof Ethers
   * @method formatEther
   *
   * @param {String} amount
   *   Ethereum amount.
   *
   * @return {String}
   */
  formatEther(amount) {
    return ethers.utils.formatEther(amount, { pad: true });
  }

  /**
   * Return the network provider.
   *
   * @memberof Ethers
   * @method getProvider
   *
   * @return {Object}
   */
  getProvider() {
    return ethers.providers.getDefaultProvider(this.network);
  }

  /**
   * Return a parsed Ether as BigNumber.
   *
   * @memberof Ethers
   * @method parseEther
   *
   * @param {String} amount
   *   Ethereum amount.
   *
   * @return {String}
   */
  parseEther(amount) {
    return ethers.utils.parseEther(amount);
  }
}
