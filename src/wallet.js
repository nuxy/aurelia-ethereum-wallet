/**
 * Wallet actions.
 */
export class Wallet {

  /**
   * @var {String} action
   */
  action = null;

  /**
   * @var {String} model
   */
  model = null;

  /**
   * Create a new instance of Account.
   */
  constructor() {

  }

  /**
   * @inheritdoc
   */
  activate(params = null, routeConfig = null) {
    if (routeConfig.name === 'wallet') {

      // Load action content.
      if (params.action) {
        this.action = params.action;

        // By route.
        this.model = 'wallet/' + this.action;
      } else {
        this.action = 'accounts';

        // Default page.
        this.model = 'wallet/accounts';
      }
    }
  }
}
