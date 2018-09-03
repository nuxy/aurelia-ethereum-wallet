import {bindable, inject} from 'aurelia-framework';

// Local modules.
import {Actions} from 'lib/actions';
import {Dialog}  from 'lib/dialog';
import {Ethers}  from 'lib/ethers';
import {Utils}   from 'lib/utils';

@inject(Actions, Dialog, Ethers)

/**
 * Wallet / Send.
 *
 * @requires Actions
 * @requires Dialog
 * @requires Ethers
 */
export class WalletSend {
  @bindable selected = null;

  /**
   * @var {Array} accounts
   */
  accounts = null;

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
   * @var {Object} status
   */
  status = {};

  /**
   * Create a new instance of WalletSend.
   *
   * @param {Actions} Actions
   *   Actions instance.
   *
   * @param {Dialog} Dialog
   *   Dialog instance.
   *
   * @param {Ethers} Ethers
   *   Ethers instance.
   */
  constructor(Actions, Dialog, Ethers) {
    this.actions = Actions;
    this.dialog  = Dialog;
    this.ethers  = Ethers;
  }

  /**
   * @inheritdoc
   */
  attached() {
    this.accounts = this.actions.getItem('accounts') || [];

    // Select default values.
    this.matcher = (a, b) => {
      if (a && b) {
        return a.address === b.address;
      }
    };
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @inheritdoc
   */
  selectedChanged(newValue) {
    this.actions.setItem('selected', newValue);
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
