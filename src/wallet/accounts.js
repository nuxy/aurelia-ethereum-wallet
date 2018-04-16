import {inject}               from 'aurelia-framework';
import {AureliaConfiguration} from 'aurelia-configuration';
import ethers                 from 'ethers';

// Local modules.
import {Storage} from 'lib/storage';

@inject(AureliaConfiguration)

/**
 * Wallet Accounts.
 */
export class WalletAccounts {

  /**
   * @var {Array} accounts
   */
  accounts = [];

  /**
   * Create a new instance of WalletAccounts.
   *
   * @param {AureliaConfiguration} config
   *   AureliaConfiguration instance.
   */
  constructor(config) {
    this.config  = config;

    // Initialize storage.
    this.storage = new Storage(
      config.get('storage.secretKey'),
      config.get('storage.prefix')
    );
  }

  /**
   * Create a new account.
   */
  create() {
    let wallet = ethers.Wallet.createRandom();

    this.accounts.push({
      balance: '0.00000000',
      wallet: wallet
    });

    this.storage.setItem('accounts', this.accounts);
  }

  /**
   * Rename an existing account.
   *
   * @param {String} address
   *   Wallet address.
   *
   * @param {String} value
   *   New title value.
   */
  rename(address, value) {
    this.accounts = this.accounts.map(account => {
      if (account.wallet.address === address) {
        account.title = value;
      }
      return account;
    });

    this.storage.setItem('accounts', this.accounts);
  }

  /**
   * Remove an existing account.
   *
   * @param {String} address
   *   Wallet address.
   */
  remove(address) {
    this.accounts = this.accounts.filter(account => {
      return account.wallet.address !== address;
    });

    this.storage.setItem('accounts', this.accounts);
  }
}
