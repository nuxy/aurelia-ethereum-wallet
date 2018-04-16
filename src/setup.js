// Local modules.
import {Storage} from 'lib/storage';

/**
 * Wallet setup.
 */
export class Setup {

  /**
   * @var {Boolean} isReady
   * @static
   */
  static isReady = false;

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
    if (NavigationInstruction.getAllInstructions().some(instruction => instruction.config.settings.setup)) {
      if (!Setup.isReady) {
        return next.cancel();
      }
    }

    return next();
  }
}
