import {inject}           from 'aurelia-dependency-injection';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController)

/**
 * Dialog / Alert.
 *
 * @requires DialogController
 */
export class DialogAlert {

  /**
   * @var {String} message
   */
  message = null;

  /**
   * Create a new instance of DialogController.
   *
   * @param {DialogController} DialogController
   *   DialogController instance.
   */
  constructor(DialogController) {
    this.dialog = DialogController;

    // Dialog properties.
    this.dialog.settings.centerHorizontalOnly = true;
  }

  /**
   * @inheritdoc
   */
  activate(params = null) {
    if (params.message) {
      this.message = params.message;
    }
  }
}
