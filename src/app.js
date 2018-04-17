import {inject} from 'aurelia-dependency-injection';

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
