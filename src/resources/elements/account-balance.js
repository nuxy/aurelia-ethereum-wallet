import {bindable, inject} from 'aurelia-framework';

// Local modules.
import {Dialog}  from 'lib/dialog';
import {Ethers}  from 'lib/ethers';
import {Storage} from 'lib/storage';
import {Utils}   from 'lib/utils';

@inject(Dialog, Ethers, Storage)

/**
 * Provides account balance element.
 *
 * @requires Dialog
 * @requires Ethers
 * @requires Storage
 */
export class AccountBalanceCustomElement {
  @bindable address;
  @bindable balance;
  @bindable wallet;

  /**
   * @var {Number} progress
   */
  progress = 0;

  /**
   * @var {Function} copy
   */
  copy = Utils.copyToClipboard;

  /**
   * Create a new instance of AccountBalanceCustomElement.
   *
   * @param {Dialog} Dialog
   *   Dialog instance.
   *
   * @param {Ethers} Ethers
   *   Ethers instance.
   *
   * @param {Storage} Storage
   *   Storage instance.
   */
  constructor(Dialog, Ethers, Storage) {
    this.dialog  = Dialog;
    this.ethers  = Ethers;
    this.storage = Storage;
  }

  /**
   * Sync account balance with Ethereum network.
   */
  submit() {

    // Prompt for wallet password.
    return this.dialog.password()
      .then(response => {
        let wallet = null;

        let tasks = [];

        // Decrypt the wallet.
        tasks.push(() => {
          return this.ethers.decryptWallet(this.wallet, response)
            .then(instance => wallet = instance);
        });

        // Query the provider.
        tasks.push(() => {
          return wallet.getBalance()
            .then(balance => {
              this.balance = this.ethers.formatEther(balance);
            });
        });

        // Execute actions.
        Utils.promiseTasks('Syncing wallet', tasks)
          .then(() => {
            this.update(this.balance);
          })
          .catch(() => {
            this.balance = 'Failed to connect...';
          });
      });
  }

  /**
   * Update balance for an existing account.
   *
   * @param {String} value
   *   New balance value.
   */
  update(value) {
    let items = this.storage.getItem('accounts');

    items.map(account => {
      if (account.address === this.address) {
        account.balance = value;
      }
      return account;
    });

    this.storage.setItem('accounts', items);
  }
}
