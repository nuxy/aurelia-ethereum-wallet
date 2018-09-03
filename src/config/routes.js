import {inject} from 'aurelia-dependency-injection';
import {Router} from 'aurelia-router';

// Local modules.
import {Setup} from 'setup';

@inject(Router)

/**
 * Provides client-side route handler.
 *
 * @requires Router
 */
export class Routes {

  /**
   * Create a new instance of Routes.
   *
   * @param {Router} Router
   *   Router instance.
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
      config.options.pushState  = true;

      config.addPipelineStep('authorize', Setup);

      config.map([
        {
          route: ['', 'wallet/:option?'],
          name: 'wallet',
          moduleId: 'wallet',
          activationStrategy: 'replace',
          settings: { setup: true }
        },
        {
          route: ['setup'],
          name: 'setup',
          moduleId: 'setup'
        }
      ]);

      config.fallbackRoute('setup');
    });
  }
}
