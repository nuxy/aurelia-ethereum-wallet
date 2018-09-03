/**
 * Wallet actions.
 */
export class Wallet {

  /**
   * @var {String} model
   */
  model = null;

  /**
   * @var {String} option
   */
  option = 'accounts';

  /**
   * @inheritdoc
   */
  activate(params = null, routeConfig = null) {
    if (routeConfig.name === 'wallet') {
      if (params.option) {
        this.option = params.option;
      }

      this.model = 'wallet/' + this.option;
    }
  }
}
