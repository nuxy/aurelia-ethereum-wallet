import {inject}                         from 'aurelia-dependency-injection';
import {AureliaConfiguration as Config} from 'aurelia-configuration';
import ethers                           from 'ethers';

// Local modules.
import {Dialog}  from 'lib/dialog';
import {Storage} from 'lib/storage';
import {Utils}   from 'lib/utils';

@inject(Config, Dialog, Storage)

/**
 * Wallet / Send.
 *
 * @requires Config
 * @requires Dialog
 * @requires Storage
 */
export class WalletSend {

  /**
   * @var {Array} accounts
   */
  accounts = [];

  /**
   * @var {Function} matcher
   */
  matcher = null;

  /**
   * @var {String} status
   */
  status = null;

  /**
   * Create a new instance of WalletSend.
   *
   * @param {Config} Config
   *   Config instance.
   *
   * @param {Dialog} Dialog
   *   Dialog instance.
   *
   * @param {Storage} Storage
   *   Storage instance.
   */
  constructor(Config, Dialog, Storage) {
    this.config  = Config;
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

    // Select default values.
    this.matcher = (a, b) => {
      if (a && b) {
        return a.address === b.address;
      }
    };

    this.selected = this.storage.getItem('selected');

    // Remove stored item.
    this.storage.removeItem('selected');
  }

  /**
   * Send transaction to an address.
   */
  submit() {
    let network = ethers.providers.networks[this.config.get('provider.name')];

    // Prompt for wallet password.
    return this.dialog.password()
      .then(response => {
        let tasks = [];

        // Decrypt the wallet.
        tasks.push(() => {
          return ethers.Wallet.fromEncryptedWallet(
            this.selected.wallet, response.output
          );
        });

        // Transfer Ether amount.
        tasks.push(wallet => {
          wallet.provider = ethers.providers.getDefaultProvider(network);

          let amount = ethers.utils.parseEther(this.amount);

          let options = {
            gasLimit: 21000,
            gasPrice: ethers.utils.bigNumberify('20000000000')
          };

          return wallet.send(this.address, amount, options);
        });

        // Execute actions.
        Utils.promiseTasks('Sending transaction', tasks)
          .then(transaction => {
            this.status = {
              message: transaction
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
