import ethers from 'ethers';

/**
 * Wallet Accounts.
 */
export class WalletAccounts {

  /**
   * @var {Array} accounts
   */
  accounts = [];

  /**
   * Create a new instance of WalletAccounts.
   */
  constructor() {

  }

  /**
   * Create a new account.
   */
  create() {
    let account = ethers.Wallet.createRandom();

    this.accounts.push({
      address: account.address,
      balance: '0.00000000'
    });
  }

  /**
   * Rename an existing account.
   */
  rename(address, value) {
    this.accounts = this.accounts.map(account => {
      if (account.address === address) {
        account.title = value;
      }
      return account;
    });
  }

  /**
   * Remove an existing account.
   */
  remove(address) {
    this.accounts = this.accounts.filter(account => {
      return account.address !== address;
    });
  }
}
