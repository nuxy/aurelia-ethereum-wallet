import {inject} from 'aurelia-framework';

// Local modules.
import {Routes} from 'config/routes';

@inject(Routes)

/**
 * Main application.
 *
 * @requires Routes
 */
export class App {

  /**
   * Create a new instance of App.
   *
   * @param {Routes} Routes
   */
  constructor(Routes) {
    this.routes = Routes;
  }

  /**
   * @inheritdoc
   */
  activate() {
    this.routes.configure();
  }
}
