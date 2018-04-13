import environment from './environment';

/**
 * Configure build environment.
 */
export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  // 3rd-party plugins.
  aurelia.use.plugin('aurelia-configuration');

  aurelia.start().then(() => aurelia.setRoot());
}
