/**
 * Account actions.
 */
export class Account {

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
    if (routeConfig.name === 'account') {

      // Load action content.
      if (params.action) {
        this.action = params.action;

        // By route.
        this.model = 'account/' + this.action;
      } else {
        this.action = 'wallet';

        // Default page.
        this.model = 'account/balance';
      }
    }
  }
}
