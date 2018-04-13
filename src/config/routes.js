'use strict';

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
          route: ['example'],
          name: 'example',
          moduleId: 'example'
        }
      ]);

      config.fallbackRoute('example');
    });
  }
}