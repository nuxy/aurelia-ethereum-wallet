import {inject}           from 'aurelia-dependency-injection';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController)

/**
 * Dialog / Confirm.
 *
 * @requires DialogController
 */
export class DialogConfirm {

  /**
   * @var {String} answer
   */
  answer = null;

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
  activate(message) {
    this.message = message;
  }
}
