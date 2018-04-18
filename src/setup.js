/**
 * Wallet setup.
 */
export class Setup {

  /**
   * @var {Boolean} isReady
   * @static
   */
  static isReady = true;

  /**
   * Create a new instance of Setup.
   */
  constructor() {

  }

  /**
   * @inheritdoc
   *
   * @see config.addPipelineStep
   */
  run(NavigationInstruction, next) {
    let setup = NavigationInstruction.getAllInstructions()
      .some(instruction => instruction.config.settings.setup);

    if (setup) {
      if (!Setup.isReady) {
        return next.cancel();
      }
    }

    return next();
  }
}
