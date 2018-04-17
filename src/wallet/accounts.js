import {inject} from 'aurelia-dependency-injection';
import {Router} from 'aurelia-router';
import ethers   from 'ethers';

// Local modules.
import {Storage} from 'lib/storage';

@inject(Router)

/**
 * Wallet Accounts.
 *
 * @requires Router
 */
export class WalletAccounts {

  /**
   * @var {Array} accounts
   */
  accounts = [];

  /**
   * @var {Number} progress
   */
  progress = 0;

  /**
   * Create a new instance of WalletAccounts.
   *
   * @param {Router} Router
   *   Router instance.
   */
  constructor(Router) {
    this.router = Router;

    // Initialize storage.
    this.storage = new Storage();
  }

  /**
   * @inheritdoc
   */
  attached() {
    let items = this.storage.getItem('accounts');
    if (items) {
      this.accounts = items;
    }
  }

  /**
   * Create a new account.
   */
  create() {
    let wallet = ethers.Wallet.createRandom();

    let callback = percent => {
      this.progress = parseInt(percent * 100, 10);
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
   * Remove an existing account.
   *
   * @param {String} address
   *   Wallet address.
   */
  remove(address) {
    if (window.confirm(`Remove: ${address}?`)) {
      this.accounts = this.accounts.filter(account => {
        return account.address !== address;
      });

      this.storage.setItem('accounts', this.accounts);
    }
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
   * Store account and redirect.
   *
   * @param {String} route
   *   Route name to redirect.
   *
   * @param {String} address
   *   Wallet account.
   */
  action(route, account) {
    this.storage.setItem('selected', account);

    this.router.navigate(route);
  }
}
