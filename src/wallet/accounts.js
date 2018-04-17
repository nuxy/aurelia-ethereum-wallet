import ethers from 'ethers';

// Local modules.
import {Storage} from 'lib/storage';

/**
 * Wallet Accounts.
 */
export class WalletAccounts {

  /**
   * @var {Array} accounts
   */
  accounts = null;

  /**
   * @var {Number} progress
   */
  progress = 0;

  /**
   * Create a new instance of WalletAccounts.
   */
  constructor() {

    // Initialize storage.
    this.storage = new Storage();
  }

  /**
   * @inheritdoc
   */
  attached() {
    this.accounts = this.storage.getItem('accounts') || [];
  }

  /**
   * Create a new account.
   */
  create() {
    let wallet = ethers.Wallet.createRandom();

    let callback = percent => {
      this.progress = parseInt(percent * 100);
    };

    wallet.encrypt(this.password, callback)
      .then(json => {
        this.progress = 0;

        this.accounts.push({
          balance: '0.00000000',
          address: wallet.address,
          wallet: json
        });

        this.storage.setItem('accounts', this.accounts);

        this.password = this.prompt = null;
      });
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
      if (account.address === address) {
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
      return account.address !== address;
    });

    this.storage.setItem('accounts', this.accounts);
  }
}
