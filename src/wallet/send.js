import {inject} from 'aurelia-dependency-injection';

// Local modules.
import {Dialog}  from 'lib/dialog';
import {Ethers}  from 'lib/ethers';
import {Storage} from 'lib/storage';
import {Utils}   from 'lib/utils';

@inject(Dialog, Ethers, Storage)

/**
 * Wallet / Send.
 *
 * @requires Dialog
 * @requires Ethers
 * @requires Storage
 */
export class WalletSend {

  /**
   * @var {Array} accounts
   */
  accounts = [];

  /**
   * @var {String} address
   */
  address = null;

  /**
   * @var {String} amount
   */
  amount = null;

  /**
   * @var {Function} matcher
   */
  matcher = null;

  /**
   * @var {Object} wallet
   */
  selected = null;

  /**
   * @var {String} status
   */
  status = null;

  /**
   * Create a new instance of WalletSend.
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

    // Select default values.
    this.matcher = (a, b) => {
      if (a && b) {
        return a.address === b.address;
      }
    };
  }

  /**
   * Send transaction to an address.
   */
  submit() {
    let transaction = {
      to: this.address,
      value: this.ethers.parseEther(this.amount)
    };

    // Prompt for wallet password.
    return this.dialog.password()
      .then(response => {
        let wallet = null;

        let tasks = [];

        // Decrypt the wallet.
        tasks.push(() => {
          return this.ethers.decryptWallet(this.selected, response)
            .then(instance => wallet = instance);
        });

        // Estimate the Gas price.
        tasks.push(() => {
          return wallet.estimateGas(transaction)
            .then(price => transaction.gasPrice = price);
        });

        // Transfer Ether amount.
        tasks.push(() => {
          return wallet.sendTransaction(transaction);
        });

        // Execute actions.
        Utils.promiseTasks('Sending transaction', tasks)
          .then(details => {
            this.status = {
              message: details
            };
          })
          .catch(err => {
            this.status = {
              error: true,
              message: err
            };
          });
      });
  }
}
