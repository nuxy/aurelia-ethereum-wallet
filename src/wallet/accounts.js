import {inject} from 'aurelia-dependency-injection';
import download from 'downloadjs';

// Local modules.
import {Dialog}  from 'lib/dialog';
import {Ethers}  from 'lib/ethers';
import {Storage} from 'lib/storage';
import {Utils}   from 'lib/utils';

@inject(Dialog, Ethers, Storage)

/**
 * Wallet Accounts.
 *
 * @requires Dialog
 * @requires Ethers
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
   * @var {Function} copy
   */
  copy = Utils.copyToClipboard;

  /**
   * Create a new instance of WalletAccounts.
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

        // Generate a wallet instance.
        let wallet = this.ethers.createWallet();

        let timer = percent => {
          this.progress = parseInt(percent * 100, 10);
        };

        // Encrypt the wallet.
        wallet.encrypt(response, timer)
          .then(json => {
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
   * Export the account data as JSON.
   *
   * @param {String} address
   *   Wallet address.
   */
  export(address) {
    let data = (this.accounts.filter(account => {
      return account.address === address;
    }))[0];

    download(JSON.stringify(data), `${address}.json`, 'application/json');
  }

  /**
   * Import the account data as JSON.
   */
  import() {

    // Prompt backup file upload.
    this.dialog.file('Select a backup file (*.json)')
      .then(response => {
        let reader = new FileReader();

        reader.onload = () => {
          let data = JSON.parse(reader.result);

          // Check for an existing account.
          let exists = this.accounts.some(account => {
            return JSON.parse(account) === data;
          });

          if (!exists) {
            this.accounts.push(data);

            this.storage.setItem('accounts', this.accounts);
          }
        };

        reader.readAsText(response.item(0));
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
