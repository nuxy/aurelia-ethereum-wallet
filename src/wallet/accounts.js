import {inject} from 'aurelia-dependency-injection';
import ethers   from 'ethers';

// Local modules.
import {Dialog}  from 'lib/dialog';
import {Storage} from 'lib/storage';

@inject(Dialog, Storage)

/**
 * Wallet Accounts.
 *
 * @requires Dialog
 * @requires Storage
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
   * @param {Dialog} Dialog
   *   Dialog instance.
   *
   * @param {Storage} Storage
   *   Storage instance.
   */
  constructor(Dialog, Storage) {
    this.dialog  = Dialog;
    this.storage = Storage;
  }

  /**
   * @inheritdoc
   */
  attached() {

    // Get stored accounts.
    let items = this.storage.getItem('accounts');
    if (items) {
      this.accounts = items;
    }
  }

  /**
   * Create a new account.
   */
  create() {

    // Prompt for account password.
    this.dialog.password(true)
      .then(response => {

        // Generate an encrypted wallet.
        let wallet = ethers.Wallet.createRandom();

        let callback = percent => {
          this.progress = parseInt(percent * 100, 10);
        };

        wallet.encrypt(response.output, callback)
          .then(json => {
            this.progress = 0;

            this.accounts.push({
              balance: '0.000000000000000000',
              address: wallet.address,
              wallet: json
            });

            this.storage.setItem('accounts', this.accounts);
          });
      });
  }

  /**
   * Remove an existing account.
   *
   * @param {String} address
   *   Wallet address.
   */
  remove(address) {

    // Confirm the action.
    this.dialog.confirm(`Remove: ${address}?`)
      .then(() => {

        // Delete from storage.
        this.accounts = this.accounts.filter(account => {
          return account.address !== address;
        });

        this.storage.setItem('accounts', this.accounts);
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
}
