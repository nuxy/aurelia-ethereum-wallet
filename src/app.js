import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';

// Local modules.
import {Routes} from 'config/routes';

@inject(Router, Routes)

/**
 * Main application.
 *
 * @requires Router
 * @requires Routes
 */
export class App {

  /**
   * @var {Router} router
   */
  router = null;

  /**
   * @var {Routes} routes
   */
  routes = null;

  /**
   * Create a new instance of App
   *
   * @param {Router} Router
   * @param {Routes} Routes
   */
  constructor(Router, Routes) {
    this.router = Router;
    this.routes = Routes;
  }

  /**
   * @inheritdoc
   */
  activate() {
    this.routes.configure();
  }
}
