import {bindable, inject}               from 'aurelia-framework';
import {AureliaConfiguration as Config} from 'aurelia-configuration';
import {DialogService}                  from 'aurelia-dialog';
import ethers                           from 'ethers';

// Local modules.
import {DialogPassword} from 'dialog/password';
import {Storage}        from 'lib/storage';
import {Utils}          from 'lib/utils';

@inject(Config, DialogService)

/**
 * Provides account balance element.
 *
 * @requires Confid
 * @requires DialogService
 */
export class AccountBalanceCustomElement {
  @bindable address;
  @bindable balance;
  @bindable wallet;

  /**
   * Create a new instance of AccountBalanceCustomElement.
   *
   * @param {Config} Config
   *   Config instance.
   *
   * @param {DialogService} DialogService
   *   DialogService instance.
   */
  constructor(Config, DialogService) {
    this.config = Config;
    this.dialog = DialogService;

    // Initialize storage.
    this.storage = new Storage();
  }

  /**
   * Sync account balance with Ethereum network.
   */
  submit() {
    let network = ethers.providers.networks[this.config.get('provider.name')];

    this.balance = 0;

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
              this.wallet, response.output
            );
          });

          // Query the provider.
          tasks.push(wallet => {
            wallet.provider = ethers.providers.getDefaultProvider(network);

            return wallet.getBalance()
              .then(balance => {
                return ethers.utils.formatEther(balance, { pad: true });
              });
          });

          // Execute actions.
          Utils.promiseTasks('Syncing wallet', tasks)
            .then(balance => {
              this.update(this.balance = balance);
            })
            .catch(err => {
              this.balance = 'Failed to connect...';
            });
        }
      });
  }

  /**
   * Update balance for an existing account.
   *
   * @param {String} address
   *   Wallet address.
   *
   * @param {String} value
   *   New balance value.
   */
  update(address, value) {
    let items = this.storage.getItem('accounts');

    items.map(account => {
      if (account.address === address) {
        account.balance = value;
      }
      return account;
    });

    this.storage.setItem('accounts', items);
  }
}
