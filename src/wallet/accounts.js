import {inject}        from 'aurelia-dependency-injection';
import {DialogService} from 'aurelia-dialog';
import {Router}        from 'aurelia-router';
import ethers          from 'ethers';

// Local modules.
import {DialogConfirm}  from 'dialog/confirm';
import {DialogPassword} from 'dialog/password';
import {Storage}        from 'lib/storage';

@inject(DialogService, Router)

/**
 * Wallet Accounts.
 *
 * @requires DialogService
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
   * @param {DialogService} DialogService
   *   DialogService instance.
   *
   * @param {Router} Router
   *   Router instance.
   */
  constructor(DialogService, Router) {
    this.dialog = DialogService;
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
    this.dialog
      .open({
        viewModel: DialogPassword,
        model: 'Enter the password to protect this account'
      })
      .whenClosed(response => {
        if (response.wasCancelled === false) {

          // Generate an encrypted wallet.
          let wallet = ethers.Wallet.createRandom();

          let callback = percent => {
            this.progress = parseInt(percent * 100, 10);
          };

          wallet.encrypt(response.output, callback)
            .then(json => {
              this.progress = 0;

              this.accounts.push({
                balance: '0.00000000',
                address: wallet.address,
                wallet: json
              });

              this.storage.setItem('accounts', this.accounts);
            });
        }
      });
  }

  /**
   * Remove an existing account.
   *
   * @param {String} address
   *   Wallet address.
   */
  remove(address) {
    this.dialog
      .open({
        viewModel: DialogConfirm,
        model: `Remove: ${address}?`
      })
      .whenClosed(response => {
        if (response.wasCancelled === false) {

          // Delete from storage.
          this.accounts = this.accounts.filter(account => {
            return account.address !== address;
          });

          this.storage.setItem('accounts', this.accounts);
        }
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
