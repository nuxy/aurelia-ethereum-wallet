import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(Router)

/**
 * Provides client-side route handler.
 *
 * @requires Router
 */
export class Routes {

  /**
   * @var {Router} router
   */
  router = null;

  /**
   * Create a new instance of Routes.
   *
   * @param {Router} Router
   *   Client-side router.
   */
  constructor(Router) {
    this.router = Router;
  }

  /**
   * @inheritdoc
   */
  configure() {
    this.router.configure(function(config) {
      config.options.hashChange = false;
      config.options.pushState = true;

      config.map([
        {
          route: [''],
          redirect: 'wallet/accounts'
        },
        {
          route: ['wallet/:action?'],
          name: 'wallet',
          moduleId: 'wallet',
          activationStrategy: 'replace'
        }
      ]);

      config.fallbackRoute('not-found');
    });
  }
}
