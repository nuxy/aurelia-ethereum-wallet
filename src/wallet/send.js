import {inject}        from 'aurelia-dependency-injection';
import {DialogService} from 'aurelia-dialog';
import ethers          from 'ethers';

// Local modules.
import {DialogPassword} from 'dialog/password';
import {Storage}        from 'lib/storage';
import {Utils}          from 'lib/utils';

@inject(DialogService)

/**
 * Wallet / Send.
 *
 * @requires DialogService
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
   * @var {String} selected
   */
  selected = null;

  /**
   * @var {String} status
   */
  status = null;

  /**
   * Create a new instance of WalletSend.
   *
   * @param {DialogService} DialogService
   *   DialogService instance.
   */
  constructor(DialogService) {
    this.dialog = DialogService;

    // Initialize storage.
    this.storage = new Storage();
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

    // Prompt for wallet password.
    return this.dialog
      .open({
        viewModel: DialogPassword,
        model: 'Enter your account password'
      })
      .whenClosed(response => {
        if (response.wasCancelled === false) {
          let tasks = [];

          // Decrypt the wallet.
          tasks.push(() => {
            return ethers.Wallet.fromEncryptedWallet(
              this.selected.wallet, response.output
            );
          });

          // Transer Ether amount.
          tasks.push(wallet => {
            wallet.provider = ethers.providers.getDefaultProvider();

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
        }
      });
  }
}
